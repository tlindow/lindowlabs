/**
 * Regenerates site/src/data/velocity.json from the GitHub API.
 *
 * Repos:
 *   - tlindow/lindowlabs (public): titles + links OK
 *   - beginner-work/tinker (public): titles + links OK
 *   - beginner-work/beginner (private): counts/timings only; never titles or links
 *
 * Auth: VELOCITY_GITHUB_TOKEN (optional PAT with access to beginner) or GITHUB_TOKEN.
 * Without beginner access, public repos are still written and beginnerIncluded=false.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outPath = path.resolve(__dirname, "../src/data/velocity.json");

const REPOS = [
  { id: "lindowlabs", fullName: "tlindow/lindowlabs", public: true },
  { id: "tinker", fullName: "beginner-work/tinker", public: true },
  { id: "beginner", fullName: "beginner-work/beginner", public: false },
];

const LOOKBACK_DAYS = 84; // 12 weeks of chart history
const CHART_WEEKS = 8;
const RECENT_LIMIT = 12;

const token =
  process.env.VELOCITY_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";

async function gh(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lindowlabs-velocity",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`GitHub ${res.status} for ${url}: ${body.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function weekStartUTC(date) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const offset = day === 0 ? 6 : day - 1; // Monday-start weeks
  d.setUTCDate(d.getUTCDate() - offset);
  return d;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function fetchMergedForRepo(fullName, sinceIso) {
  const items = [];
  let page = 1;
  while (page <= 5) {
    const q = encodeURIComponent(
      `repo:${fullName} is:pr is:merged merged:>=${sinceIso}`
    );
    const url = `https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}&sort=updated`;
    const data = await gh(url);
    items.push(...(data.items || []));
    if ((data.items || []).length < 100) break;
    page += 1;
    // search rate limit: be gentle
    await new Promise((r) => setTimeout(r, 250));
  }
  return items;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  const now = new Date();
  const since = new Date(now.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  const sinceIso = isoDate(since);

  const allPrs = [];
  let beginnerIncluded = false;

  for (const repo of REPOS) {
    try {
      const items = await fetchMergedForRepo(repo.fullName, sinceIso);
      if (repo.id === "beginner") beginnerIncluded = true;
      console.log(`${repo.fullName}: ${items.length} merged PRs since ${sinceIso}`);
      for (const it of items) {
        const created = new Date(it.created_at);
        const merged = new Date(it.closed_at);
        allPrs.push({
          repo: repo.id,
          public: repo.public,
          number: it.number,
          title: repo.public ? it.title : null,
          url: repo.public ? it.html_url : null,
          createdAt: it.created_at,
          mergedAt: it.closed_at,
          hoursToMerge: (merged - created) / 3600000,
        });
      }
    } catch (err) {
      if (repo.id === "beginner") {
        console.warn(
          `Skipping beginner (private): ${err.message}. Public repos only.`
        );
        continue;
      }
      throw err;
    }
  }

  const currentWeek = weekStartUTC(now);
  const weeks = [];
  for (let i = CHART_WEEKS - 1; i >= 0; i -= 1) {
    const ws = new Date(currentWeek);
    ws.setUTCDate(ws.getUTCDate() - i * 7);
    weeks.push(ws);
  }

  const countsByWeek = Object.fromEntries(
    weeks.map((w) => [
      isoDate(w),
      Object.fromEntries(REPOS.map((r) => [r.id, 0])),
    ])
  );

  for (const pr of allPrs) {
    const ws = isoDate(weekStartUTC(new Date(pr.mergedAt)));
    if (countsByWeek[ws] && pr.repo in countsByWeek[ws]) {
      countsByWeek[ws][pr.repo] += 1;
    }
  }

  const sevenAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const prs7 = allPrs.filter((p) => new Date(p.mergedAt) >= sevenAgo);
  const prs4w = allPrs.filter((p) => new Date(p.mergedAt) >= fourWeeksAgo);
  const med = median(prs4w.map((p) => p.hoursToMerge));

  const recentShipped = allPrs
    .filter((p) => p.public && p.title && p.url)
    .sort((a, b) => (a.mergedAt < b.mergedAt ? 1 : -1))
    .slice(0, RECENT_LIMIT)
    .map((p) => ({
      title: p.title,
      repo: p.repo,
      mergedAt: p.mergedAt.slice(0, 10),
      url: p.url,
    }));

  const payload = {
    generatedAt: now.toISOString(),
    beginnerIncluded,
    repos: REPOS,
    headline: {
      prsLast7Days: prs7.length,
      weeklyAverage4Weeks: Math.round((prs4w.length / 4) * 10) / 10,
      medianHoursToMerge4Weeks:
        med == null ? null : Math.round(med * 10) / 10,
    },
    weeks: weeks.map((w) => ({
      weekStart: isoDate(w),
      counts: countsByWeek[isoDate(w)],
    })),
    recentShipped,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${outPath} (beginnerIncluded=${beginnerIncluded}, last7=${payload.headline.prsLast7Days})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
