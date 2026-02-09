'use server';

import { createClient, getUser } from '@/lib/supabase/server';

export async function getAnalytics(timeRange: '7d' | '30d' | '90d' = '30d') {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Calculate date range
  const days = parseInt(timeRange);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get page views
  const { data: pageViews, error: viewsError } = await supabase
    .from('page_views')
    .select('*')
    .eq('user_id', user.id)
    .gte('viewed_at', startDate.toISOString());

  if (viewsError) {
    return { error: viewsError.message };
  }

  // Get link clicks
  const { data: linkClicks, error: clicksError } = await supabase
    .from('link_clicks')
    .select('*, links(*)')
    .eq('user_id', user.id)
    .gte('clicked_at', startDate.toISOString());

  if (clicksError) {
    return { error: clicksError.message };
  }

  // Get top links by clicks
  const linkClickCounts = linkClicks.reduce((acc: any, click: any) => {
    const linkId = click.link_id;
    if (!acc[linkId]) {
      acc[linkId] = {
        link: click.links,
        count: 0,
      };
    }
    acc[linkId].count++;
    return acc;
  }, {});

  const topLinks = Object.values(linkClickCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  // Group views by date
  const viewsByDate = pageViews.reduce((acc: any, view: any) => {
    const date = new Date(view.viewed_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return {
    totalViews: pageViews.length,
    totalClicks: linkClicks.length,
    topLinks,
    viewsByDate,
    recentViews: pageViews.slice(0, 10),
  };
}
