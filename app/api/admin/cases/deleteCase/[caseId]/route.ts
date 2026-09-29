import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  try {
    if (!caseId) {
      return NextResponse.json({ error: 'caseId is required' }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Profile is not admin' }, { status: 403 });
    }

    const deactivate = { stage: 'inactive' };

    if (Object.keys(deactivate).length === 0) {
      return NextResponse.json({ error: 'No fields supplied for update' }, { status: 400 });
    }

    const { error: updateError } = await supabase.from('cases').update(deactivate).eq('id', caseId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
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
