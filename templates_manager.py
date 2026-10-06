"""
MENTEKO Template Engine for Phishing Simulations.
Supports industry-standard HTML templates (GoPhish / KnowBe4 style)
for both emails and landing pages with automated credential interception bridges.
"""

import os
import re

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
EMAILS_DIR = os.path.join(TEMPLATES_DIR, 'emails')
PAGES_DIR = os.path.join(TEMPLATES_DIR, 'pages')

# Template mappings for drill scenarios
DRILL_TEMPLATE_MAP = {
    'drill-iphone-giveaway': {
        'email': 'apple_iphone17_giveaway.html',
        'page': 'apple_iphone17_giveaway.html',
        'category': 'Rewards / VIP Consumer',
        'title': 'Apple iPhone 17 Pro Max VIP Loyalty Giveaway'
    },
    'drill-bank-webmail': {
        'email': 'bank_security_alert.html',
        'page': 'bank_online_login.html',
        'category': 'Banking / Finance',
        'title': 'Corporate Banking Unauthorized Access Alert'
    },
    'drill-cbe-birr': {
        'email': 'cbe_birr_kyc.html',
        'page': 'cbe_birr_kyc.html',
        'category': 'Mobile Money / Smishing',
        'title': 'Commercial Bank of Ethiopia (CBE Birr) KYC Compliance'
    },
    'drill-m365-oauth': {
        'email': 'm365_shared_file.html',
        'page': 'm365_login.html',
        'category': 'Enterprise Cloud / M365',
        'title': 'Microsoft 365 SharePoint Document Invitation'
    },
    'drill-google-alert': {
        'email': 'google_security_alert.html',
        'page': 'google_login.html',
        'category': 'Account Security',
        'title': 'Google Workspace Critical Security Alert'
    }
}

INTERCEPTION_BRIDGE_JS = """
<script id="menteko-interception-bridge">
(function() {
  const token = "{{TOKEN}}";
  const apiBase = "{{API_BASE}}";
  const drillId = "{{DRILL_ID}}";

  function sendTelemetry(action, payload) {
    if (!token) return Promise.resolve();
    return fetch(apiBase + "/api/drills/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        action: action,
        details: payload || {}
      })
    }).catch(function(e) {
      console.warn("Telemetry ping:", e);
    });
  }

  // Intercept all form submissions (never sends passwords, logs compromise telemetry)
  document.addEventListener("DOMContentLoaded", function() {
    // Record page open telemetry
    sendTelemetry("open_page", { drillId: drillId });

    const forms = document.querySelectorAll("form");
    forms.forEach(function(form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Find non-sensitive username/email if present
        let accountId = "";
        const inputs = form.querySelectorAll("input");
        inputs.forEach(function(inp) {
          if (inp.type === "email" || inp.type === "text" || inp.name.includes("user") || inp.name.includes("email") || inp.name.includes("phone")) {
            if (!accountId && inp.value) accountId = inp.value;
          }
        });

        sendTelemetry("submit_credentials", {
          entered: true,
          lure: document.title || drillId,
          targetAccount: accountId || "employee"
        }).finally(function() {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: "MENTEKO_COMPROMISED",
              token: token,
              drillId: drillId
            }, "*");
          } else {
            window.location.href = "/drill?token=" + encodeURIComponent(token) + "&state=compromised";
          }
        });
      });
    });

    // Intercept generic click actions on action links
    const actionLinks = document.querySelectorAll("a[href*='#login'], a[href*='#submit'], a.action-link, button:not([type='submit'])");
    actionLinks.forEach(function(link) {
      link.addEventListener("click", function(e) {
        if (link.getAttribute("href") === "#" || link.tagName === "BUTTON") {
          e.preventDefault();
          sendTelemetry("click_link", { element: link.innerText || "action_button" });
        }
      });
    });
  });
})();
</script>
"""

def render_email_template(drill_id, target_name, drill_url, token, sender_email, base_url, subject=None, body=None, call_to_action=None):
    """
    Renders an HTML email from the pre-built template library.
    """
    tmpl_info = DRILL_TEMPLATE_MAP.get(drill_id, DRILL_TEMPLATE_MAP['drill-bank-webmail'])
    filename = tmpl_info['email']
    filepath = os.path.join(EMAILS_DIR, filename)

    if not os.path.exists(filepath):
        # Fallback to standard email template
        filepath = os.path.join(EMAILS_DIR, 'bank_security_alert.html')

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        content = "<html><body><p>Dear {{TARGET_NAME}},</p><p>{{BODY}}</p><p><a href='{{DRILL_URL}}'>{{CTA}}</a></p></body></html>"

    pixel_url = f"{base_url}/api/drills/track-pixel?token={token}"
    formatted_body = (body or '').replace('\n', '<br>')

    replacements = {
        '{{TARGET_NAME}}': target_name or 'Team Member',
        '{{DRILL_URL}}': drill_url,
        '{{TOKEN}}': token,
        '{{PIXEL_URL}}': pixel_url,
        '{{SENDER_EMAIL}}': sender_email,
        '{{BASE_URL}}': base_url,
        '{{SUBJECT}}': subject or tmpl_info['title'],
        '{{BODY}}': formatted_body,
        '{{CTA}}': call_to_action or 'Verify Credentials'
    }

    for key, val in replacements.items():
        content = content.replace(key, str(val))

    return content


def render_landing_page_template(drill_id, token, base_url):
    """
    Renders a standalone landing page from the pre-built template library
    with the automated Interception Bridge script injected.
    """
    tmpl_info = DRILL_TEMPLATE_MAP.get(drill_id, DRILL_TEMPLATE_MAP['drill-bank-webmail'])
    filename = tmpl_info['page']
    filepath = os.path.join(PAGES_DIR, filename)

    if not os.path.exists(filepath):
        filepath = os.path.join(PAGES_DIR, 'apple_iphone17_giveaway.html')

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        content = f"<html><body><h1>Simulated Landing Page</h1><p>{e}</p></body></html>"

    bridge = INTERCEPTION_BRIDGE_JS.replace('{{TOKEN}}', token or '').replace('{{API_BASE}}', base_url or '').replace('{{DRILL_ID}}', drill_id or '')

    # Inject bridge right before </body>
    if '</body>' in content:
        content = content.replace('</body>', f"{bridge}\n</body>")
    else:
        content += bridge

    return content


def get_available_templates():
    """Returns list of registered templates with metadata."""
    templates = []
    for drill_id, info in DRILL_TEMPLATE_MAP.items():
        templates.append({
            'drillId': drill_id,
            'title': info['title'],
            'category': info['category'],
            'emailTemplateFile': info['email'],
            'landingPageFile': info['page']
        })
    return templates
