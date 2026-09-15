import type { LearnTopic } from '@/types';

export const learnTopics: LearnTopic[] = [
  {
    id: 'phishing',
    title: 'Phishing',
    category: 'phishing',
    definition:
      'Fake messages — email, SMS, or chat — engineered to make you click a link, disclose information, or authenticate on a fraudulent page.',
    warningSigns: [
      'Urgent deadlines or threats of restriction',
      'Sender domain that looks close but isn\'t exact',
      'Generic greetings instead of your real name',
      'A link that doesn\'t match the visible text',
    ],
    example:
      'An email claiming your account will be suspended unless you "verify" within 24 hours, linking to a lookalike login page.',
    saferBehavior:
      'Never click links in unexpected messages. Go to the service directly through a saved bookmark or official app instead.',
  },
  {
    id: 'impersonation',
    title: 'Impersonation',
    category: 'impersonation',
    definition:
      'Attackers pose as a trusted person or organization — a bank officer, coworker, or official body — to gain your trust and extract information or action.',
    warningSigns: [
      'Contact from an unfamiliar number or account claiming authority',
      'Requests for PINs, passwords, or one-time codes',
      'Inconsistent details compared to past interactions',
      'Pressure to keep the conversation going without pausing',
    ],
    example:
      'A caller claiming to be from your bank\'s fraud team asks you to confirm your card PIN to "stop" a transaction.',
    saferBehavior:
      'Hang up or step away, then contact the organization using a number or channel you already know is real.',
  },
  {
    id: 'payment-fraud',
    title: 'Payment Fraud',
    category: 'payment-fraud',
    definition:
      'Schemes that manipulate you into sending money — fake refunds, fake invoices, or requests disguised as legitimate transactions.',
    warningSigns: [
      'Any request to pay a fee before receiving money',
      'Unfamiliar transaction references you can\'t verify',
      'Requests routed through informal or untraceable channels',
      'Same-day urgency attached to a payment request',
    ],
    example:
      'A message says you\'re owed a refund, but you must first send a small "processing fee" to release it.',
    saferBehavior:
      'Check your real account history first. Legitimate refunds never require you to pay to receive them.',
  },
  {
    id: 'fake-evidence',
    title: 'Fake Transaction Evidence',
    category: 'fake-evidence',
    definition:
      'Fabricated or edited proof — screenshots, receipts, or confirmation messages — used to convince you a payment was made when it wasn\'t.',
    warningSigns: [
      'Proof arrives as an image rather than an account notification',
      'Urgency to act (ship, release, unlock) before you can verify',
      'No corresponding entry in your own account or app',
      'Contact is new or unverified',
    ],
    example:
      'A buyer sends a screenshot of a "completed transfer" and asks you to ship an item immediately.',
    saferBehavior:
      'Only trust confirmation from your own account or banking app — never an image sent by the other party.',
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering',
    category: 'social-engineering',
    definition:
      'The psychological manipulation behind most fraud — using authority, urgency, familiarity, or fear to override your normal caution.',
    warningSigns: [
      'Requests framed as routine or a "small favor"',
      'Borrowed authority (IT, HR, management, government)',
      'Emotional pressure — fear, urgency, or flattery',
      'Discouragement from checking with anyone else',
    ],
    example:
      'A message styled as internal IT support asks for your login "to confirm a migration went through."',
    saferBehavior:
      'Slow down. Verify identity and intent through a separate, known channel before acting on any request.',
  },
];
