import { redirect } from 'next/navigation';

// Spelet börjar på kontoret, så /investigation/[id] skickar vidare dit.
const InvestigationPage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  redirect(`/investigation/${investigationId}/office`);
};
export default InvestigationPage;
