import type { DiagramSpec } from "@/lib/blog";

/** A compact rendering of the article's actual first diagram, with no invented data. */
export function ArticlePreview({ diagram }: { diagram: DiagramSpec }) {
  const items = diagram.items;
  const wrap = (text: string, width: number) => Array.from({ length: Math.ceil(text.length / width) }, (_, i) => text.slice(i * width, (i + 1) * width));
  const title = wrap(diagram.title, 24).slice(0, 2);
  const isBars = diagram.kind === "bars" && items.every(item => typeof item.value === "number" && item.value >= 0);
  const max = Math.max(1, ...items.map(item => item.value ?? 0));
  return <svg viewBox="0 0 600 290" aria-hidden="true" focusable="false" className="article-preview">
    <rect width="600" height="290" fill="#eef3f7" />
    <text x="28" y="39" fill="#142536" fontSize="22" fontWeight="650">{title.map((line, i) => <tspan x="28" dy={i ? 28 : 0} key={i}>{line}</tspan>)}</text>
    {isBars ? <>
      <path d="M34 231H566" stroke="#d0dce5" />
      {items.map((item, i) => {
        const cell = 520 / items.length;
        const x = 40 + i * cell;
        const height = ((item.value ?? 0) / max) * 118;
        return <g key={i}><rect x={x + 20} y={230 - height} width={Math.max(12, cell - 42)} height={height} rx="3" fill={i % 2 ? "#8baac4" : "#285f96"} /><text x={x + cell / 2} y={220 - height} textAnchor="middle" fill="#142536" fontSize="20">{item.value}</text><text x={x + cell / 2} y="259" textAnchor="middle" fill="#506174" fontSize="18">{item.label}</text></g>;
      })}
    </> : <>
      {items.slice(0, 4).map((item, i) => {
        const count = Math.min(items.length, 4);
        const columns = count <= 2 ? count : 2;
        const width = columns === 1 ? 540 : 256;
        const x = 28 + (i % columns) * 288;
        const y = 90 + Math.floor(i / columns) * 94;
        const flow = diagram.kind === "flow";
        const labelX = x + (flow ? 46 : 16);
        const labelY = y + (count <= 2 ? 70 : 43);
        const rows = wrap(item.label, columns === 1 ? 22 : flow ? 9 : 11);
        return <g key={i}>
          <rect x={x} y={y} width={width} height={count <= 2 ? 124 : 80} rx="7" fill="#fff" stroke="#d0dce5" />
          {flow ? <><circle cx={x + 22} cy={labelY - 7} r="11" fill="#285f96" /><text x={x + 22} y={labelY - 2} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="650">{i + 1}</text></> : <path d={`M${x + 16} ${y + 17}h24`} stroke="#285f96" strokeWidth="3" />}
          <text x={labelX} y={labelY} fill="#142536" fontSize="21" fontWeight="550">{rows.slice(0, 2).map((line, j) => <tspan x={labelX} dy={j ? 23 : 0} key={j}>{line}</tspan>)}</text>
          {i % 2 === 0 && count > 1 && diagram.kind === "flow" ? <path d={`M${x + 264} ${y + 31}h15m-6 -5 6 5-6 5`} fill="none" stroke="#8baac4" strokeWidth="2" /> : null}
        </g>;
      })}
    </>}
  </svg>;
}
