export interface DrillIndicator {
  id: string;
  title: string;
  description: string;
}

export interface DynamicDrill {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  format: 'DYNAMIC_WEBMAIL' | 'DYNAMIC_SMARTPHONE' | 'DYNAMIC_WALLET' | 'DYNAMIC_AUDIO' | 'DYNAMIC_OAUTH';
  subtitle: string;
  estimatedMinutes: number;
  description: string;
  serverEmailSupport: boolean;
  emailTemplate?: {
    fromName: string;
    fromEmail: string;
    subject: string;
    body: string;
    callToAction: string;
  };
  smsContent?: {
    senderDisplay: string;
    senderRaw: string;
    officialShortcode: string;
    message: string;
    linkUrl: string;
  };
  walletDetails?: {
    initialBalance: number;
    claimAmount: number;
    claimSender: string;
  };
  audioDetails?: {
    executiveName: string;
    wireAmount: string;
    duration: string;
  };
  oauthDetails?: {
    appName: string;
    publisher: string;
    verified: boolean;
    scopes: Array<{ name: string; risk: 'low' | 'medium' | 'critical'; description: string }>;
  };
  indicators: DrillIndicator[];
}

export const DYNAMIC_DRILLS: DynamicDrill[] = [
  {
    id: 'drill-bank-webmail',
    title: 'Menteko Bank Credential Harvester',
    category: 'phishing',
    difficulty: 'intermediate',
    format: 'DYNAMIC_WEBMAIL',
    subtitle: 'Interactive Webmail & Fake Login Portal Drill',
    estimatedMinutes: 3,
    description:
      'Experience an authentic multi-stage credential harvesting drill. Inspect incoming webmail headers, examine deceptive links, and explore a live fake banking portal with real-time telemetry.',
    serverEmailSupport: true,
    emailTemplate: {
      fromName: 'Menteko Bank Security Alerts',
      fromEmail: 'security-drill@savethegeneration.com.et',
      subject: 'Action Required: Verify your Menteko Bank credentials within 24 hours',
      body: `Dear Account Holder,

Our automated security monitors detected an unauthorized sign-in attempt from an unrecognized IP address in Frankfurt, Germany.

To ensure uninterrupted access to your online banking and prevent automatic account suspension, you must verify your identity immediately.

If you do not complete verification within 24 hours, your online access will be locked.

Sincerely,
Menteko Bank Security Team`,
      callToAction: 'Verify Online Banking Credentials',
    },
    indicators: [
      {
        id: 'ind-1',
        title: 'Artificial Urgency & Fear Appeal',
        description: 'Uses a 24-hour deadline and threat of account suspension to induce panic and bypass logical scrutiny.',
      },
      {
        id: 'ind-2',
        title: 'Deceptive URL / Lookalike Domain',
        description: "Link text says 'mentekobank.com' but destination resolves to 'secure.menteko.local' or external server.",
      },
      {
        id: 'ind-3',
        title: 'Credential Harvesting Objective',
        description: 'Legitimate banks never send unprompted emails requesting password or credential re-entry.',
      },
    ],
  },
  {
    id: 'drill-cbe-birr',
    title: 'Commercial Bank of Ethiopia (CBE Birr) Smishing',
    category: 'smishing',
    difficulty: 'beginner',
    format: 'DYNAMIC_SMARTPHONE',
    subtitle: 'Interactive Smartphone Screen & Helpline 951 Dialing',
    estimatedMinutes: 4,
    description:
      'Interact with a simulated smartphone receiving an urgent CBE Birr KYC lockout alert. Inspect the incoming shortcode, test the fake KYC form, and dial the official 951 helpline simulator.',
    serverEmailSupport: true,
    emailTemplate: {
      fromName: 'CBE Birr Security Support',
      fromEmail: 'security-alerts@savethegeneration.com.et',
      subject: 'Urgent Alert: Your CBE Birr Mobile Account is Temporarily Suspended',
      body: `Dear CBE Customer,

Our system detected an incomplete KYC verification status on your CBE Birr mobile banking account.

To prevent immediate restriction of incoming and outgoing fund transfers, please verify your customer identity profile immediately using the link below.

Failure to verify within 2 hours will result in automatic service termination.

Commercial Bank of Ethiopia Security Operations`,
      callToAction: 'Verify CBE Birr Profile Now',
    },
    smsContent: {
      senderDisplay: 'CBE-Birr',
      senderRaw: '+251911448821',
      officialShortcode: '8951',
      message:
        'CBE Birr Alert: Your mobile banking account is temporarily suspended due to unverified KYC information. Update immediately at https://cbebirr-verify.com/login or all funds will be locked within 2 hours.',
      linkUrl: 'https://cbebirr-verify.com/login',
    },
    indicators: [
      {
        id: 'ind-cbe-1',
        title: 'Spoofed Sender Name vs Raw Number',
        description:
          'Header claims to be CBE-Birr, but inspecting the origin reveals a standard 10-digit mobile number (+251911448821) instead of official 8951.',
      },
      {
        id: 'ind-cbe-2',
        title: 'Unregistered Domain',
        description: "Official CBE website is 'combanketh.et', whereas the link directs to third-party 'cbebirr-verify.com'.",
      },
      {
        id: 'ind-cbe-3',
        title: 'Strict 2-Hour Lockout Window',
        description: 'Aggressive pressure tactic designed to force action before contacting bank support.',
      },
    ],
  },
  {
    id: 'drill-telebirr-fraud',
    title: 'Telebirr Erroneous Transfer Refund Scam',
    category: 'payment-fraud',
    difficulty: 'intermediate',
    format: 'DYNAMIC_WALLET',
    subtitle: 'Interactive Wallet UI & Official Ledger Verification',
    estimatedMinutes: 3,
    description:
      'A stranger sends a fake SMS screenshot claiming they mistakenly transferred 500 ETB to your phone and urgently needs a refund for hospital bills. Verify the live transaction ledger before deciding.',
    serverEmailSupport: true,
    emailTemplate: {
      fromName: 'Telebirr Dispute Center',
      fromEmail: 'drills@savethegeneration.com.et',
      subject: 'Dispute Notice: Erroneous Transfer Claim Ref #ETB-89104',
      body: `Dear Telebirr Customer,

A payment dispute has been filed regarding a recent mobile transfer of 500.00 ETB to your account. The sender claims this transaction was sent in error and has requested an immediate reversal.

Please inspect your active account ledger and review the claim details below:

Telebirr Customer Protection Department`,
      callToAction: 'Review Disputed Transaction Ledger',
    },
    walletDetails: {
      initialBalance: 4850.0,
      claimAmount: 500.0,
      claimSender: '0922-441199',
    },
    indicators: [
      {
        id: 'ind-tb-1',
        title: 'Forged SMS Screenshot',
        description:
          'Fraudsters send screenshots fabricated with apps or edited text to make victims believe funds arrived without checking their actual wallet balance.',
      },
      {
        id: 'ind-tb-2',
        title: 'Ledger Mismatch',
        description: 'Checking the official Telebirr statement reveals no incoming transaction or credit reference number.',
      },
      {
        id: 'ind-tb-3',
        title: 'Circumventing Official Reversal',
        description:
          'Legitimate erroneous transfers must be reported to Ethio Telecom (127) for verified bank reversal, never refunded manually via personal balance.',
      },
    ],
  },
  {
    id: 'drill-deepfake-audio',
    title: 'Executive AI Deepfake Voice Memo Wire Drill',
    category: 'ai-deepfake',
    difficulty: 'advanced',
    format: 'DYNAMIC_AUDIO',
    subtitle: 'Live Audio Waveform Analyzer & Out-of-Band Verification',
    estimatedMinutes: 5,
    description:
      'Listen to an urgent voice memo purportedly sent by your CEO requesting an immediate emergency wire transfer to an offshore supplier. Use forensic audio analysis tools to uncover synthetic artifacts.',
    serverEmailSupport: true,
    emailTemplate: {
      fromName: 'Office of the Managing Director',
      fromEmail: 'admin@savethegeneration.com.et',
      subject: 'Urgent Directive: Confidential Voice Authorization Memo',
      body: `Dear Finance Operations Team,

Dr. Dawit has forwarded an urgent audio directive regarding an emergency offshore supplier disbursement (150,000 ETB) required before his flight departs.

Please listen to the voice memo immediately and verify payment instructions:

Office of the Managing Director`,
      callToAction: 'Listen to Executive Audio Memo',
    },
    audioDetails: {
      executiveName: 'Dr. Dawit (Managing Director)',
      wireAmount: '150,000 ETB ($1,250 USD)',
      duration: '0:24',
    },
    indicators: [
      {
        id: 'ind-ai-1',
        title: 'Synthetic Audio Artifacts',
        description:
          'Robotic speech cadence, absence of room reverb, and unnatural breathing intervals indicative of AI voice cloning models.',
      },
      {
        id: 'ind-ai-2',
        title: 'Executive Bypass of Procurement Controls',
        description:
          "Claiming to be 'boarding an international flight' to excuse bypassing normal dual-authorization wire approval.",
      },
      {
        id: 'ind-ai-3',
        title: 'Out-of-Band Verification',
        description:
          'Calling the executive’s known office number or verified assistant confirms no wire transfer was ever requested.',
      },
    ],
  },
  {
    id: 'drill-m365-oauth',
    title: 'Microsoft 365 Illicit Consent Grant Drill',
    category: 'oauth-phishing',
    difficulty: 'advanced',
    format: 'DYNAMIC_OAUTH',
    subtitle: 'Interactive Cloud Permission Scope & Publisher Risk Inspector',
    estimatedMinutes: 4,
    description:
      'Inspect a deceptive collaboration invite linking to an enterprise file viewer. Examine the OAuth 2.0 permission prompt to detect excessive permissions (Mail.ReadWrite, Files.ReadWrite) and unverified tenant status.',
    serverEmailSupport: true,
    emailTemplate: {
      fromName: 'HR Document Portal',
      fromEmail: 'security-drill@savethegeneration.com.et',
      subject: 'Shared with you: Q4 Salary Review and Performance Matrix.xlsx',
      body: `Hello,

The HR Compensation Committee has shared 'Q4 Salary Review and Performance Matrix.xlsx' with your account via Microsoft SharePoint.

Please review your updated grade and compensation changes using the link below:

Menteko Enterprise Secure Collaboration`,
      callToAction: 'Review Document in Cloud Viewer',
    },
    oauthDetails: {
      appName: 'Enterprise Cloud DocViewer v4.2',
      publisher: 'Unverified Publisher (Registered 2 days ago)',
      verified: false,
      scopes: [
        {
          name: 'Mail.ReadWrite',
          risk: 'critical',
          description: 'Allows the application to read, draft, and delete all user emails without further passwords.',
        },
        {
          name: 'Files.ReadWrite.All',
          risk: 'critical',
          description: 'Gives full access to view, edit, and exfiltrate all OneDrive and corporate SharePoint files.',
        },
        {
          name: 'offline_access',
          risk: 'critical',
          description: 'Maintains perpetual background access even if the user changes their password.',
        },
        {
          name: 'User.Read',
          risk: 'low',
          description: 'Sign in and read basic user profile information.',
        },
      ],
    },
    indicators: [
      {
        id: 'ind-oauth-1',
        title: 'Excessive API Scopes',
        description:
          "A simple spreadsheet viewer should not require 'Mail.ReadWrite' (access to all emails) or 'offline_access' (perpetual background token).",
      },
      {
        id: 'ind-oauth-2',
        title: 'Unverified App Publisher',
        description:
          'Microsoft displays a warning badge indicating the application publisher is unverified and created within the last 72 hours.',
      },
      {
        id: 'ind-oauth-3',
        title: 'Password-Less Persistent Compromise',
        description:
          'Illicit consent bypasses MFA and password resets because the attacker holds a valid OAuth refresh token granted directly by the user.',
      },
    ],
  },
];

export function getDrillById(id: string): DynamicDrill | undefined {
  return DYNAMIC_DRILLS.find((d) => d.id === id);
}
