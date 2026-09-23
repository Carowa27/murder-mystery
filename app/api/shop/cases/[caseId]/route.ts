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

    const { data: caseItem, error } = await supabase
      .from('cases')
      .select(
        `
        id,
        title,
        description,
        image_url,
        price,
        stage,
        difficulties (*)
      `
      )
      .eq('id', caseId)
      .single();

    if (error || !caseItem) {
      return NextResponse.json({ error: error?.message || 'Case not found' }, { status: 404 });
    }

    if (caseItem.stage !== 'active') {
      return NextResponse.json({ error: 'Case not available' }, { status: 404 });
    }

    const { data: owns, error: ownsError } = await supabase.rpc('owns_case', {
      p_user_id: userId,
      p_case_id: caseId,
    });

    if (ownsError) {
      return NextResponse.json({ error: ownsError.message }, { status: 500 });
    }

    return NextResponse.json({
      case: caseItem,
      owned: owns,
      available: !owns,
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
