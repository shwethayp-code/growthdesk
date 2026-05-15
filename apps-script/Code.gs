// ============================================================
//  GROWTHDESK — Google Apps Script
//  Handles BOTH lead registrations AND student support tickets
//  Two sheets: "Leads" and "Tickets"
//
//  Setup:
//  1. Open your Google Sheet
//  2. Extensions → Apps Script → paste this → Save
//  3. Deploy → New deployment → Web App
//     Execute as: Me | Who has access: Anyone
//  4. Copy the Web App URL → paste it in the GrowthDesk app
//     under Settings → Sheets URL
// ============================================================

// ─── ⚠️  CONFIGURE BEFORE DEPLOY  ───────────────────────────
// Replace ADMIN_EMAIL below with the inbox that should receive
// new-ticket alerts, daily summaries, and weekly reports.
// Leaving the placeholder will route notifications nowhere.
// ────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@yourdomain.com';

const LEADS_SHEET   = "Leads";
const TICKETS_SHEET = "Tickets";

// ── POST: receives leads, tickets, rating updates, and email notifications ──
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.type === 'updateRating')   return updateTicketRating(data);
    if (data.type === 'ticket')         return saveTicket(data);
    if (data.type === 'notifyStudent')  return notifyStudent(data);
    if (data.type === 'closeTicket')    return closeTicketInSheet(data);
    if (data.type === 'weeklyReport')   return sendWeeklyReport(data);
    return saveLead(data);

  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

// ── GET: returns all leads or tickets based on ?sheet= param ──
function doGet(e) {
  try {
    const sheetParam = (e.parameter && e.parameter.sheet) || 'leads';

    if (sheetParam === 'tickets') {
      const sheet = getOrCreate(TICKETS_SHEET);
      return respondWithSheet(sheet);
    } else {
      const sheet = getOrCreate(LEADS_SHEET);
      return respondWithSheet(sheet);
    }

  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

// ── Save a lead registration ──
function saveLead(data) {
  const sheet = getOrCreate(LEADS_SHEET);

  // Resolve lead_id — check all possible field names, generate if missing
  const leadId = data.lead_id || data.id || ('L' + Utilities.getUuid().replace(/-/g,'').substring(0,4).toUpperCase());

  if (sheet.getLastRow() === 0) {
    const headers = [
      'lead_id','name','phone','email','age','class','city','target_exam',
      'pcm_percentage','source','interest_level','parent_income_range',
      'stage','score','category','recommended_action','submitted_at'
    ];
    sheet.appendRow(headers);
    styleHeader(sheet, headers.length);
  }

  sheet.appendRow([
    leadId,
    data.name,
    data.phone || '',
    data.email || '',
    data.age,
    data.cls || data.class,
    data.city,
    data.exam || data.target_exam,
    data.pcm  || data.pcm_percentage,
    data.source,
    data.interest || data.interest_level,
    data.income   || data.parent_income_range,
    'Lead',
    data.score,
    data.category,
    data.action   || data.recommended_action,
    new Date().toLocaleString('en-IN')
  ]);

  // ── Auto-send email based on lead score ──
  sendLeadEmail({
    lead_id:  leadId,
    name:     data.name,
    email:    data.email || '',
    exam:     data.exam  || data.target_exam || 'JEE/CET',
    score:    parseInt(data.score) || 0
  });

  return respond({ status: 'success', message: 'Lead saved!' });
}

// ── Send personalised email based on lead score ──
function sendLeadEmail(lead) {
  if (!lead.email || lead.email.trim() === '') return; // skip if no email

  const score    = lead.score || 0;
  const name     = lead.name ? lead.name.split(' ')[0] : 'there';
  const exam     = lead.exam || 'JEE/CET';
  const leadId   = lead.lead_id || '';

  let subject, body;

  if (score >= 80) {
    // 🔥 HOT — urgent personal outreach
    subject = '🎯 ' + name + ', a GrowthDesk counsellor will call you shortly!';
    body =
      'Hi ' + name + ',\n\n' +
      'Thank you for registering with GrowthDesk! 🚀\n\n' +
      'Based on your profile, you are a strong fit for our ' + exam + ' programme.\n\n' +
      '✅ Our counsellor will call you within 2 hours to discuss your personalised study plan.\n\n' +
      '📅 You can also book a free demo class here:\n' +
      'https://growthdesk.in/demo\n\n' +
      '─────────────────────\n' +
      'Your Lead ID: ' + leadId + '\n' +
      'Use this ID to log into your Student Portal and access course materials.\n' +
      '─────────────────────\n\n' +
      'Best regards,\n' +
      'GrowthDesk Team\n' +
      '📞 +91 98765 43210\n' +
      '✉️ support@growthdesk.in';

  } else if (score >= 60) {
    // 🌡️ WARM — webinar invite
    subject = '📅 ' + name + ', you\'re invited to our FREE ' + exam + ' Strategy Webinar!';
    body =
      'Hi ' + name + ',\n\n' +
      'Thank you for your interest in GrowthDesk! 🎓\n\n' +
      'We\'d love to invite you to our FREE online strategy session:\n\n' +
      '📌 Topic: How to crack ' + exam + ' in 6 months\n' +
      '📅 Date: This Saturday, 11:00 AM\n' +
      '💻 Mode: Online (link sent after registration)\n' +
      '🔗 Register here: https://growthdesk.in/webinar\n\n' +
      'Spots are limited — secure yours now!\n\n' +
      '─────────────────────\n' +
      'Your Lead ID: ' + leadId + '\n' +
      'Use this ID to log into your Student Portal and access course materials.\n' +
      '─────────────────────\n\n' +
      'Best regards,\n' +
      'GrowthDesk Team\n' +
      '📞 +91 98765 43210\n' +
      '✉️ support@growthdesk.in';

  } else {
    // ❄️ COLD — nurture with free resource
    subject = '📚 ' + name + ', here\'s your free ' + exam + ' study guide from GrowthDesk!';
    body =
      'Hi ' + name + ',\n\n' +
      'Thanks for registering with GrowthDesk! 🌟\n\n' +
      'We\'ve put together a FREE study guide for ' + exam + ' aspirants like you:\n\n' +
      '📥 Download your free guide: https://growthdesk.in/free-guide\n\n' +
      'It covers:\n' +
      '  • Top 10 topics to focus on\n' +
      '  • Common mistakes to avoid\n' +
      '  • 30-day study plan template\n\n' +
      'Whenever you\'re ready to take the next step, our counsellors are here to help.\n\n' +
      '─────────────────────\n' +
      'Your Lead ID: ' + leadId + '\n' +
      'Use this ID to log into your Student Portal and access course materials.\n' +
      '─────────────────────\n\n' +
      'Best regards,\n' +
      'GrowthDesk Team\n' +
      '📞 +91 98765 43210\n' +
      '✉️ support@growthdesk.in';
  }

  try {
    GmailApp.sendEmail(lead.email, subject, body);
    Logger.log('✅ Email sent → ' + lead.email + ' | Score: ' + score + ' | Category: ' + (score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : 'Cold'));
  } catch (err) {
    Logger.log('❌ Email failed → ' + lead.email + ' | Error: ' + err.toString());
  }
}

// ── Save a support ticket ──
function saveTicket(data) {
  const sheet = getOrCreate(TICKETS_SHEET);

  if (sheet.getLastRow() === 0) {
    const headers = [
      'ticket_id','lead_id','name','phone','email','age','class','city',
      'target_exam','query_type','query_message','priority',
      'ticket_status','satisfaction_score','submitted_at'
    ];
    sheet.appendRow(headers);
    styleHeader(sheet, headers.length);
  }

  sheet.appendRow([
    data.ticketId,
    data.leadId,
    data.name,
    data.phone || '',
    data.email || '',
    data.age,
    data.cls,
    data.city,
    data.exam,
    data.queryType,
    data.queryMessage,
    data.priority,
    data.status || 'Open',
    data.satisfactionScore || '',
    new Date().toLocaleString('en-IN')
  ]);

  // ── Notify admin that a new ticket has been raised ──
  notifyAdminNewTicket(data);

  return respond({ status: 'success', message: 'Ticket saved!', ticketId: data.ticketId });
}

// ── Email admin when a new ticket is raised ──
function notifyAdminNewTicket(data) {
  try {
    const subject = '🎫 New Support Ticket: ' + (data.queryType || 'General') + ' — ' + (data.name || 'Student');
    const body =
      '📬 A new support ticket has been raised on GrowthDesk.\n\n' +
      '──────────────────────────\n' +
      '🎫 Ticket ID   : ' + (data.ticketId || '—') + '\n' +
      '👤 Student     : ' + (data.name     || '—') + '\n' +
      '📞 Phone       : ' + (data.phone    || '—') + '\n' +
      '✉️  Email       : ' + (data.email    || '—') + '\n' +
      '🏙️  City        : ' + (data.city     || '—') + '\n' +
      '📚 Exam        : ' + (data.exam     || '—') + '\n' +
      '──────────────────────────\n' +
      '🔖 Query Type  : ' + (data.queryType    || '—') + '\n' +
      '❓ Issue       : ' + (data.queryMessage || '—') + '\n' +
      '⚠️  Priority    : ' + (data.priority    || 'Normal') + '\n' +
      '──────────────────────────\n\n' +
      'Please log into the GrowthDesk dashboard to respond.\n\n' +
      'GrowthDesk Support System';

    GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
    Logger.log('✅ Admin notified → ' + ADMIN_EMAIL + ' | Ticket: ' + data.ticketId);
  } catch (err) {
    Logger.log('❌ Admin notify failed: ' + err.toString());
  }
}

// ── Email student when a ticket is responded to ──
function notifyStudent(data) {
  try {
    if (!data.email || data.email.trim() === '') {
      return respond({ status: 'skipped', message: 'No student email provided' });
    }

    const name     = data.name ? data.name.split(' ')[0] : 'there';
    const isClosed = data.isClosed === true || data.isClosed === 'true';

    const subject = isClosed
      ? '✅ Your GrowthDesk support ticket ' + data.ticketId + ' has been resolved!'
      : '💬 Update on your GrowthDesk support ticket ' + data.ticketId;

    const body =
      'Hi ' + name + ',\n\n' +
      (isClosed
        ? 'Great news! Your support ticket has been resolved by our team. 🎉\n'
        : 'Our support team has responded to your ticket. 📬\n') +
      '\n──────────────────────────\n' +
      '🎫 Ticket ID : ' + (data.ticketId || '—') + '\n' +
      '🔖 Query     : ' + (data.query    || '—') + '\n' +
      '📌 Status    : ' + (isClosed ? 'Resolved ✅' : 'In Progress 🔄') + '\n' +
      '──────────────────────────\n\n' +
      '💬 Response from GrowthDesk team:\n' +
      '─────────────────────────────────\n' +
      (data.response || 'Our team will follow up with you shortly.') + '\n' +
      '─────────────────────────────────\n\n' +
      (isClosed
        ? 'We hope your issue has been resolved. If you have any further questions, feel free to raise a new ticket.\n\n'
        : 'We are actively working on your query. We will update you again once resolved.\n\n') +
      'Best regards,\n' +
      'GrowthDesk Support Team\n' +
      '📞 +91 98765 43210\n' +
      '✉️ support@growthdesk.in';

    GmailApp.sendEmail(data.email, subject, body);
    Logger.log('✅ Student notified → ' + data.email + ' | Ticket: ' + data.ticketId);
    return respond({ status: 'success', message: 'Student notified' });
  } catch (err) {
    Logger.log('❌ Student notify failed: ' + err.toString());
    return respond({ status: 'error', message: err.toString() });
  }
}

// ── Update ticket status in sheet when closed from dashboard ──
function closeTicketInSheet(data) {
  try {
    const sheet = getOrCreate(TICKETS_SHEET);
    const rows  = sheet.getDataRange().getValues();
    if (rows.length < 2) return respond({ status: 'error', message: 'No tickets found' });

    const headers    = rows[0];
    const tktIdCol   = headers.indexOf('ticket_id');
    const statusCol  = headers.indexOf('ticket_status');

    if (tktIdCol === -1 || statusCol === -1)
      return respond({ status: 'error', message: 'Column not found' });

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][tktIdCol] === data.ticketId) {
        sheet.getRange(i + 1, statusCol + 1).setValue(data.status || 'Resolved');
        Logger.log('✅ Ticket closed in sheet: ' + data.ticketId);
        return respond({ status: 'success', message: 'Ticket closed in sheet' });
      }
    }
    return respond({ status: 'error', message: 'Ticket ID not found' });
  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

// ── Update satisfaction score on an existing ticket row (no duplicate) ──
function updateTicketRating(data) {
  const sheet = getOrCreate(TICKETS_SHEET);
  const rows  = sheet.getDataRange().getValues();
  if (rows.length < 2) return respond({ status: 'error', message: 'No tickets found' });

  const headers   = rows[0];
  const tktIdCol  = headers.indexOf('ticket_id');
  const scoreCol  = headers.indexOf('satisfaction_score');

  if (tktIdCol === -1 || scoreCol === -1)
    return respond({ status: 'error', message: 'Column not found' });

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][tktIdCol] === data.ticketId) {
      sheet.getRange(i + 1, scoreCol + 1).setValue(data.satisfactionScore);
      return respond({ status: 'success', message: 'Rating updated' });
    }
  }
  return respond({ status: 'error', message: 'Ticket ID not found' });
}

// ── Read sheet into JSON ──
function respondWithSheet(sheet) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return respond({ status: 'success', leads: [], tickets: [] });

  const headers = rows[0];
  const records = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });

  return respond({ status: 'success', records });
}

// ── Helpers ──
function getOrCreate(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function styleHeader(sheet, cols) {
  sheet.getRange(1, 1, 1, cols)
    .setBackground('#1E1B4B')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(11);
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  WEEKLY AUTO-REPORT EMAIL
//  Set up a time-based trigger: every Monday at 8 AM
//  Apps Script → Triggers → Add Trigger → sendScheduledWeeklyReport
//  → Time-driven → Week timer → Monday → 8–9 AM
// ============================================================
function sendScheduledWeeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const leadsSheet   = ss.getSheetByName(LEADS_SHEET);
  const ticketsSheet = ss.getSheetByName(TICKETS_SHEET);
  const totalLeads   = leadsSheet   ? Math.max(0, leadsSheet.getLastRow()   - 1) : 0;
  const totalTickets = ticketsSheet ? Math.max(0, ticketsSheet.getLastRow() - 1) : 0;

  const now   = new Date();
  const week  = Utilities.formatDate(now, 'Asia/Kolkata', 'dd MMM yyyy');
  const subject = '📊 GrowthDesk Weekly Report — ' + week;

  const body = `
Hi Team,

Here is your GrowthDesk weekly summary for the week ending ${week}.

─────────────────────────────────────
📊 WEEKLY SUMMARY
─────────────────────────────────────
  Total Leads in System:   ${totalLeads}
  Total Tickets in System: ${totalTickets}

  → Open the GrowthDesk dashboard for full lead scores,
    revenue, enrolled students, and compliance data.

─────────────────────────────────────
📋 ACTION ITEMS THIS WEEK
─────────────────────────────────────
  1. Follow up on all Hot leads (score ≥ 80) immediately.
  2. Resolve any open support tickets before end of week.
  3. Check pending/overdue fee records and send reminders.
  4. Review any compliance flags from the Legal tab.
  5. Confirm all upcoming demo bookings for this week.

─────────────────────────────────────

This is an automated report from GrowthDesk.
Sent every Monday at 8 AM IST.

Best,
GrowthDesk Automation
  `.trim();

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
  Logger.log('✅ Weekly report sent to ' + ADMIN_EMAIL);
}

// Triggered by the front-end "Send Test Report" button
function sendWeeklyReport(data) {
  const email    = data.email || ADMIN_EMAIL;
  const now      = new Date();
  const dateStr  = Utilities.formatDate(now, 'Asia/Kolkata', 'dd MMM yyyy');
  const subject  = '📊 GrowthDesk Performance Report — ' + dateStr;
  const fmt      = n => '₹' + (n >= 100000 ? (n/100000).toFixed(1) + 'L' : n >= 1000 ? (n/1000).toFixed(1) + 'K' : n);

  const body = `
Hi Team,

Here is your GrowthDesk performance summary as of ${dateStr}.

─────────────────────────────────────
📊 KEY METRICS
─────────────────────────────────────
  Total Leads:        ${data.leads || 0}
  Hot Leads (≥80):    ${data.hot   || 0}
  Open Tickets:       ${(data.tickets || 0) - (data.resolved || 0)}
  Tickets Resolved:   ${data.resolved || 0}
  Enrolled Students:  ${data.enrolled || 0}
  Revenue Collected:  ${fmt(data.revenue || 0)}

─────────────────────────────────────
📋 SUGGESTED ACTIONS
─────────────────────────────────────
  ${data.hot > 0  ? '⚡ ' + data.hot + ' hot lead(s) ready for conversion — reach out today.' : ''}
  ${(data.tickets-data.resolved)>0 ? '🎫 ' + (data.tickets-data.resolved) + ' ticket(s) still open — resolve ASAP.' : ''}
  ${data.revenue > 0 ? '💰 Great work — ' + fmt(data.revenue) + ' in collected revenue!' : ''}

─────────────────────────────────────
This report was generated by GrowthDesk.
Visit your dashboard for detailed breakdowns.

Best,
GrowthDesk Automation
  `.trim();

  GmailApp.sendEmail(email, subject, body);
  return respond({ status: 'success', message: 'Weekly report sent to ' + email });
}

// ── Run this ONCE to authorize Gmail access ──
// Select "testEmailAuth" in the dropdown and click Run ▶️
// Accept the permission popup, then you can delete this function.
function testEmailAuth() {
  sendLeadEmail({
    lead_id: 'L0001',
    name:    'Demo User',
    email:   'admin@yourdomain.com',
    exam:    'JEE',
    score:   85
  });
  Logger.log('✅ Test email sent to admin@yourdomain.com — check your inbox!');
}
