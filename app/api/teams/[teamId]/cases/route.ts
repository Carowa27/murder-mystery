import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data, error } = await supabase.from('cases').select(
      `
      id, title, description, image_url,
      difficulties (*)
      `
    );
    const { data: teamUsers, error: teamUserError } = await supabase
      .from('team_members')
      .select(
        `user_id
  `
      )
      .eq('team_id', teamId);

    if (error || teamUserError) {
      return NextResponse.json(
        { error: error ? error.message : teamUserError && teamUserError.message },
        { status: 404 }
      );
    }

    const ownedCases = new Map();

    for (const { user_id } of teamUsers!) {
      for (const caseItem of data) {
        const { data: owns, error } = await supabase.rpc('owns_case', {
          p_user_id: user_id,
          p_case_id: caseItem.id,
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (owns) {
          ownedCases.set(caseItem.id, caseItem);
        }
      }
    }

    return NextResponse.json([...ownedCases.values()]);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
