interface IPostParams {
  cId: string;
  invId: string;
}

export type InvestigationOutcome = 'active' | 'solved' | 'failed';

export type AccuseResult =
  | {
      ok: true;
      isGuilty: boolean;
      accusationsLeft: number;
      status: InvestigationOutcome;
    }
  | { ok: false; error: string };

interface IAccuseResponse {
  success?: boolean;
  is_guilty?: boolean;
  accusations_left?: number;
  status?: InvestigationOutcome;
  error?: string;
}

export const accuse = async ({ cId, invId }: IPostParams): Promise<AccuseResult> => {
  try {
    const res = await fetch(`/api/investigations/${invId}/accusation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspectId: cId }),
    });

    const data = (await res.json().catch(() => ({}))) as IAccuseResponse;

    if (!res.ok || typeof data.is_guilty !== 'boolean') {
      return { ok: false, error: data.error ?? 'Kunde inte anklaga' };
    }

    return {
      ok: true,
      isGuilty: data.is_guilty,
      accusationsLeft: data.accusations_left ?? 0,
      status: data.status ?? 'active',
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Nätverksfel' };
  }
};
