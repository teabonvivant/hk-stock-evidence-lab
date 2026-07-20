import canonicalPublicCopy from "../data/site/public_copy.json";

type PublicCopyMetadata = {
  readonly version: string;
  readonly schemaVersion: number;
  readonly contentVersion: string;
  readonly locale: string;
  readonly generatedWrapper: string;
};

type PublicCopyGlobal = {
  readonly siteName: string;
  readonly tagline: string;
  readonly riskDisclaimer: string;
  readonly dataDisclaimer: string;
  readonly navigation: Readonly<Record<string, string>>;
};

type PublicCopyPage = {
  readonly title: string;
  readonly copy: Readonly<Record<string, string | readonly string[]>>;
};

type PublicCopyIndicator = {
  readonly slug: string;
  readonly siteSlug: string;
  readonly nameZh: string;
  readonly summary: string;
  readonly signals: readonly string[];
  readonly mistakes: readonly string[];
  readonly limitations: readonly string[];
  readonly judgmentZh: string;
};

type PublicCopyTerm = {
  readonly firstUse: string;
  readonly short: string;
  readonly guidance: string;
};

type PublicCopyStatus = {
  readonly label: string;
  readonly shortLabel: string;
  readonly guidance: string;
};

type PublicCopyCatalog = {
  readonly metadata: PublicCopyMetadata;
  readonly global: PublicCopyGlobal;
  readonly pages: Readonly<Record<string, PublicCopyPage>>;
  readonly indicators: readonly PublicCopyIndicator[];
  readonly terms: Readonly<Record<string, PublicCopyTerm>>;
  readonly strategy: {
    readonly statuses: {
      readonly accepted: PublicCopyStatus;
      readonly "support-only": PublicCopyStatus;
      readonly rejected: PublicCopyStatus;
    };
    readonly disclosurePhrases: Readonly<Record<string, string>>;
  };
};

const publicCopy: PublicCopyCatalog = canonicalPublicCopy;

export type { PublicCopyCatalog, PublicCopyIndicator, PublicCopyPage };
export { publicCopy };
