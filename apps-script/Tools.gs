function testConfiguration() {
  const sheet = getRegistrationSheet_();
  const result = {
    spreadsheet: sheet.getParent().getName(),
    sheet: sheet.getName(),
    rowsIncludingHeader: sheet.getLastRow(),
    timeZone: Session.getScriptTimeZone(),
    remainingEmailQuota: MailApp.getRemainingDailyQuota()
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
}

function sendTestEmailToOwner() {
  const email = Session.getEffectiveUser().getEmail();
  if (!email) {
    throw new Error('Could not resolve the effective Google account email.');
  }

  const registrationId = 'CBC-TEST-' + Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase();
  const html = emailTemplate_({
    fullName: 'Claude Builder Club Admin',
    registrationId,
    title: 'Email system test',
    intro: 'If you received this message, the Apps Script email configuration is working correctly.'
  });

  MailApp.sendEmail({
    to: email,
    subject: `Test: ${CONFIG.EVENT_NAME} email system`,
    body: `Apps Script email test successful. Registration ID: ${registrationId}`,
    htmlBody: html,
    name: CONFIG.CLUB_NAME,
    replyTo: CONFIG.CONTACT_EMAIL
  });

  return `Test email sent to ${email}`;
}
