import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function AdvancedDisclosure({
  id,
  title,
  body,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly children: ReactNode;
}) {
  return (
    <details id={id} className="advanced-disclosure">
      <summary>
        <span>
          <strong>{title}</strong>
          <small>{body}</small>
        </span>
        <ChevronDown className="advanced-disclosure-icon size-5" aria-hidden="true" />
      </summary>
      <div className="advanced-disclosure-body">{children}</div>
    </details>
  );
}
