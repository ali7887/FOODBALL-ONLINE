'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerCard } from '@/components/players/PlayerCard';
import { TransferRumorCard } from '@/components/rumors/TransferRumorCard';
import { apiClient } from '@/lib/api-client';
import { PersonalizedFeed } from '@/components/feed/PersonalizedFeed';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickStatsBar } from '@/components/home/QuickStatsBar';
import { SectionHeader } from '@/components/home/SectionHeader';
import { FeaturedMatchMenu } from '@/components/home/FeaturedMatchMenu';
import { LeaderboardPreview } from '@/components/home/LeaderboardPreview';
import { CTASection } from '@/components/home/CTASection';
import { TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export function HomePage() {
  const [trendingPlayers, setTrendingPlayers] = useState<any[]>([]);
  const [rumors, setRumors] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [featuredMatch, setFeaturedMatch] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalVotes: 0,
    activeUsers: 0,
    hotRumors: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [playersRes, rumorsRes, leaderboardRes] = await Promise.all([
          apiClient.getPlayers({ limit: 6, sortBy: 'marketValue', sortOrder: 'desc' }),
          apiClient.getRumors({ limit: 6, status: 'active', sortBy: 'probability', sortOrder: 'desc' }),
          apiClient.getLeaderboard({ limit: 5 }),
        ]);

        setTrendingPlayers(playersRes.data?.players || []);
        setRumors(rumorsRes.data?.rumors || []);
        setLeaderboard(leaderboardRes.data?.leaderboard || []);

        // Calculate stats
        setStats({
          totalPlayers: playersRes.data?.pagination?.total || 0,
          totalVotes: (playersRes.data?.players || []).reduce((sum: number, p: any) => sum + (p.marketValueVoteCount || 0), 0),
          activeUsers: leaderboardRes.data?.pagination?.total || 0,
          hotRumors: (rumorsRes.data?.rumors || []).filter((r: any) => r.probability >= 70).length,
        });

        // TODO: Fetch featured match from API when available
        // For now, we'll skip it
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (error.message?.includes('سرور در دسترس نیست')) {
          console.warn('Backend server is not running. Showing empty states.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection match={featuredMatch} />

      {/* Quick Stats Bar */}
      <QuickStatsBar stats={stats} />

      {/* Personalized Feed Tab (for authenticated users) */}
      {isAuthenticated && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="personalized" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md mx-auto">
                <TabsTrigger value="personalized" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>فید شخصی‌سازی شده</span>
                </TabsTrigger>
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>همه محتوا</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personalized" className="space-y-6">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <PersonalizedFeed showFilters={true} showSortOptions={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="general" className="space-y-6">
                <GeneralContentSections
                  trendingPlayers={trendingPlayers}
                  rumors={rumors}
                  leaderboard={leaderboard}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      {/* General Content (for non-authenticated users) */}
      {!isAuthenticated && (
        <GeneralContentSections
          trendingPlayers={trendingPlayers}
          rumors={rumors}
          leaderboard={leaderboard}
          loading={loading}
        />
      )}

      {/* Featured Match Menu */}
      {featuredMatch && <FeaturedMatchMenu match={featuredMatch} />}

      {/* Leaderboard Preview */}
      {leaderboard.length > 0 && <LeaderboardPreview topUsers={leaderboard} />}

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

interface GeneralContentSectionsProps {
  trendingPlayers: any[];
  rumors: any[];
  leaderboard: any[];
  loading: boolean;
}

function GeneralContentSections({ trendingPlayers, rumors, leaderboard, loading }: GeneralContentSectionsProps) {
  return (
    <>
      {/* Featured Players */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="بازیکنان برتر"
            subtitle="بر اساس ارزش بازار"
            icon="⭐"
            action={
              <Link href="/players" className="text-tm-green hover:underline text-sm font-medium">
                مشاهده همه ←
              </Link>
            }
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-48 w-full mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trendingPlayers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">هنوز بازیکنی اضافه نشده، تو شروعش کن 😉</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPlayers.map((player) => (
                <PlayerCard key={player._id} player={player} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hot Transfer Rumors */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="شایعات داغ"
            subtitle="احتمال بالای انتقال"
            icon="🔥"
            action={
              <Link href="/rumors" className="text-tm-green hover:underline text-sm font-medium">
                مشاهده همه ←
              </Link>
            }
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-20 w-full mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : rumors.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">هنوز شایعه‌ای ثبت نشده، تو اولین شایعه رو ثبت کن! 🍕</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rumors.map((rumor) => (
                <TransferRumorCard key={rumor._id} rumor={rumor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
