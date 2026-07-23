export function JsonLd({ data }: { readonly data: Readonly<Record<string, unknown>> }) {
  const serialized = JSON.stringify(data).replaceAll("<", "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialized }} />;
}
