import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Published case studies only. over-index-on-intuition is not in content/essays.
const here = path.dirname(fileURLToPath(import.meta.url));
const essaysDir = path.join(here, "../../content/essays");

const CITIES = [
  "San Francisco",
  "San Diego",
  "New York",
  "Los Angeles",
  "Seattle",
  "Chicago",
  "Boston",
  "Austin",
  "Denver",
  "Portland",
  "Miami",
  "Atlanta",
  "Dallas",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "Washington",
  "London",
  "Paris",
  "Berlin",
  "Tokyo",
  "Singapore",
  "Toronto",
  "Vancouver",
  "Sydney",
  "Melbourne",
  "Dublin",
  "Amsterdam",
  "Bangalore",
  "Mumbai",
  "Hong Kong",
  "Remote",
];

const TRAVEL_PHRASES = [
  /\bflew to\b/i,
  /\bflying to\b/i,
  /\bwent to\b/i,
  /\bgoing to\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*/g,
  /\btraveled to\b/i,
  /\btravelled to\b/i,
  /\brelocated to\b/i,
  /\bmoved to\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*/g,
  /\bin\s+San Francisco\b/i,
  /\bfor two weeks in\b/i,
];

if (!existsSync(essaysDir)) {
  console.error("check-locations: content/essays is missing");
  process.exit(1);
}

const hits = [];
const files = readdirSync(essaysDir).filter((name) => name.endsWith(".md")).sort();

for (const name of files) {
  const slug = name.slice(0, -3);
  const lines = readFileSync(path.join(essaysDir, name), "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const city of CITIES) {
      if (line.includes(city)) {
        hits.push(`${slug}:${index + 1}: city mention: ${city}`);
      }
    }
    for (const pattern of TRAVEL_PHRASES) {
      pattern.lastIndex = 0;
      const match = line.match(pattern);
      if (match) {
        hits.push(`${slug}:${index + 1}: travel phrase: ${match[0]}`);
      }
    }
  });
}

console.log(`location hits: ${hits.length}`);
for (const hit of hits) console.log(hit);
process.exit(hits.length === 0 ? 0 : 1);
