/**
 * Content Creation Templates
 * Pre-defined structures for different types of creator content
 * Supports Persian/RTL content
 */

import type { ContentType } from "@/types/creator";

/**
 * Template field definition
 */
export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date" | "tags";
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  options?: Array<{ label: string; value: string }>;
  hint?: string;
}

/**
 * Content template structure
 */
export interface ContentTemplate {
  id: string;
  name: string;
  nameFA?: string; // Persian name
  description: string;
  descriptionFA?: string; // Persian description
  type: ContentType;
  icon: string;
  category: "quick" | "detailed" | "interactive";
  fields: TemplateField[];
  example: string;
  exampleFA?: string;
  estimatedTime: number; // in minutes
  difficulty: "easy" | "medium" | "hard";
  isRTL: boolean; // RTL support flag
}

/**
 * All available content templates
 */
export const CONTENT_TEMPLATES: ContentTemplate[] = [
  // Hot Take / Opinion
  {
    id: "hot_take",
    name: "Hot Take",
    nameFA: "نظر داغ",
    description: "Share a controversial or bold opinion about football",
    descriptionFA: "یک نظر جنجالی یا جسورانه درباره فوتبال",
    type: "analysis",
    icon: "🔥",
    category: "quick",
    fields: [
      {
        id: "title",
        label: "Your Take",
        type: "text",
        placeholder: "What's your bold opinion?",
        required: true,
        maxLength: 100,
      },
      {
        id: "description",
        label: "Explain your reasoning",
        type: "textarea",
        placeholder: "Why do you think this? What evidence supports it?",
        required: true,
        maxLength: 500,
      },
      {
        id: "tags",
        label: "Tags",
        type: "tags",
        placeholder: "Add relevant topics",
        required: false,
      },
    ],
    example:
      "Title: 'Defense is more important than attack in modern football'",
    exampleFA: "عنوان: 'دفاع مهمتر از حمله در فوتبال مدرن است'",
    estimatedTime: 3,
    difficulty: "easy",
    isRTL: true,
  },

  // Meme Template
  {
    id: "meme",
    name: "Meme",
    nameFA: "میم",
    description: "Create a funny meme or reaction image",
    descriptionFA: "یک میم خنده دار یا تصویر واکنش بسازید",
    type: "meme",
    icon: "😂",
    category: "quick",
    fields: [
      {
        id: "title",
        label: "Meme Title",
        type: "text",
        placeholder: "What's the meme about?",
        required: true,
        maxLength: 100,
      },
      {
        id: "image",
        label: "Image/GIF",
        type: "text",
        placeholder: "Upload or paste image URL",
        required: true,
      },
      {
        id: "caption",
        label: "Caption",
        type: "textarea",
        placeholder: "Add your funny caption",
        required: false,
        maxLength: 200,
      },
    ],
    example: "Title: 'When your team scores in the 90th minute'",
    exampleFA: "عنوان: 'وقتی تیمت در دقیقه 90 گل می‌زند'",
    estimatedTime: 5,
    difficulty: "easy",
    isRTL: true,
  },

  // Match Analysis
  {
    id: "match_analysis",
    name: "Match Analysis",
    nameFA: "تحلیل بازی",
    description: "Deep dive analysis of a football match",
    descriptionFA: "تحلیل عمیق یک بازی فوتبال",
    type: "analysis",
    icon: "📊",
    category: "detailed",
    fields: [
      {
        id: "match",
        label: "Which match?",
        type: "text",
        placeholder: "Team A vs Team B",
        required: true,
        maxLength: 100,
      },
      {
        id: "title",
        label: "Analysis Title",
        type: "text",
        placeholder: "Key insights from the match",
        required: true,
        maxLength: 100,
      },
      {
        id: "formations",
        label: "Team Formations",
        type: "text",
        placeholder: "e.g., 4-3-3 vs 3-5-2",
        required: false,
        maxLength: 50,
      },
      {
        id: "analysis",
        label: "Tactical Analysis",
        type: "textarea",
        placeholder: "Analyze the tactics, key plays, turning points",
        required: true,
        maxLength: 1000,
      },
      {
        id: "bestPlayers",
        label: "Best Performers",
        type: "textarea",
        placeholder: "Who stood out? Why?",
        required: false,
        maxLength: 300,
      },
    ],
    example: "Title: 'How Team A's pressing dominance changed the game'",
    exampleFA: "عنوان: 'چگونه فشار تاکتیکی تیم A بازی را تغییر داد'",
    estimatedTime: 15,
    difficulty: "hard",
    isRTL: true,
  },

  // Player Spotlight
  {
    id: "player_spotlight",
    name: "Player Spotlight",
    nameFA: "نمایش بازیکن",
    description: "Highlight a player's performance or career",
    descriptionFA: "درخشش عملکرد یا شغل بازیکن",
    type: "highlight",
    icon: "⭐",
    category: "detailed",
    fields: [
      {
        id: "playerName",
        label: "Player Name",
        type: "text",
        placeholder: "Which player?",
        required: true,
        maxLength: 100,
      },
      {
        id: "title",
        label: "Spotlight Title",
        type: "text",
        placeholder: "Why this player? What's notable?",
        required: true,
        maxLength: 100,
      },
      {
        id: "background",
        label: "Background",
        type: "textarea",
        placeholder: "Player's history and career path",
        required: false,
        maxLength: 300,
      },
      {
        id: "strength",
        label: "Key Strengths",
        type: "textarea",
        placeholder: "What makes them special?",
        required: true,
        maxLength: 300,
      },
      {
        id: "stats",
        label: "Notable Stats",
        type: "textarea",
        placeholder: "Goals, assists, records",
        required: false,
        maxLength: 200,
      },
    ],
    example: "Title: 'The Rise of Rising Star: From Unknown to Elite'",
    exampleFA: "عنوان: 'ظهور ستاره نو: از ناشناخته تا الیت'",
    estimatedTime: 12,
    difficulty: "medium",
    isRTL: true,
  },

  // Prediction
  {
    id: "prediction",
    name: "Prediction Post",
    nameFA: "پیش‌بینی",
    description: "Make a prediction for an upcoming match",
    descriptionFA: "یک پیش‌بینی برای بازی آینده",
    type: "prediction",
    icon: "🔮",
    category: "quick",
    fields: [
      {
        id: "match",
        label: "Match",
        type: "text",
        placeholder: "Which match are you predicting?",
        required: true,
        maxLength: 100,
      },
      {
        id: "prediction",
        label: "Your Prediction",
        type: "select",
        required: true,
        options: [
          { label: "Home Win", value: "home_win" },
          { label: "Draw", value: "draw" },
          { label: "Away Win", value: "away_win" },
        ],
      },
      {
        id: "confidence",
        label: "Confidence Level",
        type: "select",
        required: true,
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ],
      },
      {
        id: "reasoning",
        label: "Your Reasoning",
        type: "textarea",
        placeholder: "Why do you predict this outcome?",
        required: false,
        maxLength: 300,
      },
    ],
    example: "Prediction: Team A will win. Confidence: High",
    exampleFA: "پیش‌بینی: تیم الف برنده خواهد شد. اعتماد: بالا",
    estimatedTime: 3,
    difficulty: "easy",
    isRTL: true,
  },

  // Quiz
  {
    id: "quiz",
    name: "Interactive Quiz",
    nameFA: "کویز تعاملی",
    description: "Create a fun football knowledge quiz",
    descriptionFA: "یک کویز دانش فوتبال",
    type: "quiz",
    icon: "❓",
    category: "detailed",
    fields: [
      {
        id: "title",
        label: "Quiz Title",
        type: "text",
        placeholder: "What's your quiz about?",
        required: true,
        maxLength: 100,
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        placeholder: "What will players learn?",
        required: false,
        maxLength: 200,
      },
      {
        id: "difficulty",
        label: "Difficulty",
        type: "select",
        required: true,
        options: [
          { label: "Easy", value: "easy" },
          { label: "Medium", value: "medium" },
          { label: "Hard", value: "hard" },
        ],
      },
      {
        id: "questions",
        label: "Questions (JSON format)",
        type: "textarea",
        placeholder:
          '[{"q": "Question?", "a": "Answer", "wrong": ["W1", "W2"]}]',
        required: true,
      },
    ],
    example: 'Quiz: "Can you guess the player from their stats?"',
    exampleFA: 'کویز: "می‌تونی بازیکن رو از آمار حدس بزنی؟"',
    estimatedTime: 20,
    difficulty: "hard",
    isRTL: true,
  },

  // Discussion Post
  {
    id: "discussion",
    name: "Discussion Topic",
    nameFA: "موضوع بحث",
    description: "Start a discussion with the community",
    descriptionFA: "یک بحث با جامعه شروع کنید",
    type: "discussion",
    icon: "💬",
    category: "quick",
    fields: [
      {
        id: "title",
        label: "Discussion Topic",
        type: "text",
        placeholder: "What do you want to discuss?",
        required: true,
        maxLength: 150,
      },
      {
        id: "prompt",
        label: "Opening Question",
        type: "textarea",
        placeholder: "Ask a question to kick off discussion",
        required: true,
        maxLength: 400,
      },
      {
        id: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { label: "Tactics", value: "tactics" },
          { label: "Players", value: "players" },
          { label: "Drama", value: "drama" },
          { label: "Rules", value: "rules" },
          { label: "Other", value: "other" },
        ],
      },
    ],
    example: 'Topic: "Is VAR good for football?"',
    exampleFA: 'موضوع: "آیا VAR برای فوتبال خوب است؟"',
    estimatedTime: 5,
    difficulty: "easy",
    isRTL: true,
  },

  // Tutorial / How-To
  {
    id: "tutorial",
    name: "Football Tutorial",
    nameFA: "آموزش فوتبال",
    description: "Teach viewers a football skill or concept",
    descriptionFA: "به بینندگان یک مهارت یا مفهوم فوتبال بیاموزید",
    type: "tutorial",
    icon: "📖",
    category: "detailed",
    fields: [
      {
        id: "title",
        label: "Tutorial Title",
        type: "text",
        placeholder: "What are you teaching?",
        required: true,
        maxLength: 100,
      },
      {
        id: "intro",
        label: "Introduction",
        type: "textarea",
        placeholder: "Why is this important?",
        required: true,
        maxLength: 200,
      },
      {
        id: "steps",
        label: "Step-by-Step Instructions",
        type: "textarea",
        placeholder: "List each step clearly",
        required: true,
        maxLength: 1000,
      },
      {
        id: "tips",
        label: "Pro Tips",
        type: "textarea",
        placeholder: "Any advanced tips or common mistakes?",
        required: false,
        maxLength: 300,
      },
    ],
    example: "Tutorial: 'How to improve your heading technique'",
    exampleFA: "آموزش: 'چگونه تکنیک سرزنی خود را بهبود دهید'",
    estimatedTime: 15,
    difficulty: "medium",
    isRTL: true,
  },
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ContentTemplate | undefined {
  return CONTENT_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get templates by content type
 */
export function getTemplatesByType(type: ContentType): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.type === type);
}

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(
  difficulty: "easy" | "medium" | "hard"
): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.difficulty === difficulty);
}

/**
 * Get quick templates (takes less than 10 minutes)
 */
export function getQuickTemplates(): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.estimatedTime < 10);
}

/**
 * Get templates for beginners
 */
export function getBeginnerTemplates(): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.difficulty === "easy");
}

/**
 * Suggest templates based on user behavior
 */
export function suggestTemplates(
  userPlatformUsage: "new" | "casual" | "active" | "power_user"
): ContentTemplate[] {
  switch (userPlatformUsage) {
    case "new":
      return getBeginnerTemplates().slice(0, 3);
    case "casual":
      return getQuickTemplates().slice(0, 4);
    case "active":
      return CONTENT_TEMPLATES.filter((t) => t.difficulty !== "hard").slice(
        0,
        5
      );
    case "power_user":
      return CONTENT_TEMPLATES;
  }
}

/**
 * Get RTL-optimized templates
 */
export function getRTLTemplates(): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.isRTL);
}
