import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Eye, MousePointerClick, CreditCard, ArrowUpRight } from 'lucide-react';
import { formatNumber, formatRelativeTime } from '@/lib/utils/cn';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  // Get stats
  const { count: viewsCount } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id);

  const { count: clicksCount } = await supabase
    .from('link_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id);

  const { count: linksCount } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id);

  const { count: cardsCount } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_to', user!.id);

  // Get recent activity
  const { data: recentViews } = await supabase
    .from('page_views')
    .select('*')
    .eq('user_id', user!.id)
    .order('viewed_at', { ascending: false })
    .limit(5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, {profile?.full_name || 'there'}!
        </p>
      </div>

      {/* Quick Actions */}
      {!profile?.username && (
        <div className="mb-8 glass rounded-xl p-6 border-2 border-brand-gold/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Complete Your Profile</h3>
              <p className="text-gray-400 text-sm mb-4">
                Choose a username to activate your public profile page
              </p>
              <Link href="/dashboard/profile">
                <Button size="sm">
                  Set Up Profile
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Profile Views"
          value={formatNumber(viewsCount || 0)}
          icon={<Eye className="w-5 h-5" />}
          change="+12.5%"
        />
        <StatsCard
          title="Link Clicks"
          value={formatNumber(clicksCount || 0)}
          icon={<MousePointerClick className="w-5 h-5" />}
          change="+8.2%"
        />
        <StatsCard
          title="Active Links"
          value={linksCount || 0}
          icon={<ExternalLink className="w-5 h-5" />}
        />
        <StatsCard
          title="Your Cards"
          value={cardsCount || 0}
          icon={<CreditCard className="w-5 h-5" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Public Profile */}
        {profile?.username && (
          <Card>
            <CardHeader>
              <CardTitle>Your Public Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Share your profile link to let people connect with you
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-brand-navy-dark rounded-lg text-sm text-brand-gold border border-white/10">
                  {process.env.NEXT_PUBLIC_APP_URL}/u/{profile.username}
                </code>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/u/${profile.username}`} target="_blank">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentViews && recentViews.length > 0 ? (
                recentViews.map((view: any) => (
                  <div key={view.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      <span className="text-gray-400">Profile viewed</span>
                    </div>
                    <span className="text-gray-500">{formatRelativeTime(view.viewed_at)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No views yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <QuickLink href="/dashboard/links" title="Manage Links" description="Add, edit, or remove links" />
        <QuickLink href="/dashboard/profile" title="Edit Profile" description="Customize your page" />
        <QuickLink href="/dashboard/cards" title="Activate Card" description="Add a new card" />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, change }: { title: string; value: string | number; icon: React.ReactNode; change?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-400">{icon}</div>
          {change && (
            <span className="text-xs text-green-500 font-semibold">{change}</span>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-gray-400">{title}</div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="glass rounded-lg p-4 hover:bg-white/10 transition group">
      <h3 className="font-semibold mb-1 group-hover:text-brand-gold transition">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}
