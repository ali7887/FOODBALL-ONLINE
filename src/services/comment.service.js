const { Comment, User, Reaction } = require('../../database/models');
const { ActivityLog } = require('../../database/models');
const activityLogger = require('../../database/middleware/activityLogger');

class CommentService {
  // Create a new comment
  async createComment(userId, data) {
    const { entityType, entityId, content } = data;

    // Parse mentions from content (@username)
    const mentions = await this.parseMentions(content);

    const comment = await Comment.create({
      user: userId,
      entityType,
      entityId,
      content,
      mentions,
    });

    // Populate user data
    await comment.populate('user', 'username displayName avatar');

    // Log activity
    await activityLogger.logActivity({
      user: userId,
      activityType: 'comment_created',
      action: `نظر جدید در ${entityType === 'player' ? 'بازیکن' : 'شایعه'}`,
      targetType: entityType,
      targetId: entityId,
      metadata: { commentId: comment._id },
      pointsEarned: 5, // Points for commenting
    });

    // Create notifications for mentioned users
    if (mentions.length > 0) {
      const commentUser = await User.findById(userId);
      const userName = commentUser?.displayName || commentUser?.username || 'کاربر';
      
      for (const mentionedUserId of mentions) {
        await activityLogger.logActivity({
          user: mentionedUserId,
          activityType: 'user_mentioned',
          action: `${userName} شما را منشن کرد`,
          targetType: 'comment',
          targetId: comment._id,
          metadata: { mentionedBy: userId },
        });
      }
    }

    return comment;
  }

  // Get comments for an entity
  async getComments(entityType, entityId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      entityType,
      entityId,
    })
      .populate('user', 'username displayName avatar')
      .populate('mentions', 'username displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ entityType, entityId });

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Delete a comment (owner only)
  async deleteComment(commentId, userId) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error('نظر پیدا نشد');
    }

    if (comment.user.toString() !== userId.toString()) {
      throw new Error('شما اجازه حذف این نظر را ندارید');
    }

    // Delete all reactions for this comment
    await Reaction.deleteMany({
      targetType: 'comment',
      targetId: commentId,
    });

    await comment.deleteOne();

    return { success: true };
  }

  // Parse @username mentions from content
  async parseMentions(content) {
    const mentionRegex = /@(\w+)/g;
    const matches = content.match(mentionRegex);

    if (!matches) {
      return [];
    }

    const usernames = matches.map((match) => match.substring(1)); // Remove @
    const users = await User.find({ username: { $in: usernames } });

    return users.map((user) => user._id);
  }
}

module.exports = new CommentService();

