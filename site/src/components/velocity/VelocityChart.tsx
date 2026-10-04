import {
  VELOCITY_REPO_COLORS,
  VELOCITY_REPO_LABELS,
  formatWeekLabel,
  type VelocityData,
} from "@/data/velocity";

type Props = {
  data: VelocityData;
};

export default function VelocityChart({ data }: Props) {
  const repoIds = data.repos
    .map((r) => r.id)
    .filter((id) => data.beginnerIncluded || id !== "beginner");

  const maxTotal = Math.max(
    1,
    ...data.weeks.map((week) =>
      repoIds.reduce((sum, id) => sum + (week.counts[id] || 0), 0)
    )
  );

  const width = 640;
  const height = 220;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const gap = 10;
  const barW = (plotW - gap * (data.weeks.length - 1)) / data.weeks.length;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="PRs merged per week by repository"
      >
        {[0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padT + plotH * (1 - frac);
          const label = Math.round(maxTotal * frac);
          return (
            <g key={frac}>
              <line
                x1={padL}
                x2={width - padR}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
              <text
                x={padL - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted"
                fontSize={10}
                fontFamily="var(--font-space-mono), monospace"
              >
                {label}
              </text>
            </g>
          );
        })}

        {data.weeks.map((week, i) => {
          const x = padL + i * (barW + gap);
          let y = padT + plotH;
          const segments = repoIds.map((id) => {
            const count = week.counts[id] || 0;
            const h = (count / maxTotal) * plotH;
            y -= h;
            return { id, count, y, h };
          });

          return (
            <g key={week.weekStart}>
              {segments.map((seg) =>
                seg.h > 0 ? (
                  <rect
                    key={seg.id}
                    x={x}
                    y={seg.y}
                    width={barW}
                    height={seg.h}
                    fill={VELOCITY_REPO_COLORS[seg.id] || "#4F46E5"}
                    rx={2}
                  >
                    <title>
                      {VELOCITY_REPO_LABELS[seg.id] || seg.id}: {seg.count}{" "}
                      merged week of {formatWeekLabel(week.weekStart)}
                    </title>
                  </rect>
                ) : null
              )}
              <text
                x={x + barW / 2}
                y={height - 12}
                textAnchor="middle"
                className="fill-muted"
                fontSize={10}
                fontFamily="var(--font-space-mono), monospace"
              >
                {formatWeekLabel(week.weekStart)}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm font-mono text-muted">
        {repoIds.map((id) => (
          <li key={id} className="inline-flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: VELOCITY_REPO_COLORS[id] || "#4F46E5" }}
              aria-hidden
            />
            <span>{VELOCITY_REPO_LABELS[id] || id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
