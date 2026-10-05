import type { IScenario } from '../models/Scenario';
import { extraScenarioSeedData } from './extraScenarioSeedData';

/**
 * Seed data for the 5 MVP scenarios. All senders, names, amounts and
 * references are fictional. See project safety rules: MENTEKO never
 * connects to or represents any real institution's live systems.
 */
export const scenarioSeedData: Partial<IScenario>[] = [
  {
    title: 'Menteko Bank — Account Verification',
    category: 'phishing',
    difficulty: 'beginner',
    format: 'EMAIL',
    context:
      'You are an employee checking work email on a weekday morning. This message appears in your inbox. Menteko Bank is a fictional organization used only for this authorized awareness exercise.',
    content: {
      sender: 'Menteko Bank Security <alerts@secure.menteko.local>',
      fromName: 'Menteko Bank Security',
      fromEmail: 'alerts@secure.menteko.local',
      to: 'you@company.example',
      sentAt: 'Mon 8:42 AM',
      subject: 'Action required: verify your Menteko Bank account within 24 hours',
      body: 'Dear customer,\n\nOur systems flagged unusual sign-in activity on your Menteko Bank account. To keep your account active, please verify your identity today.\n\nIf you do not complete verification within 24 hours, online access may be temporarily restricted.\n\nThank you,\nMenteko Bank Customer Security',
      callToAction: 'Verify account now',
      linkDisplay: 'https://www.mentekobank.example/verify',
      linkActual: 'https://secure.menteko.local/account/verify?id=trn-8841',
      meta: {
        simulationModule: 'menteko-bank-phishing',
        organization: 'Menteko Bank (fictional — training only)',
      },
    },
    indicators: [
      { id: 'ind-1', title: 'Urgency', description: 'The message uses a 24-hour deadline to push you to act before you have time to think.' },
      { id: 'ind-2', title: 'Unexpected request', description: 'You were not expecting an account verification request in email, especially at work.' },
      { id: 'ind-3', title: 'Suspicious URL', description: 'The real destination (secure.menteko.local) does not match a legitimate Menteko Bank web address you would normally use.' },
      { id: 'ind-4', title: 'Sensitive information', description: 'Verification pages often ask for login details — a common way phishers harvest credentials.' },
      { id: 'ind-5', title: 'Identity verification', description: 'The sender address uses a lookalike domain; you cannot confirm this message came from the real bank without checking independently.' },
    ],
    options: [
      { id: 'opt-report', label: 'Report the message', isCorrect: true },
      { id: 'opt-ignore', label: 'Ignore or delete the message', isCorrect: true },
      { id: 'opt-click-link', label: 'Click the verification link', isCorrect: false },
      { id: 'opt-reply', label: 'Reply to the sender', isCorrect: false },
    ],
    explanation:
      'This was a controlled phishing-awareness simulation. The message combined urgency, fear of account restriction, and a link to an unverified domain — classic signs of phishing. No real credentials were collected.',
    betterResponse:
      'STOP — do not act immediately. CHECK the sender, link, and whether the request makes sense. VERIFY using an independent channel (official app or known phone number, not this email). Do not provide credentials or sensitive information. REPORT using your organization’s approved process.',
    isActive: true,
  },
  {
    title: 'The "Bank Officer" Call',
    category: 'impersonation',
    difficulty: 'intermediate',
    format: 'CALL TRANSCRIPT',
    context:
      'Your phone rings from an unknown number. The caller identifies themselves as a fraud-prevention officer from your bank.',
    content: {
      sender: '+251-9XX-XXX-XXX (unlisted)',
      subject: 'Incoming call: "Fraud Prevention Department"',
      body: 'Caller: "This is the fraud prevention team. We\'ve flagged a suspicious transfer on your account. To cancel it, I need you to confirm your PIN and the code that was just sent to your phone."',
      callToAction: 'PROVIDE PIN & CODE',
    },
    indicators: [
      { id: 'ind-1', title: 'Unverifiable caller identity', description: 'Anyone can claim to work for a bank on an inbound call; the number is not independently confirmed.' },
      { id: 'ind-2', title: 'Request for secrets', description: 'No legitimate bank employee asks for your PIN or one-time verification code.' },
      { id: 'ind-3', title: 'Manufactured emergency', description: 'A "suspicious transfer" is used to justify an unusually urgent request.' },
      { id: 'ind-4', title: 'Pressure to stay on the line', description: 'The caller keeps you engaged so you don\'t pause to verify independently.' },
    ],
    options: [
      { id: 'opt-open', label: 'PROVIDE THE CODE', isCorrect: false },
      { id: 'opt-verify', label: 'HANG UP & VERIFY', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'A real fraud team will never ask for your PIN or a one-time code over the phone. The safest response is to end the call and independently contact your bank using a number you already trust, not one provided by the caller.',
    betterResponse:
      'STOP giving information. CHECK by hanging up. VERIFY using the number on your card or official app. REPORT the call to your bank and, if needed, authorities.',
    isActive: true,
  },
  {
    title: 'Advance Fee "Refund"',
    category: 'payment-fraud',
    difficulty: 'intermediate',
    format: 'MESSAGE',
    context:
      'A message arrives claiming you are owed a refund from a service you used months ago. It asks you to pay a small fee first to "release" the funds.',
    content: {
      sender: 'refunds@paylink-support.test',
      fromName: 'PayLink Refunds',
      fromEmail: 'refunds@paylink-support.test',
      to: 'you@company.example',
      sentAt: 'Tue 2:18 PM',
      subject: 'You have a pending refund of 4,200 ETB',
      body: 'Our records show a pending refund of 4,200 ETB on your account. To release the funds today, send a 150 ETB processing fee to the agent code below.',
      callToAction: 'SEND PROCESSING FEE',
    },
    indicators: [
      { id: 'ind-1', title: 'Pay to receive money', description: 'Legitimate refunds are never released by first sending the recipient money.' },
      { id: 'ind-2', title: 'Unfamiliar reference', description: 'There is no matching transaction you can independently recall or look up.' },
      { id: 'ind-3', title: 'Same-day pressure', description: '"Today" framing discourages you from checking your actual account history first.' },
      { id: 'ind-4', title: 'Informal payment channel', description: 'Requesting payment to an "agent code" bypasses normal, traceable payment channels.' },
    ],
    options: [
      { id: 'opt-open', label: 'SEND THE FEE', isCorrect: false },
      { id: 'opt-verify', label: 'VERIFY FIRST', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'Any request to pay money in order to receive money is a classic advance-fee fraud pattern. Verifying directly with the organization named — through official channels, not the contact info in the message — exposes the scam before any money moves.',
    betterResponse: 'STOP before paying. CHECK your real transaction history. VERIFY the refund with the official provider. REPORT the message as fraud.',
    isActive: true,
  },
  {
    title: 'The Forwarded Payment Screenshot',
    category: 'fake-evidence',
    difficulty: 'advanced',
    format: 'CHAT + IMAGE',
    context:
      "A buyer for an item you're selling online sends a screenshot that appears to show a completed bank transfer, then asks you to ship immediately.",
    content: {
      sender: 'Buyer (unknown contact)',
      subject: 'Payment sent — screenshot attached',
      body: 'Buyer: "Just sent the payment, here\'s the screenshot as proof. Please ship the item now, I\'m in a rush and need it before my flight."',
      meta: { attachment: 'transfer_receipt.png (unverified)' },
      callToAction: 'SHIP ITEM NOW',
    },
    indicators: [
      { id: 'ind-1', title: 'Screenshot as proof', description: 'Images of transfers can be easily edited and are not confirmation that funds arrived.' },
      { id: 'ind-2', title: 'No funds check', description: 'The request skips checking your actual account balance or transaction notification.' },
      { id: 'ind-3', title: 'Shipping urgency', description: 'A rushed deadline discourages you from waiting for the transfer to actually settle.' },
      { id: 'ind-4', title: 'New, unverified contact', description: 'There is no prior trusted relationship with this buyer to rely on.' },
    ],
    options: [
      { id: 'opt-open', label: 'SHIP IMMEDIATELY', isCorrect: false },
      { id: 'opt-verify', label: 'VERIFY IN YOUR ACCOUNT', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'A transfer screenshot alone proves nothing — only your own account activity confirms a payment actually cleared. Waiting to verify the real balance or notification protects you from shipping against a fabricated payment.',
    betterResponse:
      "STOP before shipping. CHECK your account directly, not the image. VERIFY the funds have actually settled. REPORT the buyer if the \"proof\" doesn't match reality.",
    isActive: true,
  },
  {
    title: 'The "IT Support" Message',
    category: 'social-engineering',
    difficulty: 'beginner',
    format: 'CHAT MESSAGE',
    context:
      "A message appears in your workplace chat from an account styled like your IT helpdesk, referencing a ticket you don't remember opening.",
    content: {
      sender: 'IT-Helpdesk (internal chat)',
      subject: 'Quick favor before I close your ticket',
      body: "Hi, this is IT support. We're finishing up a system migration and need your login one more time to confirm your account transferred correctly. Can you send your username and password so I can check?",
      callToAction: 'REPLY WITH CREDENTIALS',
    },
    indicators: [
      { id: 'ind-1', title: 'Direct credential request', description: 'No legitimate IT team needs your plaintext password to "check" anything.' },
      { id: 'ind-2', title: 'Manufactured familiarity', description: 'References to a "ticket" and "migration" create false context to seem routine.' },
      { id: 'ind-3', title: 'Framed as a small favor', description: 'Minimizing the request ("quick favor") lowers your guard.' },
      { id: 'ind-4', title: 'Unverified identity', description: "The display name is not confirmed against your organization's real directory." },
    ],
    options: [
      { id: 'opt-open', label: 'SEND CREDENTIALS', isCorrect: false },
      { id: 'opt-verify', label: 'VERIFY THROUGH IT', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'Social engineering relies on borrowed authority and small, "reasonable-sounding" asks. Verifying through a separate, known channel — like calling your real IT desk — breaks the impersonation immediately.',
    betterResponse:
      'STOP sharing credentials in chat. CHECK the sender against your real directory. VERIFY by contacting IT through a known channel. REPORT the message to security.',
    isActive: true,
  },
  ...extraScenarioSeedData,
];
