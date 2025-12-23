import RuleBuilder from "@/components/pages/RuleBuilder";

export default async function EditRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RuleBuilder id={id} />;
}

