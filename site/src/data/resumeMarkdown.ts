// AUTO-GENERATED from content/resume.md - DO NOT EDIT DIRECTLY
// Edit content/resume.md to update your resume and trigger instant hot reloading.

import { parseResumeMarkdown, ParsedResume } from "@/lib/parseResumeMarkdown";

export const rawResumeMarkdown = `# Tyler Lindow

**Engineering Manager | Developer experience, platform, merchant & partner integrations | Ex-Affirm | Ex-founder**  
San Diego, CA | Open to relocation  
(650) •••-••••  

[linkedin.com/in/tlindow](https://linkedin.com/in/tlindow) | [github.com/tlindow](https://github.com/tlindow)

---

## Summary

Engineering manager with 4+ years leading teams of up to 9 engineers on Affirm's merchant and partner integrations and developer experience. Built per-merchant dashboards and alerting that cut detection of higher-volume merchant outages from ~1 hour to under 5 minutes. Led 4+ Partner and Merchant Engineering teams through a merchant-domain architecture review that reshaped Affirm's merchant org, and held Merchant Portal at 99.9% availability with zero incidents during BFCM 2025. As founder of Beginner Work, built a writing tool that helped technical founders explain their work in their own voice, bridging non-technical and technical builders. Targeting Engineering Manager / Senior EM roles in developer experience, developer platforms, and partner integrations.

---



## Professional Experience



### Founder | Beginner Work Inc.

*San Diego, CA | Mar 2026 – Jul 2026 (wound down before a raise)*

- Built a writing tool as sole founder that helped founders, especially technical founders, develop their pitch in their personal voice; owned product discovery, architecture, and GTM. Tested demand across successive prototypes through 92 in-person conversations (including 5 VCs) and 28 early users, including 6 paying. Wound it down in July 2026 when paying users didn't keep using it.
- Built Tinker solo in JavaScript, Node.js, Electron, and Postgres, shipped it as desktop and web apps, and published the source at [github.com/beginner-work/tinker](https://github.com/beginner-work/tinker).

### Software Engineering Manager, Merchant Advocacy | Affirm

*San Diego, CA (Remote) | Mar 2025 – Feb 2026 (role eliminated)*

- **Scope:** Led the former developer-support team as Merchant Advocacy Engineering, a product engineering team partnering with Design and Content: 9 software engineers (2 Staff, 2 SWE II, 4 SWE I, 1 contractor), later reshaped to 6. Owned Merchant Portal (React, TypeScript), the API-key and transaction-view surface for merchants integrated via ecommerce platforms or direct API, with ~5K new merchant sign-ups a month.
- **Merchant lifecycle re-architecture:** Led 4+ Partner and Merchant Engineering teams through a merchant-domain architecture review that set which team owns which merchant data. Got sign-off from 2 Directors, the Principal Architect, and every team's EM, and presented it to Affirm leadership in Q3 2025. The review showed Merchant Risk and Merchant Advocacy were tightly coupled, which led Affirm to consolidate them under one EM, move former developer-support engineers into SRE, and add PM investment in direct merchant customer problems.
- **Merchant Portal reliability:** Added metrics dashboards linked to logs, plus on-call alerting, which surfaced ~10 production incidents in Q4 2025 early enough to fix before Black Friday/Cyber Monday. Held 99.9% availability through the quarter and had zero incidents during BFCM.
- **Incident Communications:** Ran the Partner Engineering on-call program across my team and ~10 more engineers from Technical Account Management. Built a web tool that showed responders which enterprise merchants to email and when, plus Rootly automations that prompted the same steps in incident Slack channels, raising the share of enterprise merchant emails sent within the 15-minute SLA from near zero to ~70%.
- **Intuit ([announced February 2026](https://investors.affirm.com/news-releases/news-release-details/intuit-partners-affirm-provide-pay-over-time-offering-quickbooks)):** Unblocked Affirm's launch as QuickBooks Payments' exclusive pay-over-time partner, stalled since November 2025 by a Merchant Portal onboarding bug. My team shipped 3 production fixes, letting the production ramp start in early Q1 2026.
- **Shift to building:** Moved the team's time spent building from ~10–20% to 50%+ by making Tier-2 escalations advisory (coached Tier-2 support to self-serve in Snowflake and work directly with ecommerce platform teams). The freed capacity staffed an enterprise authorization (AuthZ) re-architecture of Merchant Portal with the Security org (near release when my role ended), the SLA reporting handoff to SRE, and the Intuit fix.

### Developer Support Engineering Manager, Partner Engineering | Affirm

*San Diego, CA (Remote) | Jul 2021 – Mar 2025*

- **Scope:** Managed a team that grew from 1 to 9 engineers (all software engineers by early 2025), building and running the tooling behind Affirm's merchant and partner integrations: per-merchant observability and alerting, the Snowflake availability reporting behind the Amazon partnership, and partner REST API and webhook support.
- **Observability:** Built per-merchant dashboards and alerting that cut detection time for outages at higher-volume merchants from ~1 hour on average to under 5 minutes.
- **Amazon, flagship partner ([21% of Affirm’s GMV in FY2024](https://www.sec.gov/Archives/edgar/data/1820953/000182095325000080/afrm-20250630.htm)):** Supported Amazon from before its [August 2021](https://investors.affirm.com/news-releases/news-release-details/amazon-partners-with-affirm) launch, then led my team's build of the Snowflake availability report Affirm used to meet Amazon's partnership requirements, later the baseline for the VP of Engineering's spring 2025 reliability sprint.
- **Merchant Portal SLA reports:** Acted as tech lead (no Staff engineers on the team yet) for an SLA reporting feature released in Merchant Portal in late 2024 to early 2025, letting Technical Account Managers share SLA reports directly with their merchants and cutting each monthly report's turnaround from ~2 weeks to ~1 week. Wrote the tech spec every direct report built from.
- **Team building:** Owned interview rubrics and hiring decisions for 4 hires (2 developer support engineers and 2 SWEs, one in Poland) and integrated 5 engineers who joined through reorgs.
- **People development:** Delivered 2 promotions, including a junior engineer to intermediate in ~1 year who then moved into product-building engineering. Ran monthly career-growth reviews across the 9-engineer team. Team engagement scores hit 9/10 (Affirm averaged [7.8–8.3](https://investors.affirm.com/static-files/f41ab85f-c739-479e-8bfb-4c337d3ea987)).

### Developer Support Engineer, Partner Engineering | Affirm

*San Francisco, CA (Hybrid) | Sep 2019 – Jul 2021*

- **Merchant checkout integrations:** Primary technical liaison for 300+ SMB merchants; diagnosed JavaScript, REST API, and webhook defects in checkout / payment-method integrations on Shopify, Magento, WooCommerce, and Salesforce Commerce Cloud.
- **DevX feedback loop:** Built ETL pipelines into Snowflake to cluster integration-defect patterns and turn developer feedback into platform fixes that cut recurring integration tickets.

### Earlier Experience

- Lead Software Engineering Immersive Resident, Galvanize / Hack Reactor (2019); Experience Development Specialist, The Tech Interactive (2017–2019); Design Code Build Instructor, Computer History Museum (2017–2018).

---



## Education

- **University of California, San Diego** | B.S. NanoEngineering, Cum Laude *(La Jolla, CA)*
- **Northwestern University** | Learning Sciences graduate coursework *(Evanston, IL)*
- **Software engineering:** Hack Reactor Advanced Software Engineering Immersive; Deep Atlas Applied AI & ML residency

---



## Skills & Toolkits

- **Technical Toolkit:** Python, JavaScript, TypeScript, React, Next.js, Node.js, Flask, Snowflake, SQL, ETL Pipelines, REST APIs, Webhooks, CI/CD, Git/GitHub, observability, LLMs & agentic coding (Claude, Cursor)
- **Leadership & Management:** Performance management & promotions, org design / domain boundaries, mentorship, incident management
- **B2B Integrations & Operations:** Partner Engineering, merchant checkout integrations (Shopify, Magento, WooCommerce, SFCC)
`;

export const parsedResume: ParsedResume = parseResumeMarkdown(rawResumeMarkdown);
