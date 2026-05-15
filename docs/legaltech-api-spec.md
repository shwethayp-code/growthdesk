# GrowthDesk × LegalTech Compliance API

> Integration specification and developer guide. Version 1.0 — April 2026.

---

## 1. Purpose & Overview

GrowthDesk is an AI-powered lead management and student engagement platform. As GrowthDesk expands its outreach across new markets, industries, and student segments, it faces a growing need for fast, reliable legal and compliance intelligence.

The LegalTech module addresses this directly. It is a REST API that answers compliance and due-diligence questions automatically — eliminating the need to wait days for a legal opinion before the team can act. This document defines exactly how GrowthDesk connects to that API.

## 2. API Architecture

The compliance API follows a standard REST architecture. GrowthDesk communicates with it from two places: the Google Apps Script backend (for server-side logic like lead saving and email workflows) and the front-end HTML app (for real-time user-facing checks like campaign review).

### 2.1 Base URL & Versioning

| Property | Value |
|---|---|
| Base URL | `https://api.legaltech-compliance.io/v1` |
| Protocol | HTTPS (TLS 1.2+) — all HTTP requests are rejected |
| API Version | v1 (path-based versioning, e.g. `/v1/market-entry`) |
| Response Format | JSON — all responses return `Content-Type: application/json` |
| Rate Limit | 200 requests / minute per API key |

### 2.2 Authentication

Every request must include an API key in the Authorization header. GrowthDesk stores this key in the Apps Script Properties Service (never hard-coded in source).

```
Authorization: Bearer YOUR_API_KEY_HERE
```

Example in Google Apps Script:

```js
const API_KEY = PropertiesService.getScriptProperties().getProperty('LEGAL_API_KEY');
const options = {
  method: 'POST',
  contentType: 'application/json',
  headers: { 'Authorization': 'Bearer ' + API_KEY },
  payload: JSON.stringify(requestBody)
};
```

### 2.3 Standard Response Envelope

All API responses share a consistent wrapper. This makes it easy for GrowthDesk to handle responses uniformly.

```json
{
  "status":    "success",
  "requestId": "req_abc123xyz",
  "timestamp": "2026-04-09T10:30:00Z",
  "data":      { },
  "error":     { "code": "...", "message": "..." }
}
```

`status` is `"success"` or `"error"`. `requestId` is a unique ID for every call — log it. `timestamp` is ISO 8601 UTC. `data` is present on success; `error` is present on error.

## 3. Endpoint Specifications

The following six endpoints cover GrowthDesk's complete compliance needs — from checking a single lead to drafting a legal document.

### Endpoint 1: `/data-check` — DPDP & Data Compliance

Verifies whether GrowthDesk's handling of a specific student's data complies with India's Digital Personal Data Protection (DPDP) Act 2023 and any sector-specific regulations. Run this every time a new lead is added.

**Request Body:**

```json
{
  "student_name":     "Demo Student",
  "email":            "demo@example.com",
  "phone":            "+91-9876543210",
  "state":            "Maharashtra",
  "data_source":      "WhatsApp Campaign",
  "consent_given":    true,
  "data_use_purpose": "lead_nurturing"
}
```

**Response (Success):**

```json
{
  "status": "success",
  "data": {
    "compliant":        true,
    "dpdp_status":      "CONSENT_VERIFIED",
    "risk_level":       "LOW",
    "flags":            [],
    "retention_limit":  "24 months",
    "required_actions": []
  }
}
```

**Response (Non-Compliant Example):**

```json
{
  "status": "success",
  "data": {
    "compliant":        false,
    "dpdp_status":      "CONSENT_MISSING",
    "risk_level":       "HIGH",
    "flags":            ["No explicit consent recorded", "WhatsApp data requires opt-in proof"],
    "retention_limit":  "12 months",
    "required_actions": ["Obtain consent form", "Log consent timestamp in CRM"]
  }
}
```

### Endpoint 2: `/market-entry` — Market Clearance Check

Before pursuing leads in a new state, city, or industry sector, this endpoint confirms whether outreach and course offerings are legally permitted in that market. Returns applicable regulations and any required licenses.

**Request Body:**

```json
{
  "target_state":   "Telangana",
  "target_sector":  "Private Coaching / Test Prep",
  "outreach_type":  "digital_campaign",
  "course_type":    "JEE Preparation",
  "fee_range_inr":  "50000-150000"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "market_cleared":     true,
    "applicable_laws":    ["AP Intermediate Education Act", "Consumer Protection Act 2019"],
    "licenses_required":  ["GST Registration", "Local Business Registration"],
    "restrictions":       ["Fee refund policy must be published"],
    "risk_rating":        "MEDIUM",
    "proceed_advised":    true,
    "notes":              "Ensure course completion certificates comply with state board guidelines"
  }
}
```

### Endpoint 3: `/campaign-review` — Marketing Compliance Review

Submits campaign content (email, WhatsApp message, or ad copy) for compliance review before it is sent. Detects misleading claims, missing disclaimers, unsubscribe-link violations, and sector-specific advertising rules.

**Request Body:**

```json
{
  "campaign_type":   "email",
  "subject":         "Crack JEE 2026 — Last 30 Days Strategy",
  "body":            "Join GrowthDesk and GUARANTEE your IIT seat...",
  "target_audience": "JEE aspirants, 16-18 years",
  "target_state":    "Pan-India"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "approved": false,
    "violations": [
      {
        "type":     "MISLEADING_CLAIM",
        "severity": "HIGH",
        "text":     "GUARANTEE your IIT seat",
        "reason":   "No coaching institute can legally guarantee exam results",
        "fix":      "Replace with: Improve your JEE score with proven strategies"
      },
      {
        "type":     "MISSING_DISCLAIMER",
        "severity": "MEDIUM",
        "text":     "(none)",
        "reason":   "Email marketing to minors requires parental consent statement",
        "fix":      "Add: Intended for students 18+ or with guardian consent"
      }
    ],
    "compliance_score": 42,
    "auto_approved":    false
  }
}
```

`compliance_score` runs 0–100; above 80 is auto-approved.

### Endpoint 4: `/draft-document` — Legal Document Generator

Generates a legally worded draft document based on a scenario type. Used in the ticket system to auto-draft formal response letters when a student raises a data dispute, refund request, or formal complaint.

**Request Body:**

```json
{
  "doc_type":                "data_dispute_response",
  "student_name":            "Demo Student",
  "student_email":           "demo@example.com",
  "issue_summary":           "Student claims data was shared without consent with 3rd party",
  "org_name":                "GrowthDesk Education",
  "org_address":             "City, State",
  "responding_on_behalf_of": "Operations Lead"
}
```

Other valid `doc_type` values: `refund_denial`, `fee_structure_disclosure`, `consent_withdrawal_ack`, `noc_letter`, `terms_update_notice`.

**Response:**

```json
{
  "status": "success",
  "data": {
    "document_text":      "Dear Student, We acknowledge receipt of your complaint...",
    "doc_type":           "data_dispute_response",
    "legal_references":   ["DPDP Act 2023 Section 8", "IT Act 2000 Section 43A"],
    "download_url":       "https://api.legaltech.../docs/draft_abc123.pdf",
    "review_recommended": true
  }
}
```

`download_url` expires in 24 hours. Always review before sending.

### Endpoint 5: `/alerts/subscribe` — Compliance Alert Webhooks

Registers GrowthDesk's webhook URL so that the LegalTech system can push real-time compliance alerts — regulatory changes, new DPDP notifications, or high-risk flags detected in existing data.

**Request Body — Subscribe:**

```json
{
  "webhook_url":  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  "alert_types":  ["dpdp_update", "market_restriction", "campaign_ban", "data_breach_advisory"],
  "notify_email": "admin@yourdomain.com"
}
```

**Incoming Alert Payload (sent TO GrowthDesk webhook):**

```json
{
  "alert_id":        "alrt_20260409_001",
  "alert_type":      "dpdp_update",
  "severity":        "HIGH",
  "title":           "DPDP Rules 2025 Amendment — Consent Re-collection Required",
  "description":     "All organizations must re-obtain digital consent from existing users by June 30 2026",
  "action_required": true,
  "deadline":        "2026-06-30",
  "affected_states": ["All"],
  "link":            "https://meity.gov.in/dpdp-2025-amendment"
}
```

**Apps Script Handler for Incoming Alerts:**

```js
// In apps-script/Code.gs — doPost() handler
function handleLegalAlert(alertData) {
  const sheet = SpreadsheetApp.openByUrl(SHEETS_URL).getSheetByName('Legal Alerts');
  sheet.appendRow([
    new Date(), alertData.alert_type, alertData.severity,
    alertData.title, alertData.deadline, alertData.action_required
  ]);
  if (alertData.severity === 'HIGH') {
    GmailApp.sendEmail(ADMIN_EMAIL, '[URGENT] Legal Alert: ' + alertData.title,
      alertData.description + '\n\nDeadline: ' + alertData.deadline);
  }
}
```

### Endpoint 6: `/ask` — Natural Language Compliance Q&A

Accepts a plain-English question and returns a plain-English compliance answer. Powers the GrowthDesk AI chatbot so students can ask questions about their data rights, refund policies, and course regulations without the team needing to respond manually.

**Request Body:**

```json
{
  "question": "Can you share my personal details with other coaching institutes?",
  "context": {
    "student_state":       "Delhi",
    "org_type":            "EdTech / Coaching Institute",
    "data_policy_version": "v2.1"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "answer":      "No. Under India's DPDP Act 2023, GrowthDesk cannot share your personal data with any third party without your explicit written consent. You have the right to withdraw consent at any time by contacting support.",
    "confidence":  0.97,
    "legal_basis": ["DPDP Act 2023 Section 4(1)", "IT Rules 2011 Rule 5(1)"],
    "caveats":     "This is general guidance. Consult a legal professional for specific advice.",
    "escalate":    false
  }
}
```

`escalate` is `true` if the question needs human legal review.

## 4. GrowthDesk Integration Map

The table below shows exactly where in GrowthDesk each API endpoint is called, what triggers the call, and what action is taken with the response.

| GrowthDesk Module | Trigger | API Endpoint | Action Taken |
|---|---|---|---|
| Lead Pipeline | New Hot/Warm lead flagged | `/market-entry` | Check if lead's sector is legally cleared for outreach |
| Lead Pipeline | Lead added from new region/state | `/data-check` | Verify DPDP consent status & data handling compliance |
| Campaign Builder | Campaign draft created | `/campaign-review` | Auto-flag non-compliant copy before sending |
| Campaign Builder | Course offering created for new state | `/market-entry` | Confirm education regulations allow offering |
| Dashboard Alerts | Any compliance flag returned | `/alerts/subscribe` | Push instant notification to GrowthDesk admin |
| Ticket System (Admin) | Student data dispute or complaint | `/draft-document` | Auto-draft a formal response letter |
| AI Chatbot (Student) | Student asks a legal/policy question | `/ask` | Return plain-English answer about data & rights |
| Settings / Setup | Initial integration configuration | All endpoints (test calls) | Verify API key and connectivity |

## 5. Error Handling

All errors follow the same envelope format. Always check the `status` field before reading `data`.

```json
{
  "status": "error",
  "error": {
    "code":        "INVALID_API_KEY",
    "message":     "The API key provided is invalid or expired.",
    "http_status": 401
  }
}
```

| HTTP Code | Error Code | Meaning & Action |
|---|---|---|
| 400 | `INVALID_REQUEST` | Missing or malformed field. Check payload structure. |
| 401 | `INVALID_API_KEY` | Key missing, invalid, or expired. Regenerate from the LegalTech portal. |
| 403 | `FORBIDDEN` | Key does not have permission for this endpoint. Contact LegalTech to upgrade. |
| 422 | `UNPROCESSABLE_ENTITY` | Data received but could not be processed (e.g. unknown state code). Validate inputs. |
| 429 | `RATE_LIMIT_EXCEEDED` | Over 200 requests/minute. Add exponential backoff in retry logic. |
| 500 | `INTERNAL_ERROR` | LegalTech API has encountered an error. Log `requestId` and retry after 30 seconds. |
| 503 | `SERVICE_UNAVAILABLE` | API is down for maintenance. Check status page; do not block GrowthDesk operations. |

## 6. Sample Apps Script Integration Code

Paste these snippets directly into `apps-script/Code.gs` to activate each integration point.

### 6.1 Setup — Store API Key

```js
// Run once from Apps Script editor: Tools > Script Properties
function setupLegalApiKey() {
  PropertiesService.getScriptProperties().setProperty('LEGAL_API_KEY', 'YOUR_KEY_HERE');
  Logger.log('API key saved securely.');
}

const LEGAL_API_BASE = 'https://api.legaltech-compliance.io/v1';

function getLegalApiKey() {
  return PropertiesService.getScriptProperties().getProperty('LEGAL_API_KEY');
}
```

### 6.2 Data Check — On Lead Creation

```js
function checkLeadCompliance(leadData) {
  const payload = {
    student_name:     leadData.name,
    email:            leadData.email,
    phone:            leadData.phone,
    state:            leadData.state || 'Unknown',
    data_source:      leadData.source,
    consent_given:    true,
    data_use_purpose: 'lead_nurturing'
  };
  try {
    const response = UrlFetchApp.fetch(LEGAL_API_BASE + '/data-check', {
      method: 'POST',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + getLegalApiKey() },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const result = JSON.parse(response.getContentText());
    if (result.status === 'success' && !result.data.compliant) {
      GmailApp.sendEmail(ADMIN_EMAIL, '[Compliance Flag] Lead: ' + leadData.name,
        'Risk: ' + result.data.risk_level + '\n' + result.data.flags.join('\n'));
    }
    return result.data;
  } catch (e) {
    Logger.log('Legal API error: ' + e.message);
    return null; // Fail open — don't block lead creation
  }
}
```

### 6.3 Campaign Review — Before Sending

```js
function reviewCampaignCompliance(campaignData) {
  const payload = {
    campaign_type:   campaignData.type || 'email',
    subject:         campaignData.subject,
    body:            campaignData.body,
    target_audience: campaignData.audience,
    target_state:    campaignData.state || 'Pan-India'
  };
  const response = UrlFetchApp.fetch(LEGAL_API_BASE + '/campaign-review', {
    method: 'POST',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + getLegalApiKey() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  return JSON.parse(response.getContentText()).data;
}
```

### 6.4 Ask Endpoint — Chatbot Integration

```js
function askLegalQuestion(question, studentState) {
  const payload = {
    question: question,
    context: {
      student_state:       studentState || 'India',
      org_type:            'EdTech / Coaching Institute',
      data_policy_version: 'v2.1'
    }
  };
  const response = UrlFetchApp.fetch(LEGAL_API_BASE + '/ask', {
    method: 'POST',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + getLegalApiKey() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  const result = JSON.parse(response.getContentText());
  if (result.status === 'success') {
    return result.data.answer;
  }
  return 'I was unable to retrieve legal information at this time. Please contact support.';
}
```

## 7. Integration Roadmap

| # | Action | Owner | Timeline |
|---|---|---|---|
| 1 | Sign off on API endpoints with the LegalTech provider | Project lead | Week 0 |
| 2 | Receive sandbox API URL + test API key | LegalTech provider | Week 1 |
| 3 | Add `LEGAL_API_KEY` to Apps Script Properties | Developer | Week 1 |
| 4 | Test `/data-check` with 5 sample lead entries in sandbox | Developer | Week 2 |
| 5 | Integrate `/campaign-review` into Campaign Builder UI | Developer | Week 2–3 |
| 6 | Connect `/ask` endpoint to student chatbot | Developer | Week 3 |
| 7 | Register webhook URL for `/alerts/subscribe` | Developer | Week 3 |
| 8 | UAT — end-to-end flow testing | Both teams | Week 4 |
| 9 | Switch from sandbox to production API key | Both teams | Week 4 |

---

*End of document · GrowthDesk × LegalTech API Specification v1.0 · April 2026*
