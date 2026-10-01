import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;

  const supabase = await createClient();

  const { data: investigation, error: investigationError } = await supabase
    .from('investigations')
    .select(
      `
        *,
        cases (*),
        investigation_found_clues (
          *,
          case_clues (
            *,
            clue_types (*)
          )
        ),
        notes(
          *,
          profiles(*),
          case_clues(*)
        ),
        teams (
          *,
          team_members (
            joined_at,
            profiles (
              id,
              display_name,
              avatar_url
            )
          )
        )
      `
    )
    .eq('id', investigationId)
    .single();

  if (investigationError) {
    return NextResponse.json({ error: investigationError.message }, { status: 500 });
  }

  return NextResponse.json(investigation);
}

// export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
//   const { userId } = await params;

//   const { display_name, avatar_url, role } = await request.json();

//   const supabase = await createClient();

//   const { data: profile, error } = await supabase
//     .from('profiles')
//     .update({
//       display_name,
//       avatar_url,
//       role,
//     })
//     .eq('id', userId)
//     .select()
//     .single();

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 404 });
//   }

//   return NextResponse.json(investigation);
// }
