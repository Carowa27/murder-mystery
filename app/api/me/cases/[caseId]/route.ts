import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const user = await getCurrentUser();
  let ownedCase;

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data: owns, error } = await supabase.rpc('owns_case', {
      p_user_id: user.sub,
      p_case_id: caseId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (owns) {
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
        return NextResponse.json({ error: error?.message || 'Cases not found' }, { status: 404 });
      }
      ownedCase = caseItem;
    }
    return NextResponse.json({
      ownedCase,
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
