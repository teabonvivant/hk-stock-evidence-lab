import { CheckCircle2 } from "lucide-react";

export function DirectAnswer({
  answer,
  takeaways,
}: {
  readonly answer: string;
  readonly takeaways: readonly string[];
}) {
  return (
    <aside className="direct-answer" aria-label="直接答案與重點">
      <div>
        <span>直接答案</span>
        <p>{answer}</p>
      </div>
      <ul>
        {takeaways.slice(0, 3).map((item) => (
          <li key={item}>
            <CheckCircle2 aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
