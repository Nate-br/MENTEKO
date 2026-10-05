import type { Scenario } from '@/types';
import { extraScenarios } from './extraScenarios';

/**
 * Local seed data. Mirrors the shape returned by GET /api/scenarios so the
 * Simulate flow works identically before and after the backend is wired up.
 * All senders, names, amounts and references below are fictional.
 */
const baseScenarios: Scenario[] = [
  {
    _id: 'seed-phishing-01',
    title: 'Urgent Account Verification',
    category: 'phishing',
    difficulty: 'beginner',
    format: 'MESSAGE',
    context:
      'You receive an email while checking your inbox on a weekday morning. Nothing else in your account activity looks unusual.',
    content: {
      sender: 'security-alert@meskelbank-verify.test',
      subject: 'Urgent: Account Verification Required',
      body: 'Your account requires verification. We detected unusual sign-in activity. Verify immediately to avoid restrictions on your account within 24 hours.',
      callToAction: 'VERIFY ACCOUNT',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Urgency',
        description: 'The message pressures you to act within a strict, short deadline.',
      },
      {
        id: 'ind-2',
        title: 'Suspicious sender',
        description: 'The domain "meskelbank-verify.test" mimics a bank but is not the official domain.',
      },
      {
        id: 'ind-3',
        title: 'External action',
        description: 'The button pushes you toward an unverified link instead of your normal banking app.',
      },
      {
        id: 'ind-4',
        title: 'Threat language',
        description: 'The message threatens "restrictions" to create fear and rush your decision.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'OPEN / CONTINUE', isCorrect: false },
      { id: 'opt-verify', label: 'VERIFY FIRST', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'This message uses urgency and a lookalike domain to rush you into clicking before you think. Verifying first — by checking the sender domain and contacting the organization through a known, separate channel — neutralizes the pressure.',
    betterResponse: 'STOP before clicking. CHECK the sender domain. VERIFY through the official app or a known phone number. REPORT the message if it looks fraudulent.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'seed-impersonation-01',
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
      {
        id: 'ind-1',
        title: 'Unverifiable caller identity',
        description: 'Anyone can claim to work for a bank on an inbound call; the number is not independently confirmed.',
      },
      {
        id: 'ind-2',
        title: 'Request for secrets',
        description: 'No legitimate bank employee asks for your PIN or one-time verification code.',
      },
      {
        id: 'ind-3',
        title: 'Manufactured emergency',
        description: 'A "suspicious transfer" is used to justify an unusually urgent request.',
      },
      {
        id: 'ind-4',
        title: 'Pressure to stay on the line',
        description: 'The caller keeps you engaged so you don\'t pause to verify independently.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'PROVIDE THE CODE', isCorrect: false },
      { id: 'opt-verify', label: 'HANG UP & VERIFY', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'A real fraud team will never ask for your PIN or a one-time code over the phone. The safest response is to end the call and independently contact your bank using a number you already trust, not one provided by the caller.',
    betterResponse: 'STOP giving information. CHECK by hanging up. VERIFY using the number on your card or official app. REPORT the call to your bank and, if needed, authorities.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'seed-payment-fraud-01',
    title: 'Advance Fee "Refund"',
    category: 'payment-fraud',
    difficulty: 'intermediate',
    format: 'MESSAGE',
    context:
      'A message arrives claiming you are owed a refund from a service you used months ago. It asks you to pay a small fee first to "release" the funds.',
    content: {
      sender: 'refunds@paylink-support.test',
      subject: 'You have a pending refund of 4,200 ETB',
      body: 'Our records show a pending refund of 4,200 ETB on your account. To release the funds today, send a 150 ETB processing fee to the agent code below.',
      callToAction: 'SEND PROCESSING FEE',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Pay to receive money',
        description: 'Legitimate refunds are never released by first sending the recipient money.',
      },
      {
        id: 'ind-2',
        title: 'Unfamiliar reference',
        description: 'There is no matching transaction you can independently recall or look up.',
      },
      {
        id: 'ind-3',
        title: 'Same-day pressure',
        description: '"Today" framing discourages you from checking your actual account history first.',
      },
      {
        id: 'ind-4',
        title: 'Informal payment channel',
        description: 'Requesting payment to an "agent code" bypasses normal, traceable payment channels.',
      },
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
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'seed-fake-evidence-01',
    title: 'The Forwarded Payment Screenshot',
    category: 'fake-evidence',
    difficulty: 'advanced',
    format: 'CHAT + IMAGE',
    context:
      'A buyer for an item you\'re selling online sends a screenshot that appears to show a completed bank transfer, then asks you to ship immediately.',
    content: {
      sender: 'Buyer (unknown contact)',
      subject: 'Payment sent — screenshot attached',
      body: 'Buyer: "Just sent the payment, here\'s the screenshot as proof. Please ship the item now, I\'m in a rush and need it before my flight."',
      meta: { attachment: 'transfer_receipt.png (unverified)' },
      callToAction: 'SHIP ITEM NOW',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Screenshot as proof',
        description: 'Images of transfers can be easily edited and are not confirmation that funds arrived.',
      },
      {
        id: 'ind-2',
        title: 'No funds check',
        description: 'The request skips checking your actual account balance or transaction notification.',
      },
      {
        id: 'ind-3',
        title: 'Shipping urgency',
        description: 'A rushed deadline discourages you from waiting for the transfer to actually settle.',
      },
      {
        id: 'ind-4',
        title: 'New, unverified contact',
        description: 'There is no prior trusted relationship with this buyer to rely on.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'SHIP IMMEDIATELY', isCorrect: false },
      { id: 'opt-verify', label: 'VERIFY IN YOUR ACCOUNT', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'A transfer screenshot alone proves nothing — only your own account activity confirms a payment actually cleared. Waiting to verify the real balance or notification protects you from shipping against a fabricated payment.',
    betterResponse: 'STOP before shipping. CHECK your account directly, not the image. VERIFY the funds have actually settled. REPORT the buyer if the "proof" doesn\'t match reality.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'seed-social-engineering-01',
    title: 'The "IT Support" Message',
    category: 'social-engineering',
    difficulty: 'beginner',
    format: 'CHAT MESSAGE',
    content: {
      sender: 'IT-Helpdesk (internal chat)',
      subject: 'Quick favor before I close your ticket',
      body: 'Hi, this is IT support. We\'re finishing up a system migration and need your login one more time to confirm your account transferred correctly. Can you send your username and password so I can check?',
      callToAction: 'REPLY WITH CREDENTIALS',
    },
    context:
      'A message appears in your workplace chat from an account styled like your IT helpdesk, referencing a ticket you don\'t remember opening.',
    indicators: [
      {
        id: 'ind-1',
        title: 'Direct credential request',
        description: 'No legitimate IT team needs your plaintext password to "check" anything.',
      },
      {
        id: 'ind-2',
        title: 'Manufactured familiarity',
        description: 'References to a "ticket" and "migration" create false context to seem routine.',
      },
      {
        id: 'ind-3',
        title: 'Framed as a small favor',
        description: 'Minimizing the request ("quick favor") lowers your guard.',
      },
      {
        id: 'ind-4',
        title: 'Unverified identity',
        description: 'The display name is not confirmed against your organization\'s real directory.',
      },
    ],
    options: [
      { id: 'opt-open', label: 'SEND CREDENTIALS', isCorrect: false },
      { id: 'opt-verify', label: 'VERIFY THROUGH IT', isCorrect: true },
      { id: 'opt-report', label: 'REPORT', isCorrect: false },
    ],
    explanation:
      'Social engineering relies on borrowed authority and small, "reasonable-sounding" asks. Verifying through a separate, known channel — like calling your real IT desk — breaks the impersonation immediately.',
    betterResponse: 'STOP sharing credentials in chat. CHECK the sender against your real directory. VERIFY by contacting IT through a known channel. REPORT the message to security.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const scenarios: Scenario[] = [...baseScenarios, ...extraScenarios];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s._id === id);
}
