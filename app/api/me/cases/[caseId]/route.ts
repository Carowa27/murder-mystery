import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const { userId } = getCurrentUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data: owns, error } = await supabase.rpc('owns_case', {
      p_user_id: userId,
      p_case_id: caseId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      caseId,
      owned: owns,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
