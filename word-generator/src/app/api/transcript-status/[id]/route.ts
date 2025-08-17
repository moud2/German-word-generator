// /app/api/transcript-status/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Missing transcript ID' }, { status: 400 });
    }

    // Get transcript from database
    const { data: transcript, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !transcript) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    return NextResponse.json(transcript);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}