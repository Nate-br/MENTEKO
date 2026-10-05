import type { Scenario } from '@/types';

/**
 * Additional awareness scenarios (baiting, scareware, extended phishing, etc.).
 * All organizations, devices, and contacts are fictional training content.
 */
export const extraScenarios: Scenario[] = [
  {
    _id: 'seed-baiting-usb-01',
    title: 'Unknown USB on Your Desk',
    category: 'baiting',
    difficulty: 'beginner',
    format: 'PHYSICAL / USB',
    context:
      'You sit down at your work desk Monday morning. A USB flash drive is on your keyboard. You did not leave it there, and no one mentioned a device handoff.',
    content: {
      subject: 'Found item: USB flash drive',
      body: 'The drive has a handwritten label: "Q4 Bonus List — OPEN FIRST". It looks new. Curiosity is natural — you wonder if someone meant to share payroll information or if you should check whether it belongs to a teammate.',
      meta: { location: 'Your desk (fictional training scenario)' },
      callToAction: 'Plug in to see contents',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Curiosity bait',
        description:
          'Labels like "confidential" or "bonus list" are designed to make you plug the device in without thinking.',
      },
      {
        id: 'ind-2',
        title: 'Unknown origin',
        description: 'You cannot verify who placed the drive or whether it is an approved IT delivery.',
      },
      {
        id: 'ind-3',
        title: 'USB risk',
        description:
          'Untrusted USB devices can install malware automatically on some systems — you do not need to open any file.',
      },
      {
        id: 'ind-4',
        title: 'Wrong channel',
        description: 'Real HR or finance updates use official systems, not random drives left on desks.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Plug into my work PC', isCorrect: false },
      { id: 'opt-home', label: 'Plug into my personal laptop at home', isCorrect: false },
      { id: 'opt-report', label: 'Report to IT / security without plugging it in', isCorrect: true },
      { id: 'opt-ignore', label: 'Leave it on the desk and ignore it', isCorrect: false },
    ],
    explanation:
      'This is a classic USB baiting attack. Attackers hope curiosity wins. Plugging the drive in — at work or at home — can compromise a machine even if you only "look quickly."',
    betterResponse:
      'STOP — do not plug it in. CHECK with IT or security using your normal help process. Hand the device to them untouched. REPORT the find so they can warn others and investigate.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-baiting-usb-02',
    title: 'USB in the Office Parking Lot',
    category: 'baiting',
    difficulty: 'intermediate',
    format: 'PHYSICAL / USB',
    context:
      'Walking from the parking lot, you notice a USB drive on the ground near the entrance. It is in a small ziplock bag with a printed sticker: "Employee Event Photos".',
    content: {
      body: 'The sticker looks official enough to belong to your organization, but there is no name, ticket number, or IT asset tag. Several coworkers are nearby; no one claims it when you ask casually.',
      callToAction: 'Take it inside and plug in to return photos',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Dropped bait',
        description: 'Attackers often "drop" labeled drives where employees will find them.',
      },
      {
        id: 'ind-2',
        title: 'False legitimacy',
        description: 'Professional-looking labels do not prove the device is safe or internal.',
      },
      {
        id: 'ind-3',
        title: 'Helpful instinct exploited',
        description: '"Returning photos" feels like doing a favor — baiting uses that social pressure.',
      },
      {
        id: 'ind-4',
        title: 'No chain of custody',
        description: 'You cannot trace who dropped it or what is stored on it.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Plug in at work to preview files', isCorrect: false },
      { id: 'opt-report', label: 'Give it to security / IT without using it', isCorrect: true },
      { id: 'opt-pocket', label: 'Keep it in your bag for later', isCorrect: false },
      { id: 'opt-share', label: 'Ask a friend to try it on their PC', isCorrect: false },
    ],
    explanation:
      'Parking-lot USB drops target employees who want to be helpful. The safe path treats every unknown drive as untrusted hardware.',
    betterResponse:
      'STOP before connecting it anywhere. CHECK your organization’s policy on found media. VERIFY with security — do not preview files yourself. REPORT the incident.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-baiting-qr-01',
    title: 'Break Room "Free Lunch" QR Code',
    category: 'baiting',
    difficulty: 'beginner',
    format: 'PHYSICAL / QR',
    context:
      'A colorful flyer in the break room advertises a "Staff Appreciation Lunch" and shows a large QR code. You do not recall HR announcing this event.',
    content: {
      body: 'Scan for your meal voucher — limited to the first 50 employees today!\n\nThe flyer has no official letterhead, no contact extension, and the QR code goes to a URL you cannot read without scanning.',
      callToAction: 'Scan QR code now',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Curiosity and reward',
        description: 'Free food and scarcity ("first 50") push you to scan before verifying.',
      },
      {
        id: 'ind-2',
        title: 'Unverified channel',
        description: 'Real events are usually announced on official intranet or email, not mystery flyers.',
      },
      {
        id: 'ind-3',
        title: 'QR hides the destination',
        description: 'You cannot see the real link until after you scan — a common baiting trick.',
      },
      {
        id: 'ind-4',
        title: 'Physical + digital blend',
        description: 'Attackers use paper in trusted spaces to bypass your email filters.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Scan the QR on my phone', isCorrect: false },
      { id: 'opt-verify', label: 'Verify with HR via official intranet / known number', isCorrect: true },
      { id: 'opt-share', label: 'Share the flyer in team chat', isCorrect: false },
      { id: 'opt-report', label: 'Remove flyer and report to security', isCorrect: true },
    ],
    explanation:
      'QR baiting works like phishing with paper. Verifying through official channels or reporting suspicious physical material are both strong habits; scanning an unknown code is high risk.',
    betterResponse:
      'STOP before scanning. CHECK whether the event exists on trusted internal sources. VERIFY with HR or security — not the phone number on the flyer. REPORT suspicious postings.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-scareware-01',
    title: 'Browser "Virus Detected" Pop-up',
    category: 'scareware',
    difficulty: 'beginner',
    format: 'SCAREWARE POPUP',
    context:
      'While researching a work topic, a new browser tab suddenly fills your screen with flashing warnings and loud alert sounds.',
    content: {
      sender: 'System Alert (browser tab — not your real antivirus)',
      subject: 'CRITICAL: 47 threats found on this device',
      body: 'Your computer may be locked in 5 minutes. Call the Microsoft Security Hotline immediately: 1-800-555-0199 (fictional). Do not shut down — closing the window may delete your files.',
      callToAction: 'CALL NOW',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Fear and urgency',
        description: 'Countdown timers and "critical" language are meant to stop you from thinking.',
      },
      {
        id: 'ind-2',
        title: 'Fake authority',
        description: 'The page mimics security software but is just a website — not your IT department.',
      },
      {
        id: 'ind-3',
        title: 'Phone support trap',
        description: 'Scareware often pushes you to call attackers who ask for remote access or payment.',
      },
      {
        id: 'ind-4',
        title: 'Browser-only symptom',
        description: 'Real endpoint alerts come from your organization’s managed security tools, not a random tab.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Call the number on the screen', isCorrect: false },
      { id: 'opt-download', label: 'Download the "cleaner" it offers', isCorrect: false },
      { id: 'opt-close', label: 'Close the tab and report to IT if unsure', isCorrect: true },
      { id: 'opt-pay', label: 'Pay the fee to unlock the PC', isCorrect: false },
    ],
    explanation:
      'This is scareware — pressure through fake technical emergencies. Legitimate IT will not demand payment or immediate phone calls through a browser pop-up.',
    betterResponse:
      'STOP — do not call or pay. CHECK whether the alert matches your real security software. Close the tab safely (force-quit browser if needed). VERIFY with IT through your normal channel. REPORT the URL if policy allows.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-phishing-02',
    title: 'MFA Device "Expires Tonight"',
    category: 'phishing',
    difficulty: 'intermediate',
    format: 'EMAIL',
    context:
      'You receive an email about your workplace sign-in app. You use multi-factor authentication daily and know it is important.',
    content: {
      sender: 'Identity Team <noreply@sso-portal-update.test>',
      fromName: 'Identity Team',
      fromEmail: 'noreply@sso-portal-update.test',
      to: 'you@company.example',
      sentAt: 'Wed 4:55 PM',
      subject: 'Action required: re-register MFA before midnight',
      body: 'Your MFA registration will expire tonight. To avoid losing access to email and internal tools, confirm your device using the link below within the next 3 hours.',
      callToAction: 'Re-register MFA',
      linkDisplay: 'https://sso.company.example/security/mfa',
      linkActual: 'https://sso-portal-update.test/device/refresh',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Artificial deadline',
        description: 'Same-day MFA expiry is unusual and pressures quick clicks.',
      },
      {
        id: 'ind-2',
        title: 'Lookalike domain',
        description: 'The sender domain is not your organization’s real identity provider.',
      },
      {
        id: 'ind-3',
        title: 'Link-based "fix"',
        description: 'Real MFA changes usually happen inside the official app or settings you already use.',
      },
      {
        id: 'ind-4',
        title: 'Broad access threat',
        description: 'Mentioning "email and internal tools" increases fear of being locked out.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Click the link and sign in', isCorrect: false },
      { id: 'opt-verify', label: 'Open MFA settings through known app / IT portal', isCorrect: true },
      { id: 'opt-report', label: 'Report the email to security', isCorrect: true },
      { id: 'opt-forward', label: 'Forward to coworkers as a warning without reporting', isCorrect: false },
    ],
    explanation:
      'MFA phishing tries to steal both your password and second factor in one fake login. Checking settings through a bookmark or official app avoids the trap.',
    betterResponse:
      'STOP before using email links. CHECK the sender and URL. VERIFY MFA status only through trusted entry points. REPORT phishing to your security team.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-impersonation-02',
    title: 'Urgent "Executive" Gift Card Request',
    category: 'impersonation',
    difficulty: 'advanced',
    format: 'CHAT MESSAGE',
    context:
      'A chat message appears from someone whose display name matches a senior leader in your org chart. You are busy and the tone feels familiar.',
    content: {
      sender: 'Alex Morgan — Managing Director (display name only)',
      subject: 'Quick favor — in a meeting',
      body: 'I need you to buy 5 gift cards for client thank-yous before the board call ends. I will reimburse you today. Send me the codes in this chat — cannot talk, text only.',
      callToAction: 'BUY GIFT CARDS NOW',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Authority pressure',
        description: 'Senior titles make employees skip normal purchase procedures.',
      },
      {
        id: 'ind-2',
        title: 'Secrecy and urgency',
        description: '"In a meeting" and "text only" block verification by phone or assistant.',
      },
      {
        id: 'ind-3',
        title: 'Untraceable payment',
        description: 'Gift card codes are cash-like and hard to recover once sent.',
      },
      {
        id: 'ind-4',
        title: 'Spoofed identity',
        description: 'Display names in chat can be changed; they are not proof of who is typing.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Buy cards and send codes', isCorrect: false },
      { id: 'opt-verify', label: 'Verify via known phone / assistant / finance policy', isCorrect: true },
      { id: 'opt-report', label: 'Report as suspected impersonation', isCorrect: true },
      { id: 'opt-wait', label: 'Wait and hope they follow up', isCorrect: false },
    ],
    explanation:
      'Executive impersonation (BEC) fraud costs organizations heavily. Finance policy and out-of-band verification exist precisely for unusual payment requests.',
    betterResponse:
      'STOP spending or sharing codes. CHECK policy on purchases and approvals. VERIFY the request through a channel you trust — not the chat thread. REPORT to security and finance.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-social-engineering-02',
    title: 'Tailgating at the Secure Door',
    category: 'social-engineering',
    difficulty: 'intermediate',
    format: 'PHYSICAL / ACCESS',
    context:
      'You badge into a restricted office area. Someone you do not recognize walks up behind you carrying boxes and coffee, looking rushed.',
    content: {
      body: 'Stranger: "Hey, can you hold the door? I forgot my badge upstairs — delivery for the finance team. They\'re expecting me in five minutes."',
      callToAction: 'Hold the door open',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Social pressure',
        description: 'Boxes, rush, and familiarity cues make saying "no" feel rude.',
      },
      {
        id: 'ind-2',
        title: 'Badge policy bypass',
        description: 'Letting someone follow you defeats physical access controls.',
      },
      {
        id: 'ind-3',
        title: 'Unverified story',
        description: 'You have not confirmed a delivery or visitor pass with reception or finance.',
      },
      {
        id: 'ind-4',
        title: 'Tailgating risk',
        description: 'Attackers use piggybacking to reach devices, documents, or unattended areas.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Hold the door and let them in', isCorrect: false },
      { id: 'opt-verify', label: 'Direct them to reception / visitor check-in', isCorrect: true },
      { id: 'opt-badge', label: 'Badge them in "just this once"', isCorrect: false },
      { id: 'opt-ignore', label: 'Walk away without saying anything', isCorrect: false },
    ],
    explanation:
      'Physical social engineering is as real as email phishing. Policy-friendly help means sending people through official visitor processes, not bypassing locks.',
    betterResponse:
      'STOP before granting access. CHECK visitor policy. VERIFY with reception or the named team. Do not badge strangers in. REPORT repeated tailgating attempts.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-social-engineering-03',
    title: 'The "External Audit" Phone Call',
    category: 'social-engineering',
    difficulty: 'intermediate',
    format: 'CALL TRANSCRIPT',
    context:
      'Your desk phone rings. The caller says they are from an external audit firm working with your organization this quarter.',
    content: {
      sender: 'Caller ID: "Compliance Audit" (spoofed — fictional)',
      subject: 'Scheduled compliance interview',
      body: 'Caller: "We are validating employee contact lists before tomorrow\'s audit. Please read me the names and direct emails for your department so we can send the questionnaire tonight."',
      callToAction: 'READ OUT THE DIRECTORY',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Pretexting',
        description: 'A believable story ("audit") justifies an information request you would normally refuse.',
      },
      {
        id: 'ind-2',
        title: 'Data harvesting',
        description: 'Employee lists fuel targeted phishing and impersonation later.',
      },
      {
        id: 'ind-3',
        title: 'Unverified caller',
        description: 'Caller ID labels can be faked; they are not proof of identity.',
      },
      {
        id: 'ind-4',
        title: 'Same-day pressure',
        description: 'Deadlines reduce the chance you will check with legal or HR first.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Read the names and emails', isCorrect: false },
      { id: 'opt-verify', label: 'Refuse and verify through internal audit / legal contact', isCorrect: true },
      { id: 'opt-email', label: 'Email the list to the address they provide', isCorrect: false },
      { id: 'opt-report', label: 'Report the call to security', isCorrect: true },
    ],
    explanation:
      'Pretexting calls collect building blocks for bigger attacks. Internal audit and legal teams can confirm whether any such request is real.',
    betterResponse:
      'STOP sharing directory data. CHECK official audit communications. VERIFY through known internal contacts. REPORT suspicious calls.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-fake-evidence-02',
    title: 'Vendor Invoice With New Bank Details',
    category: 'fake-evidence',
    difficulty: 'advanced',
    format: 'EMAIL + ATTACHMENT',
    context:
      'Accounts payable receives an email that looks like a routine invoice from a vendor you have paid before. The PDF is attached.',
    content: {
      sender: 'billing@vendor-supplies-partner.test',
      fromName: 'Vendor Supplies Billing',
      fromEmail: 'billing@vendor-supplies-partner.test',
      to: 'ap@company.example',
      sentAt: 'Thu 10:03 AM',
      subject: 'Invoice #INV-8842 — updated payment instructions',
      body: 'Please note our bank details changed last week. Use the account on the attached invoice for this payment. Approve today to avoid late fees on your subscription.',
      attachmentLabel: 'INV-8842.pdf (unverified)',
      callToAction: 'PAY TO NEW ACCOUNT',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Payment detail change',
        description: 'Fraudsters often ask you to send money to a new account while mimicking a real vendor.',
      },
      {
        id: 'ind-2',
        title: 'Email-only notice',
        description: 'Major banking changes typically involve verified contracts and known account managers.',
      },
      {
        id: 'ind-3',
        title: 'Late fee pressure',
        description: 'Fees push AP staff to skip verification steps.',
      },
      {
        id: 'ind-4',
        title: 'Lookalike address',
        description: 'The domain is close to, but not the same as, prior legitimate messages.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Pay using the new details in the PDF', isCorrect: false },
      { id: 'opt-verify', label: 'Confirm bank details via known vendor contact / contract', isCorrect: true },
      { id: 'opt-reply', label: 'Reply to the email to confirm', isCorrect: false },
      { id: 'opt-report', label: 'Escalate to finance security / AP lead', isCorrect: true },
    ],
    explanation:
      'Invoice fraud succeeds when busy teams trust attachments. Out-of-band verification with a phone number or portal you already use prevents misdirected payments.',
    betterResponse:
      'STOP before changing payee details. CHECK against your vendor master record. VERIFY through a trusted contact — not the email thread. REPORT suspected fraud.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'seed-payment-fraud-02',
    title: 'Wrong-Number "Accidental" Transfer',
    category: 'payment-fraud',
    difficulty: 'beginner',
    format: 'SMS / CHAT',
    context:
      'A message arrives on your work mobile from an unknown number. It includes a screenshot of a mobile-money transfer meant for someone else.',
    content: {
      sender: '+251-9XX-XXX-XXX (unknown)',
      subject: 'Please send it back — wrong account',
      body: 'Sorry, I sent you 12,000 ETB by mistake. Here is the screenshot. Please send it back to this number right away — I need it for rent today.',
      callToAction: 'REFUND TO THIS NUMBER',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Fabricated proof',
        description: 'Screenshots do not prove money hit your account — only your balance does.',
      },
      {
        id: 'ind-2',
        title: 'Emotional pressure',
        description: 'Rent deadlines and apologies push you to act before verifying.',
      },
      {
        id: 'ind-3',
        title: 'Refund scam pattern',
        description: 'You may be asked to return "extra" money from a fake or reversed transfer.',
      },
      {
        id: 'ind-4',
        title: 'Unknown sender',
        description: 'There is no established relationship or official dispute process.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'Send money back immediately', isCorrect: false },
      { id: 'opt-verify', label: 'Check your actual balance / official app first', isCorrect: true },
      { id: 'opt-report', label: 'Report / block and alert security if work device', isCorrect: true },
      { id: 'opt-reply', label: 'Argue with the sender in chat', isCorrect: false },
    ],
    explanation:
      'Wrong-number refund scams rely on fake receipts and urgency. If no funds arrived, sending money means you are paying the scammer.',
    betterResponse:
      'STOP before sending funds. CHECK your real transaction history. VERIFY through your bank or mobile-money app — not the sender. REPORT the scam.',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];
