export type BeginnerPlainLanguage = {
  readonly plain: string;
  readonly look: string;
  readonly simple: string;
  readonly avoid: string;
};

export type BeginnerFlowStep = {
  readonly title: string;
  readonly body: string;
};

export type IndicatorBeginnerGuide = BeginnerPlainLanguage & {
  readonly measure: string;
  readonly bestFor: string;
  readonly boundary: string;
  readonly flowLead: string;
  readonly flow: readonly [BeginnerFlowStep, BeginnerFlowStep, BeginnerFlowStep, BeginnerFlowStep];
  readonly practice: readonly [string, string, string];
};

export type IndicatorGuideRole =
  | "trend"
  | "momentum"
  | "reversal"
  | "volume"
  | "volatility"
  | "risk-distance"
  | "trailing-stop"
  | "risk-compare"
  | "volatility-reversal"
  | "levels"
  | "channel"
  | "breadth"
  | "screening"
  | "transform"
  | "zigzag"
  | "sentiment"
  | "regime";

export type StarterLesson = {
  readonly step: string;
  readonly slug: string;
  readonly role: string;
  readonly title: string;
  readonly body: string;
};

export type IndicatorLearningGoal = {
  readonly id: string;
  readonly label: string;
  readonly uses: readonly string[];
};
