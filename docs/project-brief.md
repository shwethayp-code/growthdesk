# GrowthDesk — Project Brief

> India's Smarter Way to JEE / CET — A Unified EdTech CRM and Student Engagement Platform

| | | | |
|---|---|---|---|
| 1 Unified Platform | 6 Core Modules | 100% Custom-Built | April 2026 |

---

## 1. Executive Summary

GrowthDesk is a full-stack EdTech CRM and student engagement platform designed to support coaching institutes managing JEE and CET aspirants across India. It combines a high-converting student-facing web application with a powerful internal support dashboard — enabling teams to capture leads, score and prioritise them, manage student support tickets, automate email communication, and deliver course materials, all from a single platform.

## 2. Problem Statement & Solution

| Before GrowthDesk | After GrowthDesk |
|---|---|
| Lead registrations tracked manually in spreadsheets | Registration form with automatic lead ID generation |
| No automated lead scoring or prioritisation | Auto lead scoring (0–100) with Hot / Warm / Cold tagging |
| Student queries handled over WhatsApp — no tracking | Structured ticket system with priority, status & close workflow |
| No visibility into which students needed urgent follow-up | Dashboard overview: KPIs, hot leads, open tickets at a glance |
| Course materials shared via email — no central portal | Student portal with gated course materials & PDF downloads |
| No automated email communication after registration | Automated personalised emails triggered by lead score |

## 3. Platform Modules

| # | Module | Key Features |
|---|--------|--------------|
| 01 | Student Landing Page | Futuristic AI-forward design; AI Diagnostic Quiz (9 JEE/CET questions); animated trust strip; lead scoring showcase; responsive for all devices |
| 02 | Lead Registration & Scoring | Smart registration form capturing 11 data points; automated lead score (PCM%, interest, source, income, exam target); Hot ≥ 80 / Warm ≥ 60 / Cold < 60; unique lead ID issued on submit |
| 03 | Support Dashboard | Live KPIs (leads, hot leads, open tickets, avg satisfaction); lead table with score badges & action tags; lead source breakdown; exam split analytics |
| 04 | Ticket Management System | Chatbot-raised tickets with query type, priority & ETA; Respond modal with notes; one-click Close; localStorage persistence; admin email on new ticket; student email on response |
| 05 | Student Portal & Courses | Login-gated portal using registered lead ID; course material upload (PDF, PPTX, DOCX, video links); organised by course; student satisfaction rating post-ticket |
| 06 | Google Sheets & Email Integration | Apps Script backend syncing all leads & tickets to Google Sheets; auto-emails triggered by lead score (hot / warm / cold templates); admin & student email notifications for tickets |

## 4. Highlight Feature: AI Diagnostic Quiz

A standout feature of the GrowthDesk platform is the built-in AI Readiness Score Test — an interactive diagnostic quiz that gives prospective students instant insight into their JEE/CET readiness while simultaneously generating high-quality leads for the team.

| Quiz Design | Scoring | Feedback | Lead Action |
|---|---|---|---|
| 9 real JEE/CET-level questions (3 Physics, 3 Chemistry, 3 Maths) | Subject-wise score % | AI study recommendations per weak subject | Register CTA shown on results screen |
| ~5 minutes to complete | Overall readiness score | Personalised improvement tips | Score auto-fed into lead scoring model |
| Instant correct/wrong feedback | Visual score bars per subject | Motivational score message | High scorers flagged as hot leads |

## 5. Lead Scoring Model

| Scoring Parameter | Weight | How Calculated |
|---|---|---|
| PCM Percentage | 30 points | Actual % mapped to 0–30 range |
| Interest Level | 25 points | Very High = 25, High = 20, Medium = 15, Low = 5 |
| Lead Source | 20 points | Referral = 20, Instagram = 15, YouTube = 12, Website = 10 |
| Parent Income | 15 points | Higher income bracket = higher score |
| Target Exam | 10 points | Both JEE+CET = 10, JEE = 8, CET = 6 |
| **Total** | **100 points** | Hot ≥ 80 · Warm ≥ 60 · Cold < 60 |

## 6. Technology Stack

| Frontend | Backend | Data & Storage | Communications |
|---|---|---|---|
| HTML5 / CSS3 / JavaScript (ES6+) | Google Apps Script (Web App) | Google Sheets (persistent) | Gmail API via `GmailApp.sendEmail()` |
| Single-file SPA architecture | REST-style POST/GET endpoints | localStorage (session cache) | Score-based email templates (3 tiers) |
| CSS custom properties & glassmorphism | No server infrastructure | Leads sheet + Tickets sheet | Admin alert on new ticket |
| Responsive (mobile-first) | Deployed as serverless Web App | CSV export capability | Student email on ticket response & close |

## 7. Automated Email Workflows

| Trigger | Recipient | Email Content |
|---|---|---|
| Lead Score ≥ 80 (Hot) | Student | Urgent call-within-2-hours message, counsellor assignment, demo booking link |
| Lead Score 60–79 (Warm) | Student | Free webinar invitation with registration link, date and topic details |
| Lead Score < 60 (Cold) | Student | Free downloadable study guide, soft nurture messaging, open invitation to connect |
| New Support Ticket Raised | Admin | Full ticket details: student name, phone, city, exam, query type, issue description, priority level |
| Ticket Responded To | Student | Response from support team, ticket ID, current status (In Progress), team contact details |
| Ticket Closed | Student | Resolution confirmation, ticket ID, team response note, invitation to raise new ticket if needed |

## 8. Course Materials Delivered

| Physics | Chemistry | Mathematics |
|---|---|---|
| Mechanics & Kinematics | Mole Concept & Stoichiometry | Algebra & Progressions |
| Circular & Rotational Motion | Atomic Structure tables | Binomial Theorem |
| Waves & Sound | Chemical Bonding types | Trigonometry (identities + values) |
| Electrostatics & Current Electricity | Periodic Table Trends | Calculus (derivatives & integrals) |
| Optics | Chemical Equilibrium & Thermodynamics | Coordinate Geometry |
| Thermodynamics & Kinetic Theory | Organic Chemistry Reactions | Probability & Statistics |

Additionally: a 30-Day JEE/CET Study Plan with daily schedule, week-by-week topic breakdown, and a Top-10 exam tips guide.

## 9. Commercial & Marketing Layer

GrowthDesk's commercial and marketing layer transforms raw lead data into targeted, compliant outreach — moving students from awareness to enrolment through automated, data-driven campaigns.

### 9.1 Campaign Builder

The Campaign Builder module (live in Marketing → Campaigns) lets the team create, review, and manage marketing campaigns without needing a separate CRM or email platform.

| Feature | How It Works | Commercial Value |
|---|---|---|
| Campaign Types | Email, WhatsApp, SMS — one builder for all three | Reach students on their preferred channel; reduce drop-off |
| Smart Targeting | Auto-segment by Hot (≥80), Warm (60–79), All Leads, JEE / CET aspirants | Personalised messages increase open rates 2–3× |
| Compliance Check | Runs every campaign through the LegalTech `/campaign-review` API before sending | Avoids legal risk; prevents misleading-claim violations automatically |
| Campaign Archive | All saved campaigns stored with compliance badge and status (Draft / Sent) | Full audit trail for marketing activity |
| A/B Test Guidance | Best-practice tips for subject-line testing built into the interface | Optimises open rates with minimal extra effort |

### 9.2 Automated Lead Nurturing

GrowthDesk automatically classifies every lead the moment they register, enabling the team to nurture them without manual sorting.

| Lead Type | Score Range | Auto Action | Message Strategy |
|---|---|---|---|
| Hot | ≥ 80 | Priority flag + instant email to admin | Personalised: name, exam, specific course recommendation |
| Warm | 60–79 | Batch weekly nurture campaign | Informational: study tips, free demo class invite, deadline reminder |
| Cold | < 60 | Monthly re-engagement campaign | Motivational: success stories, testimonials, "you can do it" series |

### 9.3 Marketing Analytics & KPIs

The Analytics tab tracks the full lead funnel with three live KPIs: Lead Conversion Rate (% of leads that enrol after nurturing), Campaign Open Rate (% of emails / messages opened), and Hot Lead Rate (% of total leads scoring ≥ 80).

### 9.4 Commercial Examples in Action

**Scenario 1 — JEE Season Push.** With 60 days to JEE Mains, the team creates an email campaign targeting Hot JEE leads. The Campaign Builder pre-fills the target as "JEE Aspirants." The compliance check flags "guarantee your IIT seat" in the copy and suggests a fix. After editing, the campaign scores 91/100 and is saved. The team schedules it for Tuesday 9 AM — the peak open-rate window shown in the performance tips panel.

**Scenario 2 — Re-engaging Cold Leads.** The analytics tab shows 35 cold leads (score < 60) who registered 3+ months ago but never converted. A WhatsApp campaign is created targeting "All Leads" with a motivational subject. No compliance violations. Campaign is saved, compliance-approved, and ready to send.

**Scenario 3 — New City Expansion.** The team notices 12 leads from a city the institute hasn't formally entered. Before running a targeted campaign, they use the Market Entry Checker in the Compliance tab. The state returns LOW risk with 2 required licenses. The team proceeds after obtaining GST registration, running a compliant city-specific email campaign within the same week.

## 10. Legal & Compliance Layer

As GrowthDesk expands its outreach across new markets and student segments, it faces a growing need for fast, reliable legal and compliance intelligence. The integrated LegalTech module (see [`legaltech-api-spec.md`](legaltech-api-spec.md)) addresses this directly — removing the bottleneck of waiting days for a legal opinion before the team can act.

### 10.1 Before vs After

| Before LegalTech Integration | After LegalTech Integration |
|---|---|
| Wait 2–5 days for legal team review before entering a new market | Instant market-entry clearance for any Indian state or sector |
| Manual DPDP compliance checks done lead by lead | Automated DPDP consent check on every new lead |
| Risk of sending non-compliant campaigns with misleading claims | Campaign copy reviewed for compliance before it is ever sent |
| No automated due diligence — decisions delayed or skipped | Legal decisions embedded directly in the GrowthDesk workflow |
| Student data disputes handled ad-hoc, no formal draft letters | One-click legal draft letters generated for student complaints |

### 10.2 API Endpoint Map

| Endpoint | GrowthDesk Module | Trigger | Outcome |
|---|---|---|---|
| `/data-check` | Lead Pipeline | New lead registered | DPDP consent & data-handling verified instantly |
| `/market-entry` | Lead Pipeline | New state/sector detected | Legal clearance + required licenses returned in < 1 sec |
| `/campaign-review` | Campaign Builder | Before saving any campaign | Violations flagged; compliant campaigns scored 80+/100 |
| `/draft-document` | Ticket System | Complaint-type ticket raised | Formal legal response letter auto-generated |
| `/alerts/subscribe` | Settings / Setup | One-time webhook setup | Regulatory changes pushed to admin email automatically |
| `/ask` | Student Chatbot | Student asks a legal question | Plain-English DPDP answer returned within the chat |

### 10.3 Compliance Dashboard

The Legal Compliance tab is live in GrowthDesk (Legal → Compliance in the sidebar). It provides the team with:

A **DPDP Data Check Tool** — enter any student's name, state, and data source, get compliance status in under 1 second with risk level and required actions. A **Market Entry Checker** — select a target state and industry sector, returns applicable laws, required licenses, and any restrictions before the team invests in a new market. A **Campaign Compliance Review** — embedded in the Campaign Builder; every campaign body is scanned for misleading claims, missing disclaimers, and DPDP violations before saving. A **Compliance Activity Log** — full audit trail of every check run (check type, subject, result, risk level, timestamp), exportable for legal documentation. A **Live KPI Dashboard** — four real-time metrics: Total Checks, DPDP Compliant, Flagged, and Compliance Rate (target: ≥ 95%).

### 10.4 Architecture

GrowthDesk connects to the LegalTech API through two routes: the Google Apps Script backend handles server-side checks (lead creation, alerts), and the front-end HTML app handles real-time user-facing checks (campaign review, chatbot Q&A).

| Layer | Method | Security |
|---|---|---|
| Apps Script Backend | `UrlFetchApp.fetch()` → POST to `/v1/data-check`, `/v1/alerts/subscribe`, `/v1/draft-document` | API key stored in PropertiesService (never in source code) |
| Front-End (HTML App) | `fetch()` → POST to `/v1/campaign-review`, `/v1/market-entry`, `/v1/ask` | API key injected at deploy time; HTTPS enforced |
| Webhook (Alerts) | LegalTech API calls GrowthDesk Apps Script URL on regulatory change | Webhook endpoint validates `X-Webhook-Secret` header |

### 10.5 Compliance Examples in Action

**Example 1 — New Lead from WhatsApp Campaign.** A student registers via a WhatsApp campaign. The Apps Script backend immediately calls `/v1/data-check`. Since the data source is "WhatsApp Campaign" and no consent checkbox was recorded, the API returns NON-COMPLIANT, risk: HIGH with two flags: "No explicit consent recorded" and "WhatsApp opt-in proof required." An alert email is automatically sent to the admin inbox, and the lead is tagged with a compliance warning in the pipeline.

**Example 2 — Market Expansion.** The team wants to run a coaching drive in a new city. Before creating any campaign, they open the Compliance tab and run a Market Entry Check. The API returns CLEARED, risk: LOW, with 2 required licenses and one restriction (fee refund policy must be published). The team completes the licenses in 3 days and launches — legally compliant from day one.

**Example 3 — Student Data Dispute Ticket.** A student raises a complaint ticket: "My personal data was shared without consent." The admin clicks Respond in the ticket dashboard, selects "Generate Legal Response," and the Apps Script calls `/v1/draft-document` with `doc_type: 'data_dispute_response'`. Within 2 seconds, a formally worded letter citing DPDP Act 2023 Section 8 is returned and displayed in the response modal — ready to review, personalise, and send.

## 11. Proposed Next Steps

| Priority | Feature | Business Value |
|---|---|---|
| High | Mobile App (PWA) | Students access the portal and quizzes on mobile — captures a wider audience |
| High | Payment Gateway Integration | Enable direct course fee payment inside the platform, reducing drop-off |
| Medium | Live Class Scheduling | Calendar-based class booking with automated reminders to students & teachers |
| Medium | Analytics Dashboard v2 | Funnel conversion rates, monthly lead trends, campaign-wise ROI tracking |
| Low | WhatsApp Bot Integration | Auto-reply to common queries on WhatsApp using the same ticket workflow |

---

*GrowthDesk — Project Brief · April 2026 · Built with Claude*
