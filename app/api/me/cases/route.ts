import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const { userId } = getCurrentUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data: cases, error } = await supabase.from('cases').select(`
        id,
        title,
        description,
        image_url,
        price,
        stage,
        difficulties (*) 
      `);

    if (error || !cases) {
      return NextResponse.json({ error: error?.message || 'Cases not found' }, { status: 404 });
    }

    const ownedCases = [];

    for (const caseItem of cases) {
      const { data: owns, error: ownsError } = await supabase.rpc('owns_case', {
        p_user_id: userId,
        p_case_id: caseItem.id,
      });

      if (ownsError) {
        return NextResponse.json({ error: ownsError.message }, { status: 500 });
      }

      if (owns) {
        ownedCases.push(caseItem);
      }
    }

    return NextResponse.json(ownedCases);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
