import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET shop settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch settings
    const { data: settings, error } = await supabase
      .from('shop_settings')
      .select('id, markup_percentage, updated_at, updated_by')
      .single();

    if (error) {
      console.error('[Shop Settings] Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Check if API key is set (don't return actual value)
    const hasApiKey = !!process.env.SPREADCONNECT_API_KEY;

    return NextResponse.json({
      ...settings,
      hasApiKey,
    });
  } catch (error) {
    console.error('[Shop Settings] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update shop settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { markup_percentage } = body;

    // Validate markup_percentage
    if (typeof markup_percentage !== 'number' || markup_percentage < 0 || markup_percentage > 10) {
      return NextResponse.json(
        { error: 'Invalid markup_percentage. Must be between 0 and 10 (0% to 1000%)' },
        { status: 400 }
      );
    }

    // Update settings
    const { data: settings, error } = await supabase
      .from('shop_settings')
      .update({
        markup_percentage,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('[Shop Settings] Update error:', error);
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[Shop Settings] PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
