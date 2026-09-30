import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ICaseObject } from '@/lib/interfaces/adminRelated';

export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('cases')
      .select(
        `
      *,
      difficulties (*),
      characters (*),
      case_clues (
        *,
        clue_types (*),
        clue_requirements!clue_requirements_clue_id_fkey (
          required_clue_id
        )
    )`
      )
      .eq('id', caseId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Case not found, error msg:' + error?.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const supabase = await createClient();

  const body: ICaseObject = await request.json();

  /*
   * CASE
   */
  const { error: caseError } = await supabase
    .from('cases')
    .update({
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      location: body.location,
      price: body.price,
      stage: body.stage,
      story_date: body.story_date,
      difficulty_id: body.difficulty_id,
    })
    .eq('id', caseId);

  if (caseError) {
    return NextResponse.json(
      {
        error: caseError.message,
      },
      {
        status: 500,
      }
    );
  }

  /*
   * CLUES
   */
  for (const clue of body.case_clues) {
    const { error: clueError } = await supabase
      .from('case_clues')
      .update({
        title: clue.title,
        content: clue.content,
        image_url: clue.image_url,
        is_key: clue.is_key,
        clue_type_id: clue.clue_type_id,
      })
      .eq('id', clue.id)
      .eq('case_id', caseId);

    if (clueError) {
      return NextResponse.json(
        {
          error: clueError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Remove old requirements for this clue
     */
    const { error: deleteRequirementError } = await supabase
      .from('clue_requirements')
      .delete()
      .eq('clue_id', clue.id);

    if (deleteRequirementError) {
      return NextResponse.json(
        {
          error: deleteRequirementError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Add the currently selected requirements
     */
    if (clue.clue_requirements.length > 0) {
      const requirements = clue.clue_requirements.map((requirement) => ({
        clue_id: clue.id,
        required_clue_id: requirement.required_clue_id,
      }));

      const { error: requirementError } = await supabase
        .from('clue_requirements')
        .insert(requirements);

      if (requirementError) {
        return NextResponse.json(
          {
            error: requirementError.message,
          },
          {
            status: 500,
          }
        );
      }
    }
  }

  /*
   * CHARACTERS
   */
  for (const character of body.characters) {
    const { error: characterError } = await supabase
      .from('characters')
      .update({
        first_name: character.first_name,
        last_name: character.last_name,
        description: character.description,
        relationship: character.relationship,
        image_url: character.image_url,
        is_victim: character.is_victim,
        is_guilty: character.is_guilty,
      })
      .eq('id', character.id)
      .eq('case_id', caseId);

    if (characterError) {
      return NextResponse.json(
        {
          error: characterError.message,
        },
        {
          status: 500,
        }
      );
    }
  }

  return NextResponse.json({
    success: true,
  });
}
