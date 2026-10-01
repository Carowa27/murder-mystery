import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Simpel PATCH route för att ändra status på en pågående investigation till 'abandoned'
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('investigations')
      .update({
        status: 'abandoned',
        ended_at: new Date().toISOString(),
      })
      .eq('id', investigationId)
      .in('status', ['active', 'paused']);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
