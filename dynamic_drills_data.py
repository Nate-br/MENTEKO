"""
Dynamic Interactive Cyber Drills for MENTEKO.
Server-integrated simulations with real email dispatch, live telemetry,
interactive smartphone/wallet/voice environments, and teachable moments.
"""

DYNAMIC_DRILLS = [
    {
        "id": "drill-bank-webmail",
        "title": "Menteko Bank Credential Harvester",
        "category": "phishing",
        "difficulty": "intermediate",
        "format": "DYNAMIC_WEBMAIL",
        "subtitle": "Interactive Webmail & Fake Login Portal Drill",
        "estimatedMinutes": 3,
        "description": "Experience an authentic multi-stage credential harvesting drill. Inspect incoming webmail headers, examine deceptive links, and explore a live fake banking portal with real-time feedback.",
        "serverEmailSupport": True,
        "emailTemplate": {
            "fromName": "Menteko Bank Security Alerts",
            "fromEmail": "security-drill@savethegeneration.com.et",
            "subject": "Action Required: Verify your Menteko Bank credentials within 24 hours",
            "body": "Dear Account Holder,\n\nOur automated security monitors detected an unauthorized sign-in attempt from an unrecognized IP address in Frankfurt, Germany.\n\nTo ensure uninterrupted access to your online banking and prevent automatic account suspension, you must verify your identity immediately.\n\nPlease click the secure link below to confirm your active credentials:\n\nIf you do not complete verification within 24 hours, your online access will be locked.\n\nSincerely,\nMenteko Bank Security Team",
            "callToAction": "Verify Online Banking Credentials"
        },
        "indicators": [
            {
                "id": "ind-1",
                "title": "Artificial Urgency & Fear Appeal",
                "description": "Uses a 24-hour deadline and threat of account suspension to induce panic and bypass logical scrutiny."
            },
            {
                "id": "ind-2",
                "title": "Deceptive URL / Lookalike Domain",
                "description": "Link text says 'mentekobank.com' but destination resolves to 'secure.menteko.local' or external server."
            },
            {
                "id": "ind-3",
                "title": "Credential Harvesting Objective",
                "description": "Legitimate banks never send unprompted emails requesting password or credential re-entry."
            }
        ]
    },
    {
        "id": "drill-cbe-birr",
        "title": "Commercial Bank of Ethiopia (CBE Birr) Smishing",
        "category": "smishing",
        "difficulty": "beginner",
        "format": "DYNAMIC_SMARTPHONE",
        "subtitle": "Interactive Smartphone Screen & Helpline 951 Dialing",
        "estimatedMinutes": 4,
        "description": "Interact with a simulated smartphone receiving an urgent CBE Birr KYC lockout alert. Inspect the incoming shortcode, test the fake KYC form, and dial the official 951 helpline simulator.",
        "serverEmailSupport": True,
        "emailTemplate": {
            "fromName": "CBE Birr Security Support",
            "fromEmail": "security-alerts@savethegeneration.com.et",
            "subject": "Urgent Alert: Your CBE Birr Mobile Account is Temporarily Suspended",
            "body": "Dear CBE Customer,\n\nOur system detected an incomplete KYC verification status on your CBE Birr mobile banking account.\n\nTo prevent immediate restriction of incoming and outgoing fund transfers, please verify your customer identity profile immediately using the link below.\n\nFailure to verify within 2 hours will result in automatic service termination.\n\nCommercial Bank of Ethiopia Security Operations",
            "callToAction": "Verify CBE Birr Profile Now"
        },
        "smsContent": {
            "senderDisplay": "CBE-Birr",
            "senderRaw": "+251911448821",
            "officialShortcode": "8951",
            "message": "CBE Birr Alert: Your mobile banking account is temporarily suspended due to unverified KYC information. Update immediately at https://cbebirr-verify.com/login or all funds will be locked within 2 hours.",
            "linkUrl": "https://cbebirr-verify.com/login"
        },
        "indicators": [
            {
                "id": "ind-cbe-1",
                "title": "Spoofed Sender Name vs Raw Number",
                "description": "Header claims to be CBE-Birr, but inspecting the origin reveals a standard 10-digit mobile number (+251911448821) instead of official 8951."
            },
            {
                "id": "ind-cbe-2",
                "title": "Unregistered Domain",
                "description": "Official CBE website is 'combanketh.et', whereas the link directs to third-party 'cbebirr-verify.com'."
            },
            {
                "id": "ind-cbe-3",
                "title": "Strict 2-Hour Lockout Window",
                "description": "Aggressive pressure tactic designed to force action before contacting bank support."
            }
        ]
    },
    {
        "id": "drill-telebirr-fraud",
        "title": "Telebirr Erroneous Transfer Refund Scam",
        "category": "payment-fraud",
        "difficulty": "intermediate",
        "format": "DYNAMIC_WALLET",
        "subtitle": "Interactive Wallet UI & Official Ledger Verification",
        "estimatedMinutes": 3,
        "description": "A stranger sends a fake SMS screenshot claiming they mistakenly transferred 500 ETB to your phone and urgently needs a refund for hospital bills. Verify the live transaction ledger before deciding.",
        "serverEmailSupport": True,
        "emailTemplate": {
            "fromName": "Telebirr Dispute Center",
            "fromEmail": "drills@savethegeneration.com.et",
            "subject": "Dispute Notice: Erroneous Transfer Claim Ref #ETB-89104",
            "body": "Dear Telebirr Customer,\n\nA payment dispute has been filed regarding a recent mobile transfer of 500.00 ETB to your account. The sender claims this transaction was sent in error and has requested an immediate reversal.\n\nPlease inspect your active account ledger and review the claim details below:\n\nTelebirr Customer Protection Department",
            "callToAction": "Review Disputed Transaction Ledger"
        },
        "walletInitialBalance": 4850.00,
        "fraudClaimAmount": 500.00,
        "claimSender": "0922-441199",
        "indicators": [
            {
                "id": "ind-tb-1",
                "title": "Forged SMS Screenshot",
                "description": "Fraudsters send screenshots fabricated with apps or edited text to make victims believe funds arrived without checking their actual wallet balance."
            },
            {
                "id": "ind-tb-2",
                "title": "Ledger Mismatch",
                "description": "Checking the official Telebirr statement reveals no incoming transaction or credit reference number."
            },
            {
                "id": "ind-tb-3",
                "title": "Circumventing Official Reversal",
                "description": "Legitimate erroneous transfers must be reported to Ethio Telecom (127) for verified bank reversal, never refunded manually via personal balance."
            }
        ]
    },
    {
        "id": "drill-deepfake-audio",
        "title": "Executive AI Deepfake Voice Memo Wire Drill",
        "category": "ai-deepfake",
        "difficulty": "advanced",
        "format": "DYNAMIC_AUDIO",
        "subtitle": "Live Audio Waveform Analyzer & Out-of-Band Verification",
        "estimatedMinutes": 5,
        "description": "Listen to an urgent voice memo purportedly sent by your CEO requesting an immediate emergency wire transfer to an offshore supplier. Use forensic audio analysis tools to uncover synthetic artifacts.",
        "serverEmailSupport": True,
        "emailTemplate": {
            "fromName": "Office of the Managing Director",
            "fromEmail": "admin@savethegeneration.com.et",
            "subject": "Urgent Directive: Confidential Voice Authorization Memo",
            "body": "Dear Finance Operations Team,\n\nDr. Dawit has forwarded an urgent audio directive regarding an emergency offshore supplier disbursement (150,000 ETB) required before his flight departs.\n\nPlease listen to the voice memo immediately and verify payment instructions:\n\nOffice of the Managing Director",
            "callToAction": "Listen to Executive Audio Memo"
        },
        "memoDuration": "0:24",
        "executiveName": "Dr. Dawit (Managing Director)",
        "wireAmount": "150,000 ETB ($1,250 USD)",
        "indicators": [
            {
                "id": "ind-ai-1",
                "title": "Synthetic Audio Artifacts",
                "description": "Robotic speech cadence, absence of room reverb, and unnatural breathing intervals indicative of AI voice cloning models."
            },
            {
                "id": "ind-ai-2",
                "title": "Executive Bypass of Procurement Controls",
                "description": "Claiming to be 'boarding an international flight' to excuse bypassing normal dual-authorization wire approval."
            },
            {
                "id": "ind-ai-3",
                "title": "Out-of-Band Failure",
                "description": "Calling the executive's known landline or verified personal secretary reveals they are in the office with no pending wire."
            }
        ]
    },
    {
        "id": "drill-m365-oauth",
        "title": "Microsoft 365 Illicit Consent Grant Drill",
        "category": "oauth-phishing",
        "difficulty": "advanced",
        "format": "DYNAMIC_OAUTH",
        "subtitle": "Interactive Cloud Permission Scope & Publisher Risk Inspector",
        "estimatedMinutes": 4,
        "description": "Inspect a deceptive collaboration invite linking to an enterprise file viewer. Examine the OAuth 2.0 permission prompt to detect excessive permissions (Mail.ReadWrite, Files.ReadWrite) and unverified tenant status.",
        "serverEmailSupport": True,
        "emailTemplate": {
            "fromName": "HR Document Portal",
            "fromEmail": "security-drill@savethegeneration.com.et",
            "subject": "Shared with you: Q4 Salary Review and Performance Matrix.xlsx",
            "body": "Hello,\n\nThe HR Compensation Committee has shared 'Q4 Salary Review and Performance Matrix.xlsx' with your account via Microsoft SharePoint.\n\nPlease review your updated grade and compensation changes using the link below:\n\nReview Document in Cloud Viewer\n\nMenteko Enterprise Secure Collaboration",
            "callToAction": "Review Document in Cloud Viewer"
        },
        "indicators": [
            {
                "id": "ind-oauth-1",
                "title": "Excessive API Scopes",
                "description": "A simple spreadsheet viewer should not require 'Mail.ReadWrite' (access to all emails) or 'offline_access' (perpetual background token)."
            },
            {
                "id": "ind-oauth-2",
                "title": "Unverified App Publisher",
                "description": "Microsoft displays a warning badge indicating the application publisher is unverified and created within the last 72 hours."
            },
            {
                "id": "ind-oauth-3",
                "title": "Password-Less Persistent Compromise",
                "description": "Illicit consent bypasses MFA and password resets because the attacker holds a valid OAuth refresh token granted directly by the user."
            }
        ]
    }
]
