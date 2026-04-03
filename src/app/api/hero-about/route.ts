import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET handler - fetch current images
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('hero_image, about_image')
      .single();

    if (error) {
      console.error('Error fetching site settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      heroImage: data?.hero_image || '',
      aboutImage: data?.about_image || ''
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler - save images
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { heroImage, aboutImage } = body;

    // Validate input
    if (!heroImage && !aboutImage) {
      return NextResponse.json(
        { error: 'At least one image must be provided' },
        { status: 400 }
      );
    }

    // Upsert the settings (update if exists, insert if not)
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1, // Fixed ID for singleton settings
        hero_image: heroImage || null,
        about_image: aboutImage || null,
        updated_at: new Date().toISOString()
      })
      .select('hero_image, about_image')
      .single();

    if (error) {
      console.error('Error saving site settings:', error);
      return NextResponse.json(
        { error: 'Failed to save images' },
        { status: 500 }
      );
    }

    console.log('Site settings saved:', data);
    return NextResponse.json({
      success: true,
      heroImage: data?.hero_image,
      aboutImage: data?.about_image
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
