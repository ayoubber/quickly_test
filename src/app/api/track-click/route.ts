import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get link details
    const { data: link } = await supabase
      .from('links')
      .select('user_id')
      .eq('id', linkId)
      .single();

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Insert click record
    await supabase.from('link_clicks').insert({
      link_id: linkId,
      user_id: link.user_id,
      referrer: request.headers.get('referer') || '',
    });

    // Increment click count
    // Get current click count
    const { data: currentLink } = await supabase
      .from('links')
      .select('clicks_count')
      .eq('id', linkId)
      .single();

    if (currentLink) {
      await supabase
        .from('links')
        .update({ clicks_count: (currentLink.clicks_count || 0) + 1 })
        .eq('id', linkId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track click error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
