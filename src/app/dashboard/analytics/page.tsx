import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointerClick, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get total counts
    const { count: totalViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    const { count: totalClicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    // Get last 7 days of views
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: weekViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('viewed_at', sevenDaysAgo.toISOString());

    const { count: weekClicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('clicked_at', sevenDaysAgo.toISOString());

    // Get recent views with details
    const { data: recentViews } = await supabase
        .from('page_views')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10);

    // Get top links by clicks
    const { data: links } = await supabase
        .from('links')
        .select('id, title, url')
        .eq('user_id', user.id);

    // Get click counts per link
    const linkClickCounts: { [key: string]: number } = {};
    if (links) {
        for (const link of links) {
            const { count } = await supabase
                .from('link_clicks')
                .select('*', { count: 'exact', head: true })
                .eq('link_id', link.id);
            linkClickCounts[link.id] = count || 0;
        }
    }

    const topLinks = links
        ?.map((link) => ({ ...link, clicks: linkClickCounts[link.id] || 0 }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

    // Calculate CTR
    const ctr = totalViews ? ((totalClicks || 0) / totalViews * 100).toFixed(1) : '0';

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-gray-400">
                    Track your profile performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <Eye className="w-5 h-5 text-blue-400" />
                            <div className="flex items-center gap-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span>{weekViews} this week</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{totalViews?.toLocaleString() || 0}</div>
                        <div className="text-sm text-gray-400">Total Views</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <MousePointerClick className="w-5 h-5 text-purple-400" />
                            <div className="flex items-center gap-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span>{weekClicks} this week</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{totalClicks?.toLocaleString() || 0}</div>
                        <div className="text-sm text-gray-400">Link Clicks</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{ctr}%</div>
                        <div className="text-sm text-gray-400">Click Rate</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <Calendar className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{links?.length || 0}</div>
                        <div className="text-sm text-gray-400">Active Links</div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topLinks && topLinks.length > 0 ? (
                            <div className="space-y-4">
                                {topLinks.map((link, index) => (
                                    <div key={link.id} className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{link.title}</p>
                                            <p className="text-sm text-gray-400 truncate">{link.url}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{link.clicks}</p>
                                            <p className="text-xs text-gray-400">clicks</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No link data yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Profile Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentViews && recentViews.length > 0 ? (
                            <div className="space-y-3">
                                {recentViews.map((view: any) => (
                                    <div key={view.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-brand-gold rounded-full" />
                                            <span className="text-gray-300">Profile viewed</span>
                                            {view.referrer && (
                                                <span className="text-gray-500 text-xs">
                                                    from {new URL(view.referrer).hostname}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-gray-500">
                                            {new Date(view.viewed_at).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No views yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Card */}
            <Card className="mt-8 border-brand-gold/30 bg-brand-gold/5">
                <CardContent className="flex items-center gap-4 pt-6">
                    <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Analytics Privacy</h3>
                        <p className="text-sm text-gray-400">
                            We collect minimal, privacy-friendly analytics. No personal data is stored about your visitors.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
