import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

// Hard delete enligt överrenskommelse i gruppen
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ investigationId: string; noteId: string }> }
) {
  const { investigationId, noteId } = await params;

  // RLS hanterar inte auth för write operations
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('investigation_id', investigationId)
      .eq('user_id', user.sub);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
