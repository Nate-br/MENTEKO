"""
New Interactive Awareness Scenarios for MENTEKO.
Preserves the original 15 scenarios while adding interactive webmail, credential harvesting drills,
and modern African / enterprise fraud simulations.
"""

INTERACTIVE_SCENARIOS = [
    {
        "id": "sim-interactive-menteko-01",
        "title": "Menteko Bank — Account Verification Drill",
        "category": "phishing",
        "difficulty": "beginner",
        "format": "EMAIL",
        "context": "You are an employee checking work email on a weekday morning. This message appears in your inbox. Menteko Bank is a fictional organization used only for this authorized awareness exercise.",
        "content": {
            "sender": "Menteko Bank Security <alerts@secure.menteko.local>",
            "fromName": "Menteko Bank Security",
            "fromEmail": "alerts@secure.menteko.local",
            "to": "you@company.example",
            "sentAt": "Mon 8:42 AM",
            "subject": "Action required: verify your Menteko Bank account within 24 hours",
            "body": "Dear customer,\n\nOur systems flagged unusual sign-in activity on your Menteko Bank account. To keep your account active, please verify your identity today.\n\nIf you do not complete verification within 24 hours, online access may be temporarily restricted.\n\nThank you,\nMenteko Bank Customer Security",
            "callToAction": "Verify account now",
            "linkDisplay": "https://www.mentekobank.example/verify",
            "linkActual": "https://secure.menteko.local/account/verify?id=trn-8841",
            "meta": {
                "simulationModule": "menteko-bank-phishing",
                "organization": "Menteko Bank (fictional — training only)",
                "interactive": "true"
            }
        },
        "indicators": [
            {
                "id": "ind-1",
                "title": "Artificial Urgency",
                "description": "The message uses a strict 24-hour deadline to rush you into acting before verifying the source."
            },
            {
                "id": "ind-2",
                "title": "Unexpected Verification Request",
                "description": "Legitimate institutions do not send unprompted security verification links via email."
            },
            {
                "id": "ind-3",
                "title": "Mismatched Destination URL",
                "description": "Hovering reveals the real link leads to secure.menteko.local instead of the legitimate bank website."
            },
            {
                "id": "ind-4",
                "title": "Credential Harvesting Risk",
                "description": "The link leads to an external login portal designed to collect usernames and passwords."
            }
        ],
        "options": [
            {
                "id": "opt-report",
                "label": "Report to Security Team",
                "isCorrect": True,
                "outcomeNote": "Excellent! Reporting helps your security team protect others and confirms you recognized the attack pattern."
            },
            {
                "id": "opt-ignore",
                "label": "Ignore and delete message",
                "isCorrect": True,
                "outcomeNote": "Ignoring protects your credentials, but reporting is preferred so security teams can block the sender."
            },
            {
                "id": "opt-click-link",
                "label": "Click the verification link",
                "isCorrect": False,
                "outcomeNote": "Following the link would have led you to a fake credential harvester designed to steal login information."
            },
            {
                "id": "opt-reply",
                "label": "Reply asking for clarification",
                "isCorrect": False,
                "outcomeNote": "Replying confirms your email address is active and invites further targeted manipulation."
            }
        ],
        "explanation": "This was a controlled phishing simulation. The message combined artificial urgency, fear of account restrictions, and an unverified domain link. In real attacks, never use email links to access financial accounts.",
        "betterResponse": "STOP — do not act immediately. CHECK the sender and link destination. VERIFY using an independent channel (official app or known customer service number). REPORT the message to security.",
        "isActive": 1
    },
    {
        "id": "sim-interactive-cbe-01",
        "title": "Commercial Bank of Ethiopia — Mobile Banking Suspension Notice",
        "category": "phishing",
        "difficulty": "intermediate",
        "format": "EMAIL",
        "context": "A notification arrives formatted with Commercial Bank of Ethiopia (CBE) branding warning that your mobile banking and ATM card privileges will be frozen unless re-verified immediately.",
        "content": {
            "sender": "CBE Customer Security <alerts@cbe-notification-service.com>",
            "fromName": "CBE Security Team",
            "fromEmail": "alerts@cbe-notification-service.com",
            "to": "customer@ethio.mail",
            "sentAt": "Today 10:15 AM",
            "subject": "Urgent: CBE Mobile Banking Deactivation Notice",
            "body": "Dear Esteemed Customer,\n\nDue to the ongoing digital banking security upgrade, all CBE Mobile Banking and CBE Birr users must re-verify their registered account profile.\n\nFailure to verify within 12 hours will result in automatic freeze of transactions and ATM card privileges.\n\nCommercial Bank of Ethiopia — Always the Reliable Bank.",
            "callToAction": "Verify CBE Account Now",
            "linkDisplay": "https://www.combanketh.et/verify-profile",
            "linkActual": "https://cbe-ethiopia-auth.account-update.cc/verify",
            "meta": {
                "simulationModule": "menteko-bank-phishing",
                "organization": "Commercial Bank of Ethiopia (Simulated Training Drill)",
                "interactive": "true"
            }
        },
        "indicators": [
            {
                "id": "ind-1",
                "title": "Lookalike Domain",
                "description": "The sender uses cbe-notification-service.com and links to account-update.cc instead of official combanketh.et."
            },
            {
                "id": "ind-2",
                "title": "Account Suspension Threat",
                "description": "Threatening to freeze ATM cards and transactions is a classic coercion tactic to bypass rational skepticism."
            },
            {
                "id": "ind-3",
                "title": "Unrealistic 12-Hour Deadline",
                "description": "Banks provide months of notice through official public media, never sudden 12-hour email ultimatums."
            },
            {
                "id": "ind-4",
                "title": "External Credential Form",
                "description": "Official CBE services only authenticate through the official CBE mobile app or official branches."
            }
        ],
        "options": [
            {
                "id": "opt-report",
                "label": "Report to Bank / Security (Call 951)",
                "isCorrect": True,
                "outcomeNote": "Spot on! Calling official CBE helpline (951) or reporting the phishing email immediately exposes the fraud."
            },
            {
                "id": "opt-ignore",
                "label": "Delete the email and ignore",
                "isCorrect": True,
                "outcomeNote": "Deleting prevents compromise, but alerting others or customer care prevents colleagues from falling victim."
            },
            {
                "id": "opt-click-link",
                "label": "Click to verify CBE account",
                "isCorrect": False,
                "outcomeNote": "You clicked the link leading to a fraudulent website. Entering account numbers or PINs would give attackers full access to your funds."
            },
            {
                "id": "opt-reply",
                "label": "Reply with account details",
                "isCorrect": False,
                "outcomeNote": "Never send account numbers, National IDs, or PINs via email reply."
            }
        ],
        "explanation": "Banking phishing in Ethiopia frequently exploits trusted names like Commercial Bank of Ethiopia (CBE) and CBE Birr. The authentic CBE domain is combanketh.et — any email linking to external domains like .cc or .service.com is fraudulent.",
        "betterResponse": "STOP before clicking. CHECK the URL domain suffix. VERIFY directly via the official CBE Mobile App or call 951. REPORT fraudulent messages immediately.",
        "isActive": 1
    },
    {
        "id": "sim-interactive-payroll-01",
        "title": "Corporate HR — Direct Deposit & Payroll Update",
        "category": "impersonation",
        "difficulty": "intermediate",
        "format": "EMAIL",
        "context": "An internal email styled with corporate human resources branding arrives right before the monthly payroll cutoff requesting banking updates.",
        "content": {
            "sender": "HR Payroll Support <payroll-update@company-staff-portal.org>",
            "fromName": "People & Culture (Payroll)",
            "fromEmail": "payroll-update@company-staff-portal.org",
            "to": "team@company.example",
            "sentAt": "Wed 3:45 PM",
            "subject": "Action Required: Direct Deposit & Banking Information Update for Payroll",
            "body": "Hello Team,\n\nWe are migrating our payroll software for the upcoming pay cycle. All staff members must log into the employee benefits portal below and re-confirm their direct deposit account number and routing information by Friday 5:00 PM.\n\nUnconfirmed accounts will have their payroll disbursements delayed until the next pay period.\n\nBest regards,\nHR Operations",
            "callToAction": "Update Direct Deposit Details",
            "linkDisplay": "https://intranet.company.example/hr/direct-deposit",
            "linkActual": "https://hr-login-company.sso-portal.site/auth/direct-deposit",
            "meta": {
                "simulationModule": "webmail",
                "organization": "Internal HR (Simulated Drill)",
                "attachment": "payroll_migration_notice.pdf",
                "interactive": "true"
            }
        },
        "indicators": [
            {
                "id": "ind-1",
                "title": "External Domain for Internal System",
                "description": "The email comes from company-staff-portal.org instead of your official corporate domain."
            },
            {
                "id": "ind-2",
                "title": "Salary Leverage Pressure",
                "description": "Threatening that your salary will be delayed creates urgency to skip routine verification."
            },
            {
                "id": "ind-3",
                "title": "Discrepancy in Link Target",
                "description": "The displayed link shows intranet.company.example, but hovering reveals sso-portal.site."
            },
            {
                "id": "ind-4",
                "title": "Out-of-Band Process Violation",
                "description": "Direct deposit changes in reputable organizations require multi-factor internal approvals or in-person verification."
            }
        ],
        "options": [
            {
                "id": "opt-verify",
                "label": "Verify with HR through Slack/Phone first",
                "isCorrect": True,
                "outcomeNote": "Great decision! Contacting HR through a known internal channel reveals that no such email was sent."
            },
            {
                "id": "opt-report",
                "label": "Report email to IT Security as Phishing",
                "isCorrect": True,
                "outcomeNote": "Excellent! IT security can isolate the malicious domain and alert other employees across the organization."
            },
            {
                "id": "opt-open",
                "label": "Log in and update bank details",
                "isCorrect": False,
                "outcomeNote": "This would have routed your upcoming paycheck to an attacker-controlled bank account."
            }
        ],
        "explanation": "Business Email Compromise (BEC) and payroll diversion scams are among the most financially damaging cyberattacks. Attackers impersonate HR or payroll vendors to redirect employee salaries.",
        "betterResponse": "STOP whenever an email asks for direct deposit or banking changes. CHECK the true sender address. VERIFY verbally or via internal company directory with HR. REPORT suspicious requests to IT Security.",
        "isActive": 1
    },
    {
        "id": "sim-interactive-telebirr-01",
        "title": "Telebirr Wrong Transfer Reversal Request",
        "category": "payment-fraud",
        "difficulty": "advanced",
        "format": "CHAT MESSAGE",
        "context": "A chat message arrives from an unknown phone number claiming they mistakenly transferred 6,800 ETB to your telebirr account and begging for a refund.",
        "content": {
            "sender": "Unknown Contact (+251 92 111 2233)",
            "subject": "Mistaken Transfer — Please Help!",
            "body": "Please help me brother! I mistakenly entered your phone number while sending money for my mother's hospital medicine at Tikur Anbessa Hospital. The amount was 6,800 ETB. You should have received the telebirr confirmation SMS just now. Please send it back to 0911223344 immediately, she is waiting for treatment!",
            "callToAction": "REFUND 6,800 ETB IMMEDIATELY",
            "meta": {
                "attachment": "telebirr_receipt.png (fabricated screenshot)",
                "organization": "Telebirr Payment Fraud Drill",
                "interactive": "true"
            }
        },
        "indicators": [
            {
                "id": "ind-1",
                "title": "Emotional Coercion",
                "description": "Mentioning a sick family member or hospital emergency is calculated to provoke panicked compliance."
            },
            {
                "id": "ind-2",
                "title": "Fabricated Proof",
                "description": "Screenshots and spoofed SMS notifications are easily faked and do not indicate real fund settlement."
            },
            {
                "id": "ind-3",
                "title": "Different Destination Number",
                "description": "The caller asks you to send funds to a different phone number, breaking traceability."
            },
            {
                "id": "ind-4",
                "title": "Unchecked Real Balance",
                "description": "Opening the official telebirr app reveals your real account balance never increased by 6,800 ETB."
            }
        ],
        "options": [
            {
                "id": "opt-verify",
                "label": "Open official Telebirr app & check real balance",
                "isCorrect": True,
                "outcomeNote": "Spot on! Checking your real app reveals no money ever arrived. If you had sent 6,800 ETB, it would have come straight out of your own wallet."
            },
            {
                "id": "opt-report",
                "label": "Report number to Ethio Telecom (994) & block",
                "isCorrect": True,
                "outcomeNote": "Correct course of action. Ethio Telecom fraud department can flag the scammer’s phone number."
            },
            {
                "id": "opt-open",
                "label": "Send the 6,800 ETB refund immediately",
                "isCorrect": False,
                "outcomeNote": "You would have sent 6,800 ETB of your own hard-earned money to a scammer against zero incoming funds."
            }
        ],
        "explanation": "Wrong-number transfer scams prey on human empathy. Attackers forge fake SMS messages or screenshots looking like official mobile money receipts. Only your official app transaction history proves a transaction actually occurred.",
        "betterResponse": "STOP before refunding any money. CHECK your real account balance in the official app, never an SMS or screenshot. VERIFY with customer service (994 for telebirr). REPORT the fraudulent number.",
        "isActive": 1
    },
    {
        "id": "sim-interactive-ai-voice-01",
        "title": "Executive Deepfake Voice Memo — Urgent Supplier Wire",
        "category": "social-engineering",
        "difficulty": "advanced",
        "format": "VOICE / CHAT",
        "context": "An encrypted message arrives on your work phone containing a voice memo that sounds distinctly like your CEO requesting an immediate confidential wire transfer.",
        "content": {
            "sender": "Executive Office (Audio Memo Attached)",
            "subject": "Confidential Acquisition Deposit",
            "body": "Voice Message Transcript:\n\"Hi, I'm currently in a confidential board meeting with international regulators and cannot take phone calls. We need to secure the initial escrow deposit of $45,000 for the acquisition before 5 PM. I need you to initiate the wire transfer to the escrow account details sent in the attached document right now. Don't discuss this with anyone in the office until the public announcement tomorrow.\"",
            "callToAction": "PROCESS WIRE TRANSFER",
            "meta": {
                "attachment": "escrow_wire_instructions.pdf",
                "organization": "Deepfake AI Voice Impersonation Drill",
                "interactive": "true"
            }
        },
        "indicators": [
            {
                "id": "ind-1",
                "title": "Bypassing Financial Controls",
                "description": "Requests to bypass established two-person authorization policies are a universal red flag."
            },
            {
                "id": "ind-2",
                "title": "Manufactured Inaccessibility",
                "description": "Claiming to be in a closed meeting where they cannot answer phone calls prevents you from calling back to verify."
            },
            {
                "id": "ind-3",
                "title": "Secrecy & Isolation",
                "description": "Demanding that you tell no one else isolates you from colleagues who might spot the scam."
            },
            {
                "id": "ind-4",
                "title": "AI Audio Synthesis Risk",
                "description": "With just 30 seconds of public audio from YouTube or webinars, attackers can clone an executive's voice with high fidelity."
            }
        ],
        "options": [
            {
                "id": "opt-verify",
                "label": "Require secondary out-of-band verbal confirmation",
                "isCorrect": True,
                "outcomeNote": "Outstanding! Adhering to strict corporate finance policy and insisting on verbal confirmation through a pre-agreed channel prevents deepfake wire fraud."
            },
            {
                "id": "opt-report",
                "label": "Flag to CFO & Security Director immediately",
                "isCorrect": True,
                "outcomeNote": "Correct! Alerting finance and security headers initiates executive protection protocols."
            },
            {
                "id": "opt-open",
                "label": "Process the wire because the voice sounded real",
                "isCorrect": False,
                "outcomeNote": "Falling for AI voice cloning has cost enterprises tens of millions of dollars. Voice identity is no longer proof of authorization."
            }
        ],
        "explanation": "Generative AI voice cloning allows attackers to replicate any public executive voice with pitch, timbre, and accent. Security policies must require dual authorization and out-of-band challenge verification for all financial transactions, regardless of how convincing an audio memo sounds.",
        "betterResponse": "STOP whenever an urgent financial request arrives via messaging. CHECK established corporate authorization policy. VERIFY in person or via secondary pre-established channels with known verbal passphrases. REPORT social engineering attempts immediately.",
        "isActive": 1
    }
]
