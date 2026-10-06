import os
import sys
import json
import sqlite3
import uuid
import subprocess
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_from_directory, abort, make_response, Response

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from scenarios_data import ALL_SCENARIOS
from dynamic_drills_data import DYNAMIC_DRILLS

COMBINED_SCENARIOS = ALL_SCENARIOS

SMTP_HOST = os.environ.get('SMTP_HOST', '127.0.0.1')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
DEFAULT_FROM_EMAIL = os.environ.get('FROM_EMAIL', 'security-alerts@savethegeneration.com.et')

DA_HOST = os.environ.get('DA_HOST', 'https://127.0.0.1:2222')
DA_USER = os.environ.get('DA_USER', 'eescprut')
DA_PASS = os.environ.get('DA_PASS', 'G0dworksforme@2026.')
DA_DOMAIN = os.environ.get('DA_DOMAIN', 'savethegeneration.com.et')

app = Flask(__name__)

# Database file location
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'menteko.db')

# Frontend static distribution path
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'dist')
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')


# ============================================================================
# CORS HEADERS
# ============================================================================
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response


# ============================================================================
# DATABASE INITIALIZATION & SEEDING
# ============================================================================
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS scenarios (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        format TEXT NOT NULL,
        context TEXT NOT NULL,
        content TEXT NOT NULL,
        indicators TEXT NOT NULL,
        options TEXT NOT NULL,
        explanation TEXT NOT NULL,
        betterResponse TEXT NOT NULL,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS attempts (
        id TEXT PRIMARY KEY,
        user TEXT,
        scenario_id TEXT NOT NULL,
        selectedOption TEXT NOT NULL,
        correct INTEGER NOT NULL,
        score INTEGER NOT NULL,
        reasoning TEXT,
        createdAt TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        user TEXT,
        totalQuestions INTEGER NOT NULL,
        correctAnswers INTEGER NOT NULL,
        score INTEGER NOT NULL,
        categoryBreakdown TEXT NOT NULL,
        completedAt TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        createdAt TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS drills (
        id TEXT PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        drill_id TEXT NOT NULL,
        target_email TEXT,
        target_name TEXT,
        sender_email TEXT,
        department TEXT,
        status TEXT NOT NULL,
        opened_at TEXT,
        clicked_at TEXT,
        submitted_at TEXT,
        reported_at TEXT,
        trained_at TEXT,
        reaction_time_seconds INTEGER,
        compromised_details TEXT,
        device_info TEXT,
        created_at TEXT NOT NULL
    )
    ''')

    # Auto-migration for drills table
    cursor.execute("PRAGMA table_info(drills)")
    existing_cols = [r['name'] for r in cursor.fetchall()]
    for col_name in ['sender_email', 'department', 'trained_at', 'compromised_details']:
        if col_name not in existing_cols:
            try:
                cursor.execute(f"ALTER TABLE drills ADD COLUMN {col_name} TEXT")
            except Exception:
                pass

    # Ensure scenarios table has clean 15 base scenarios (remove legacy sim-interactive-*)
    cursor.execute("DELETE FROM scenarios WHERE id LIKE 'sim-interactive-%'")

    conn.commit()

    # Seed base scenarios if table has fewer scenarios than combined total
    cursor.execute('SELECT COUNT(*) as cnt FROM scenarios')
    if cursor.fetchone()['cnt'] < len(COMBINED_SCENARIOS):
        seed_scenarios(conn)

    conn.close()


def seed_scenarios(conn):
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    for s in COMBINED_SCENARIOS:
        cursor.execute('''
        INSERT OR REPLACE INTO scenarios
        (id, title, category, difficulty, format, context, content, indicators, options, explanation, betterResponse, isActive, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            s["id"], s["title"], s["category"], s["difficulty"], s["format"],
            s["context"], json.dumps(s["content"]), json.dumps(s["indicators"]),
            json.dumps(s["options"]), s["explanation"], s["betterResponse"],
            s.get("isActive", 1), now
        ))
    conn.commit()


# Initialize database upon import
init_db()


# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "database": "connected",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })


@app.route('/api/scenarios', methods=['GET'])
def get_scenarios():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')

    query = 'SELECT * FROM scenarios WHERE isActive = 1'
    params = []
    if category:
        query += ' AND category = ?'
        params.append(category)
    if difficulty:
        query += ' AND difficulty = ?'
        params.append(difficulty)

    query += ' ORDER BY createdAt ASC'

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "_id": r["id"],
            "id": r["id"],
            "title": r["title"],
            "category": r["category"],
            "difficulty": r["difficulty"],
            "format": r["format"],
            "context": r["context"],
            "content": json.loads(r["content"]),
            "indicators": json.loads(r["indicators"]),
            "options": json.loads(r["options"]),
            "explanation": r["explanation"],
            "betterResponse": r["betterResponse"],
            "isActive": bool(r["isActive"]),
            "createdAt": r["createdAt"]
        })

    return jsonify({"success": True, "count": len(results), "data": results})


@app.route('/api/scenarios/<scenario_id>', methods=['GET'])
def get_scenario_by_id(scenario_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM scenarios WHERE id = ? AND isActive = 1', (scenario_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Scenario not found"}), 404

    data = {
        "_id": row["id"],
        "id": row["id"],
        "title": row["title"],
        "category": row["category"],
        "difficulty": row["difficulty"],
        "format": row["format"],
        "context": row["context"],
        "content": json.loads(row["content"]),
        "indicators": json.loads(row["indicators"]),
        "options": json.loads(row["options"]),
        "explanation": row["explanation"],
        "betterResponse": row["betterResponse"],
        "isActive": bool(row["isActive"]),
        "createdAt": row["createdAt"]
    }
    return jsonify({"success": True, "data": data})


@app.route('/api/attempts', methods=['POST'])
def create_attempt():
    body = request.get_json(silent=True) or {}
    scenario_id = body.get('scenario')
    selected_option = body.get('selectedOption')
    reasoning = body.get('reasoning')

    if not scenario_id or not selected_option:
        return jsonify({"success": False, "message": "scenario and selectedOption are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT options FROM scenarios WHERE id = ? AND isActive = 1', (scenario_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Scenario not found"}), 404

    options = json.loads(row['options'])
    matched_opt = next((o for o in options if o['id'] == selected_option), None)
    if not matched_opt:
        conn.close()
        return jsonify({"success": False, "message": "Invalid option for this scenario"}), 400

    correct = bool(matched_opt.get('isCorrect', False))
    score = 100 if correct else 0
    attempt_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    cursor.execute('''
    INSERT INTO attempts (id, user, scenario_id, selectedOption, correct, score, reasoning, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (attempt_id, None, scenario_id, selected_option, 1 if correct else 0, score, reasoning, now))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "data": {
            "_id": attempt_id,
            "id": attempt_id,
            "scenario": scenario_id,
            "selectedOption": selected_option,
            "correct": correct,
            "score": score,
            "reasoning": reasoning,
            "createdAt": now
        }
    }), 201


@app.route('/api/attempts', methods=['GET'])
def get_attempts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT a.*, s.title as scenario_title, s.category as scenario_category, s.content as scenario_content
    FROM attempts a
    LEFT JOIN scenarios s ON a.scenario_id = s.id
    ORDER BY a.createdAt DESC LIMIT 200
    ''')
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "_id": r["id"],
            "id": r["id"],
            "scenario": {
                "_id": r["scenario_id"],
                "title": r["scenario_title"],
                "category": r["scenario_category"]
            } if r["scenario_title"] else r["scenario_id"],
            "selectedOption": r["selectedOption"],
            "correct": bool(r["correct"]),
            "score": r["score"],
            "reasoning": r["reasoning"],
            "createdAt": r["createdAt"]
        })

    return jsonify({"success": True, "count": len(results), "data": results})


@app.route('/api/assessments', methods=['POST'])
def create_assessment():
    body = request.get_json(silent=True) or {}
    attempt_ids = body.get('attempts', [])

    if not isinstance(attempt_ids, list) or len(attempt_ids) == 0:
        return jsonify({"success": False, "message": "attempts must be a non-empty array of attempt ids"}), 400

    conn = get_db()
    cursor = conn.cursor()

    placeholders = ','.join('?' for _ in attempt_ids)
    cursor.execute(f'''
    SELECT a.correct, s.category
    FROM attempts a
    JOIN scenarios s ON a.scenario_id = s.id
    WHERE a.id IN ({placeholders})
    ''', attempt_ids)
    rows = cursor.fetchall()

    if not rows:
        conn.close()
        return jsonify({"success": False, "message": "No matching attempts found"}), 404

    breakdown = {}
    correct_count = 0
    total_count = len(rows)

    for r in rows:
        cat = r['category']
        is_corr = bool(r['correct'])
        if is_corr:
            correct_count += 1
        if cat not in breakdown:
            breakdown[cat] = {"category": cat, "correct": 0, "total": 0}
        breakdown[cat]["total"] += 1
        if is_corr:
            breakdown[cat]["correct"] += 1

    overall_score = round((correct_count / total_count) * 100) if total_count > 0 else 0
    assessment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    category_list = list(breakdown.values())

    cursor.execute('''
    INSERT INTO assessments (id, user, totalQuestions, correctAnswers, score, categoryBreakdown, completedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (assessment_id, None, total_count, correct_count, overall_score, json.dumps(category_list), now))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "data": {
            "_id": assessment_id,
            "id": assessment_id,
            "totalQuestions": total_count,
            "correctAnswers": correct_count,
            "score": overall_score,
            "categoryBreakdown": category_list,
            "completedAt": now
        }
    }), 201


@app.route('/api/assessments/<assessment_id>', methods=['GET'])
def get_assessment(assessment_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM assessments WHERE id = ?', (assessment_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Assessment not found"}), 404

    return jsonify({
        "success": True,
        "data": {
            "_id": row["id"],
            "id": row["id"],
            "totalQuestions": row["totalQuestions"],
            "correctAnswers": row["correctAnswers"],
            "score": row["score"],
            "categoryBreakdown": json.loads(row["categoryBreakdown"]),
            "completedAt": row["completedAt"]
        }
    })


@app.route('/api/users', methods=['POST'])
def create_user():
    body = request.get_json(silent=True) or {}
    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip().lower()

    if not name or not email:
        return jsonify({"success": False, "message": "name and email are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return jsonify({"success": True, "data": {"_id": existing["id"], "name": existing["name"], "email": existing["email"]}})

    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    cursor.execute('INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)', (user_id, name, email, now))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "data": {"_id": user_id, "name": name, "email": email, "createdAt": now}}), 201


# ============================================================================
# EMAIL SERVICE (SMTP DRILLS, DIRECTADMIN INTEGRATION & CERTIFICATES)
# ============================================================================
DA_HOST = os.environ.get('DA_HOST', 'https://127.0.0.1:2222')
DA_USER = os.environ.get('DA_USER', 'eescprut')
DA_PASS = os.environ.get('DA_PASS', 'G0dworksforme@2026.')
DA_DOMAIN = os.environ.get('DA_DOMAIN', 'savethegeneration.com.et')

def get_directadmin_mailboxes():
    try:
        import urllib.request, ssl, base64, urllib.parse
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        auth = base64.b64encode(f"{DA_USER}:{DA_PASS}".encode()).decode("ascii")
        url = f"{DA_HOST}/CMD_API_POP?domain={DA_DOMAIN}&action=list"
        req = urllib.request.Request(url, headers={"Authorization": f"Basic {auth}"})
        res = urllib.request.urlopen(req, context=ctx, timeout=6).read().decode("utf-8")
        parsed = urllib.parse.parse_qs(res)
        users = parsed.get("list[]", [])
        if users:
            return [f"{u}@{DA_DOMAIN}" for u in users]
    except Exception as e:
        app.logger.warning(f"DirectAdmin API query failed: {e}")

    # Fallback to confirmed active DirectAdmin accounts
    return [
        f"security-alerts@{DA_DOMAIN}",
        f"drills@{DA_DOMAIN}",
        f"hr-notice@{DA_DOMAIN}",
        f"admin@{DA_DOMAIN}",
        f"noreply@{DA_DOMAIN}"
    ]

def create_directadmin_mailbox(username, password=None, quota=500):
    try:
        import urllib.request, ssl, base64, urllib.parse
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        clean_user = username.split('@')[0].strip().lower()
        clean_pass = password or DA_PASS
        auth = base64.b64encode(f"{DA_USER}:{DA_PASS}".encode()).decode("ascii")
        url = f"{DA_HOST}/CMD_API_POP"
        data = urllib.parse.urlencode({
            "action": "create",
            "domain": DA_DOMAIN,
            "user": clean_user,
            "passwd": clean_pass,
            "passwd2": clean_pass,
            "quota": quota
        }).encode("utf-8")

        req = urllib.request.Request(url, data=data, headers={"Authorization": f"Basic {auth}"})
        res = urllib.request.urlopen(req, context=ctx, timeout=8).read().decode("utf-8")
        parsed = urllib.parse.parse_qs(res)
        is_error = parsed.get("error", ["1"])[0] == "1"
        msg = parsed.get("text", ["Unknown response"])[0]
        return not is_error, msg
    except Exception as e:
        return False, str(e)


def format_phishing_email_html(subject, body, target_name, call_to_action, drill_url, token, sender_email, base_url):
    formatted_body = body.replace('\n', '<br>')
    pixel_url = f"{base_url}/api/drills/track-pixel?token={token}"
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }}
  .container {{ max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }}
  .header {{ background: #0f172a; color: #ffffff; padding: 20px 24px; }}
  .header-tag {{ font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 700; }}
  .header-title {{ font-size: 18px; font-weight: 700; margin: 6px 0 0 0; color: #ffffff; }}
  .content {{ padding: 28px 24px; font-size: 14px; line-height: 1.6; color: #334155; }}
  .cta-block {{ text-align: center; margin: 26px 0; }}
  .cta-btn {{ display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 13px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.25); }}
  .footer {{ padding: 18px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 11px; color: #64748b; line-height: 1.5; }}
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-tag">Official Security Notice</div>
      <div class="header-title">{subject}</div>
    </div>
    <div class="content">
      <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 0;">Dear {target_name},</p>
      <div style="margin: 16px 0; line-height: 1.6;">{formatted_body}</div>
      <div class="cta-block">
        <a href="{drill_url}" class="cta-btn">{call_to_action}</a>
      </div>
    </div>
    <div class="footer">
      🔒 <b>MENTEKO Defense Engine:</b> Controlled resilience training authorized by your organization. DirectAdmin Verified Dispatch ({sender_email}).
    </div>
  </div>
  <img src="{pixel_url}" width="1" height="1" style="display:none;" alt="" />
</body>
</html>"""


def send_smtp_email(to_email, subject, html_content, text_content=None, from_name="MENTEKO Cyber Resilience", from_email=None):
    sender = (from_email or DEFAULT_FROM_EMAIL).strip()
    if '@' not in sender:
        sender = f"{sender}@{DA_DOMAIN}"

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"{from_name} <{sender}>"
    msg['To'] = to_email
    msg['Reply-To'] = sender

    if text_content:
        msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
    else:
        msg.attach(MIMEText("This is an authorized awareness training message from MENTEKO Platform.", 'plain', 'utf-8'))

    msg.attach(MIMEText(html_content, 'html', 'utf-8'))

    # Connect via port 587 with STARTTLS and DirectAdmin SMTP authentication
    delivery_err = None
    try:
        with smtplib.SMTP(SMTP_HOST, 587, timeout=12) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            try:
                server.login(sender, DA_PASS)
            except Exception:
                server.login(f"security-alerts@{DA_DOMAIN}", DA_PASS)
            rejected = server.sendmail(sender, [to_email], msg.as_string())
            if rejected:
                raise Exception(f"Recipient rejected: {rejected}")
            return True
    except Exception as e587:
        delivery_err = e587
        app.logger.warning(f"SMTP delivery on 587 failed: {e587}. Trying port 465 SSL...")

    # Fallback to port 465 SSL
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, 465, timeout=10) as server:
            try:
                server.login(sender, DA_PASS)
            except Exception:
                server.login(f"security-alerts@{DA_DOMAIN}", DA_PASS)
            rejected = server.sendmail(sender, [to_email], msg.as_string())
            if rejected:
                raise Exception(f"Recipient rejected on port 465: {rejected}")
            return True
    except Exception as e465:
        app.logger.warning(f"SMTP delivery on 465 failed: {e465}. Trying port 25...")

    # Fallback to port 25
    try:
        with smtplib.SMTP(SMTP_HOST, 25, timeout=8) as server:
            rejected = server.sendmail(sender, [to_email], msg.as_string())
            if rejected:
                raise Exception(f"Recipient rejected on port 25: {rejected}")
            return True
    except Exception as e25:
        app.logger.error(f"All SMTP delivery methods failed for {to_email}: {delivery_err or e465 or e25}")
        raise Exception(f"DirectAdmin SMTP Delivery Failed: {delivery_err or e465 or e25}")


@app.route('/api/email/status', methods=['GET'])
def email_status():
    try:
        with smtplib.SMTP(SMTP_HOST, 587, timeout=4) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(f"security-alerts@{DA_DOMAIN}", DA_PASS)
            return jsonify({
                "success": True,
                "status": "connected",
                "smtp_host": f"{SMTP_HOST}:587 (Authenticated DirectAdmin MTA)",
                "from_email": f"security-alerts@{DA_DOMAIN}"
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "status": "unavailable",
            "error": str(e),
            "smtp_host": f"{SMTP_HOST}:587"
        }), 503


@app.route('/api/email/send-drill', methods=['POST'])
def send_email_drill():
    data = request.get_json(silent=True) or {}
    if not data or not data.get('email'):
        return jsonify({"success": False, "message": "Recipient email is required"}), 400

    recipient = data.get('email').strip()
    scenario_id = data.get('scenarioId', 'sim-interactive-menteko-01')
    target_name = data.get('name', 'Team Member').strip()

    # Find the scenario in SQLite
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM scenarios WHERE id = ?', (scenario_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Scenario not found"}), 404

    scenario = dict(row)
    content = json.loads(scenario['content']) if isinstance(scenario['content'], str) else scenario['content']

    subject = content.get('subject', 'Action Required: Security Notice')
    sender_name = content.get('fromName', 'IT Security Team')
    body_text = content.get('body', '')
    call_to_action = content.get('callToAction', 'Review Notification')

    drill_link = f"https://menteko.savethegeneration.com.et/simulate/{scenario_id}?drill=1&recipient={recipient}"

    html_email = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 24px; color: #202124; }}
        .card {{ max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }}
        .header {{ padding: 20px 24px; border-bottom: 1px solid #f1f3f4; }}
        .sender-badge {{ font-size: 14px; font-weight: 700; color: #1a73e8; }}
        .body-content {{ padding: 28px 24px; font-size: 15px; line-height: 1.6; color: #3c4043; }}
        .btn {{ display: inline-block; background-color: #1a73e8; color: #ffffff !important; text-decoration: none; padding: 12px 26px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 18px; }}
        .footer {{ padding: 16px 24px; background: #f8f9fa; border-top: 1px solid #f1f3f4; font-size: 11px; color: #70757a; line-height: 1.5; }}
        .notice {{ background: #e8f0fe; color: #1967d2; padding: 10px 14px; border-radius: 6px; font-size: 12px; margin-top: 20px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="sender-badge">{sender_name}</span>
          <span style="float: right; font-size: 12px; color: #5f6368;">Simulation Drill</span>
        </div>
        <div class="body-content">
          <p>Hello {target_name},</p>
          <p style="white-space: pre-line;">{body_text}</p>
          <p>
            <a href="{drill_link}" class="btn">{call_to_action}</a>
          </p>
          <div class="notice">
            🔒 <b>Menteko Training Simulation:</b> Test your instincts. If you would click this link in real life, click above to see the breakdown and learning moments.
          </div>
        </div>
        <div class="footer">
          This message was sent as part of an authorized cybersecurity awareness exercise powered by <b>MENTEKO</b> (<a href="https://menteko.savethegeneration.com.et" style="color:#1a73e8;">menteko.savethegeneration.com.et</a>). No actual passwords, funds, or credentials are ever collected or stored.
        </div>
      </div>
    </body>
    </html>
    """

    try:
        send_smtp_email(
            to_email=recipient,
            subject=subject,
            html_content=html_email,
            text_content=f"{body_text}\\n\\n[Action Link]: {drill_link}",
            from_name=sender_name
        )
        return jsonify({
            "success": True,
            "message": f"Phishing simulation drill email delivered to {recipient}",
            "drill_link": drill_link
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/email/send-report', methods=['POST'])
def send_email_report():
    data = request.get_json(silent=True) or {}
    if not data or not data.get('email'):
        return jsonify({"success": False, "message": "Recipient email is required"}), 400

    recipient = data.get('email').strip()
    user_name = data.get('name', 'Cyber Resilience Trainee').strip()
    score = data.get('score', 0)
    correct = data.get('correct', 0)
    total = data.get('total', 0)
    breakdown = data.get('categoryBreakdown', {})

    now_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    badge_status = "CERTIFIED RESILIENT DEFENDER" if score >= 80 else ("DEVELOPING DEFENDER" if score >= 50 else "AWARENESS TRAINEE")
    badge_color = "#00f0ff" if score >= 80 else ("#f59e0b" if score >= 50 else "#ec4899")

    breakdown_rows = ""
    for cat, stats in breakdown.items():
        if isinstance(stats, dict):
            c_score = stats.get('score', 0)
            c_count = f"{stats.get('correct', 0)}/{stats.get('total', 0)}"
        else:
            c_score = stats
            c_count = ""
        breakdown_rows += f"""
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #1a2c38; text-transform: capitalize; color: #e2e8f0;">{cat.replace('-', ' ')}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #1a2c38; text-align: center; color: #94a3b8;">{c_count}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #1a2c38; text-align: right; font-weight: 700; color: #00f0ff;">{c_score}%</td>
        </tr>
        """

    html_cert = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ background-color: #050b11; margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; }}
        .cert-card {{ max-width: 620px; margin: 0 auto; background: #08121a; border: 1px solid #00f0ff33; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 240, 255, 0.12); }}
        .cert-header {{ background: linear-gradient(135deg, #0d2433 0%, #08121a 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #00f0ff22; }}
        .title {{ font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff; margin: 0; }}
        .score-circle {{ display: inline-block; margin-top: 16px; background: #0d2433; border: 3px solid {badge_color}; border-radius: 50%; width: 92px; height: 92px; line-height: 86px; font-size: 32px; font-weight: 900; color: #ffffff; text-align: center; }}
        .badge {{ display: inline-block; margin-top: 14px; font-size: 11px; letter-spacing: 1.5px; font-weight: 800; padding: 6px 14px; border-radius: 20px; background: {badge_color}22; color: {badge_color}; border: 1px solid {badge_color}44; text-transform: uppercase; }}
        .cert-body {{ padding: 28px 24px; }}
        .table {{ width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }}
        .footer {{ padding: 18px 24px; background: #050b11; border-top: 1px solid #00f0ff22; text-align: center; font-size: 11px; color: #64748b; }}
      </style>
    </head>
    <body>
      <div class="cert-card">
        <div class="cert-header">
          <p style="color: #00f0ff; font-size: 11px; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0;">Official Verification Certificate</p>
          <h1 class="title">MENTEKO CYBER RESILIENCE</h1>
          <div class="score-circle">{score}%</div>
          <div><span class="badge">{badge_status}</span></div>
        </div>
        <div class="cert-body">
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            This certifies that <b>{user_name}</b> has completed the human-centered cybersecurity assessment on <b>{now_str}</b>, achieving a resilience score of <b>{score}%</b> ({correct} out of {total} threat vectors correctly handled).
          </p>
          <h3 style="font-size: 13px; letter-spacing: 1px; color: #00f0ff; text-transform: uppercase; margin-top: 24px;">Category Competency Breakdown</h3>
          <table class="table">
            <thead>
              <tr style="color: #64748b; font-size: 11px; text-transform: uppercase;">
                <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid #1a2c38;">Category</th>
                <th style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #1a2c38;">Ratio</th>
                <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #1a2c38;">Score</th>
              </tr>
            </thead>
            <tbody>
              {breakdown_rows}
            </tbody>
          </table>
          <p style="text-align: center; margin-top: 28px;">
            <a href="https://menteko.savethegeneration.com.et/simulate" style="display: inline-block; background: #00f0ff; color: #050b11; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; font-size: 13px;">PRACTICE MORE SIMULATIONS</a>
          </p>
        </div>
        <div class="footer">
          Verified by MENTEKO Defense Engine · Issued by <a href="https://menteko.savethegeneration.com.et" style="color: #00f0ff;">menteko.savethegeneration.com.et</a>
        </div>
      </div>
    </body>
    </html>
    """

    try:
        send_smtp_email(
            to_email=recipient,
            subject=f"Your MENTEKO Cyber Resilience Certificate ({score}%)",
            html_content=html_cert,
            text_content=f"Congratulations {user_name}! You completed the MENTEKO Cyber Assessment with a score of {score}% on {now_str}.",
            from_name="MENTEKO Certification"
        )
        return jsonify({
            "success": True,
            "message": f"Cyber Resilience Certificate delivered to {recipient}"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================================
# DYNAMIC CYBER SIMULATION DRILL ENGINE (LIVE SERVER INTEGRATED)
# ============================================================================

@app.route('/api/drills', methods=['GET'])
def get_drills():
    return jsonify({
        "success": True,
        "count": len(DYNAMIC_DRILLS),
        "drills": DYNAMIC_DRILLS
    })


@app.route('/api/drills/<drill_id>', methods=['GET'])
def get_drill_by_id(drill_id):
    drill = next((d for d in DYNAMIC_DRILLS if d['id'] == drill_id), None)
    if not drill:
        return jsonify({"success": False, "message": "Drill not found"}), 404
    return jsonify({"success": True, "drill": drill})


@app.route('/api/drills/launch', methods=['POST'])
def launch_drill():
    data = request.get_json(silent=True) or {}
    drill_id = data.get('drillId') or 'drill-bank-webmail'
    email = data.get('email', '').strip()
    target_name = data.get('name', 'Trainee Defender').strip()

    drill = next((d for d in DYNAMIC_DRILLS if d['id'] == drill_id), None)
    if not drill:
        return jsonify({"success": False, "message": "Drill not found"}), 404

    token = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    base_url = os.environ.get('BASE_URL', 'https://menteko.savethegeneration.com.et')
    drill_url = f"{base_url}/drill?token={token}&drill={drill_id}"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO drills
        (id, token, drill_id, target_email, target_name, status, reaction_time_seconds, device_info, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (str(uuid.uuid4()), token, drill_id, email or None, target_name, 'dispatched', None, request.headers.get('User-Agent', ''), now))
    conn.commit()
    conn.close()

    email_sent = False
    if email and drill.get('serverEmailSupport'):
        tmpl = drill.get('emailTemplate', {})
        html_email = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8">
        <style>
          body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1a202c; }}
          .card {{ max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }}
          .btn {{ display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0; }}
          .disclaimer {{ margin-top: 24px; padding-top: 16px; border-top: 1px solid #edf2f7; font-size: 11px; color: #718096; }}
        </style>
        </head>
        <body>
          <div class="card">
            <h3 style="margin-top: 0; color: #2d3748;">{tmpl.get('subject', 'Security Notice')}</h3>
            <p style="white-space: pre-line; line-height: 1.6;">{tmpl.get('body', '')}</p>
            <p style="text-align: center;">
              <a href="{drill_url}" class="btn">{tmpl.get('callToAction', 'Review Notification')}</a>
            </p>
            <div class="disclaimer">
              🔒 <b>MENTEKO Authorized Cyber Simulation:</b> This controlled exercise tests human resilience. No actual passwords or credentials are ever collected or stored.
            </div>
          </div>
        </body>
        </html>
        """
        try:
            send_smtp_email(
                to_email=email,
                subject=tmpl.get('subject', 'Security Drill'),
                html_content=html_email,
                text_content=f"{tmpl.get('body', '')}\\n\\nDrill Link: {drill_url}",
                from_name=tmpl.get('fromName', 'Menteko Cyber Defense')
            )
            email_sent = True
        except Exception as e:
            app.logger.warning(f"Failed to dispatch drill email: {e}")

    return jsonify({
        "success": True,
        "token": token,
        "drillId": drill_id,
        "drillUrl": drill_url,
        "emailSent": email_sent,
        "message": f"Drill session initiated successfully{' and email delivered to ' + email if email_sent else ''}."
    })


@app.route('/api/drills/session/<token>', methods=['GET'])
def get_drill_session(token):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM drills WHERE token = ?', (token,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Invalid drill token"}), 404

    drill_session = dict(row)
    now = datetime.now(timezone.utc).isoformat()
    if not drill_session.get('opened_at'):
        cursor.execute("UPDATE drills SET opened_at = ?, status = CASE WHEN status = 'dispatched' THEN 'opened' ELSE status END WHERE token = ?", (now, token))
        conn.commit()
        drill_session['opened_at'] = now
        if drill_session['status'] == 'dispatched':
            drill_session['status'] = 'opened'

    conn.close()

    drill_id = drill_session.get('drill_id')
    drill = next((d for d in DYNAMIC_DRILLS if d['id'] == drill_id), None)

    return jsonify({
        "success": True,
        "session": drill_session,
        "drill": drill
    })


@app.route('/api/drills/action', methods=['POST'])
def record_drill_action():
    data = request.get_json(silent=True) or {}
    token = data.get('token')
    action = data.get('action')
    details = data.get('details', {})

    if not token or not action:
        return jsonify({"success": False, "message": "Token and action are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM drills WHERE token = ?', (token,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Session not found"}), 404

    session = dict(row)
    now_dt = datetime.now(timezone.utc)
    now = now_dt.isoformat()

    ref_time_str = session.get('opened_at') or session.get('created_at')
    reaction_time = 12
    if ref_time_str:
        try:
            ref_dt = datetime.fromisoformat(ref_time_str.replace('Z', '+00:00'))
            reaction_time = max(1, int((now_dt - ref_dt).total_seconds()))
        except Exception:
            reaction_time = 12

    new_status = session.get('status')
    compromised_payload = None

    if action == 'click_link':
        new_status = 'clicked'
        cursor.execute('UPDATE drills SET status = ?, clicked_at = ?, reaction_time_seconds = ? WHERE token = ?', (new_status, now, reaction_time, token))
    elif action == 'submit_credentials':
        new_status = 'compromised'
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '197.156.103.42')
        if ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()
        compromised_data = {
            "simulatedBreach": True,
            "ipAddress": client_ip,
            "userAgent": request.headers.get('User-Agent', 'Desktop Client'),
            "capturedFields": ["account_identity", "credential_hash_intercepted"],
            "compromisedAt": now,
            "sessionRisk": "Critical Vulnerability Triggered — Account Compromised"
        }
        cursor.execute('UPDATE drills SET status = ?, submitted_at = ?, reaction_time_seconds = ?, compromised_details = ? WHERE token = ?', (new_status, now, reaction_time, json.dumps(compromised_data), token))
        compromised_payload = compromised_data
    elif action == 'report_phishing':
        new_status = 'reported'
        cursor.execute('UPDATE drills SET status = ?, reported_at = ?, reaction_time_seconds = ? WHERE token = ?', (new_status, now, reaction_time, token))
    elif action == 'verify_secondary':
        new_status = 'verified'
        cursor.execute('UPDATE drills SET status = ?, reaction_time_seconds = ? WHERE token = ?', (new_status, reaction_time, token))
    elif action == 'complete_training':
        new_status = 'trained'
        cursor.execute('UPDATE drills SET status = ?, trained_at = ? WHERE token = ?', (new_status, now, token))

    conn.commit()
    conn.close()

    drill = next((d for d in DYNAMIC_DRILLS if d['id'] == session.get('drill_id')), None)

    return jsonify({
        "success": True,
        "status": new_status,
        "action": action,
        "reactionTime": reaction_time,
        "compromisedPayload": compromised_payload,
        "drill": drill,
        "teachableTakeaways": drill.get('indicators', []) if drill else []
    })


@app.route('/api/drills/analytics', methods=['GET'])
def get_drill_analytics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as total FROM drills')
    total = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('clicked', 'compromised', 'reported', 'verified', 'opened', 'trained')")
    opened = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('clicked', 'compromised', 'trained')")
    clicked = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('compromised', 'trained')")
    compromised = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('reported', 'verified')")
    reported = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status = 'trained'")
    trained = cursor.fetchone()['cnt']

    conn.close()

    return jsonify({
        "success": True,
        "totalDispatched": total,
        "openedCount": opened,
        "clickedCount": clicked,
        "compromisedCount": compromised,
        "reportedCount": reported,
        "trainedCount": trained,
        "openRate": round((opened / total * 100), 1) if total else 0,
        "clickRate": round((clicked / total * 100), 1) if total else 0,
        "compromiseRate": round((compromised / total * 100), 1) if total else 0,
        "reportingRate": round((reported / total * 100), 1) if total else 0,
        "trainingRate": round((trained / total * 100), 1) if total else 0
    })


# ============================================================================
# ENTERPRISE ADMIN CONSOLE & MONITORING APIS
# ============================================================================

@app.route('/api/admin/emails', methods=['GET'])
def admin_get_emails():
    mailboxes = get_directadmin_mailboxes()
    return jsonify({
        "success": True,
        "domain": DA_DOMAIN,
        "count": len(mailboxes),
        "mailboxes": mailboxes
    })


@app.route('/api/admin/emails/create', methods=['POST'])
def admin_create_email():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    quota = int(data.get('quota', 500))

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required"}), 400

    clean_user = username.split('@')[0].strip().lower()
    success, msg = create_directadmin_mailbox(clean_user, password, quota)
    if success:
        return jsonify({
            "success": True,
            "message": f"DirectAdmin mailbox {clean_user}@{DA_DOMAIN} created successfully",
            "email": f"{clean_user}@{DA_DOMAIN}"
        })
    else:
        return jsonify({
            "success": False,
            "message": f"Failed to create DirectAdmin mailbox: {msg}"
        }), 400


@app.route('/api/admin/drills', methods=['GET'])
def admin_get_drills():
    status = request.args.get('status')
    search = request.args.get('search', '').strip().lower()

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM drills WHERE 1=1"
    params = []

    if status and status != 'all':
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND (LOWER(target_name) LIKE ? OR LOWER(target_email) LIKE ? OR LOWER(department) LIKE ?)"
        wild = f"%{search}%"
        params.extend([wild, wild, wild])

    query += " ORDER BY created_at DESC LIMIT 300"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    drills_list = []
    base_url = os.environ.get('BASE_URL', 'https://menteko.savethegeneration.com.et')

    for r in rows:
        d = dict(r)
        d['drillUrl'] = f"{base_url}/drill?token={d['token']}&drill={d['drill_id']}"
        if d.get('compromised_details') and isinstance(d['compromised_details'], str):
            try:
                d['compromised_details'] = json.loads(d['compromised_details'])
            except Exception:
                pass
        drills_list.append(d)

    return jsonify({
        "success": True,
        "count": len(drills_list),
        "drills": drills_list
    })


@app.route('/api/admin/drills/stats', methods=['GET'])
def admin_get_stats():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM drills")
    total = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('opened', 'clicked', 'compromised', 'reported', 'trained')")
    opened = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('clicked', 'compromised', 'trained')")
    clicked = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status IN ('compromised', 'trained')")
    compromised = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status = 'reported'")
    reported = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM drills WHERE status = 'trained'")
    trained = cursor.fetchone()['cnt']

    cursor.execute("SELECT AVG(reaction_time_seconds) as avg_react FROM drills WHERE reaction_time_seconds IS NOT NULL")
    avg_react_row = cursor.fetchone()
    avg_reaction_time = round(avg_react_row['avg_react'], 1) if avg_react_row and avg_react_row['avg_react'] else 0

    cursor.execute("SELECT department, COUNT(*) as cnt, SUM(CASE WHEN status IN ('compromised', 'trained') THEN 1 ELSE 0 END) as comp_cnt FROM drills GROUP BY department")
    dept_rows = cursor.fetchall()
    dept_stats = []
    for r in dept_rows:
        d_name = r['department'] or 'General'
        d_total = r['cnt']
        d_comp = r['comp_cnt'] or 0
        dept_stats.append({
            "department": d_name,
            "total": d_total,
            "compromised": d_comp,
            "riskRate": round((d_comp / d_total * 100), 1) if d_total else 0
        })

    cursor.execute("SELECT * FROM drills ORDER BY created_at DESC LIMIT 6")
    recent = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "metrics": {
            "totalDispatched": total,
            "openedCount": opened,
            "openRate": round((opened / total * 100), 1) if total else 0,
            "clickedCount": clicked,
            "clickRate": round((clicked / total * 100), 1) if total else 0,
            "compromisedCount": compromised,
            "compromiseRate": round((compromised / total * 100), 1) if total else 0,
            "reportedCount": reported,
            "reportingRate": round((reported / total * 100), 1) if total else 0,
            "trainedCount": trained,
            "trainingRate": round((trained / total * 100), 1) if total else 0,
            "avgReactionTime": avg_reaction_time
        },
        "departmentBreakdown": dept_stats,
        "recentActivity": recent
    })


@app.route('/api/admin/drills/launch', methods=['POST'])
def admin_launch_drills():
    data = request.get_json(silent=True) or {}
    drill_id = data.get('drillId') or 'drill-bank-webmail'
    sender_email = data.get('senderEmail') or f"security-alerts@{DA_DOMAIN}"
    send_email = bool(data.get('sendEmail', True))
    targets = data.get('targets', [])

    if not targets:
        return jsonify({"success": False, "message": "At least one target employee is required"}), 400

    drill = next((d for d in DYNAMIC_DRILLS if d['id'] == drill_id), None)
    if not drill:
        return jsonify({"success": False, "message": "Invalid drill scenario"}), 404

    base_url = os.environ.get('BASE_URL', 'https://menteko.savethegeneration.com.et')
    now = datetime.now(timezone.utc).isoformat()
    results = []

    conn = get_db()
    cursor = conn.cursor()

    for t in targets:
        target_name = (t.get('name') or 'Team Member').strip()
        target_email = (t.get('email') or '').strip()
        dept = (t.get('department') or 'General').strip()

        token = str(uuid.uuid4())
        drill_url = f"{base_url}/drill?token={token}&drill={drill_id}"

        cursor.execute('''
            INSERT INTO drills
            (id, token, drill_id, target_email, target_name, sender_email, department, status, reaction_time_seconds, device_info, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (str(uuid.uuid4()), token, drill_id, target_email or None, target_name, sender_email, dept, 'dispatched', None, 'DirectAdmin MTA', now))

        email_dispatched = False
        email_err = None
        if target_email:
            tmpl = drill.get('emailTemplate') or {
                "subject": f"Action Required: {drill.get('title')}",
                "body": f"Dear {target_name},\n\nPlease complete the authorized security verification drill using the link below:\n\n",
                "callToAction": "Verify Credentials"
            }
            html_email = format_phishing_email_html(
                subject=tmpl.get('subject', 'Security Notice'),
                body=tmpl.get('body', ''),
                target_name=target_name,
                call_to_action=tmpl.get('callToAction', 'Review Notification'),
                drill_url=drill_url,
                token=token,
                sender_email=sender_email,
                base_url=base_url
            )
            try:
                send_smtp_email(
                    to_email=target_email,
                    subject=tmpl.get('subject', 'Security Notice'),
                    html_content=html_email,
                    text_content=f"{tmpl.get('body', '')}\n\nDrill Link: {drill_url}",
                    from_name=tmpl.get('fromName') or drill.get('title', 'Cyber Defense Team'),
                    from_email=sender_email
                )
                email_dispatched = True
            except Exception as e:
                email_err = str(e)
                app.logger.error(f"Admin drill email delivery error to {target_email}: {e}")

        results.append({
            "token": token,
            "drillUrl": drill_url,
            "name": target_name,
            "email": target_email,
            "department": dept,
            "senderEmail": sender_email,
            "emailSent": email_dispatched,
            "emailError": email_err
        })

    conn.commit()
    conn.close()

    total_sent = sum(1 for r in results if r['emailSent'])
    return jsonify({
        "success": True,
        "message": f"Successfully dispatched {total_sent} of {len(results)} phishing simulation email(s) via DirectAdmin MTA",
        "results": results
    })


@app.route('/api/drills/track-pixel', methods=['GET'])
def drill_track_pixel():
    token = request.args.get('token')
    if token:
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('SELECT status, created_at, opened_at FROM drills WHERE token = ?', (token,))
            row = cursor.fetchone()
            if row and row['status'] == 'dispatched':
                now_dt = datetime.now(timezone.utc)
                now = now_dt.isoformat()
                rx = None
                try:
                    c_time = datetime.fromisoformat(row['created_at'].replace('Z', '+00:00'))
                    rx = max(1, int((now_dt - c_time).total_seconds()))
                except Exception:
                    rx = 12
                cursor.execute('''
                    UPDATE drills
                    SET status = 'opened', opened_at = ?, reaction_time_seconds = COALESCE(reaction_time_seconds, ?)
                    WHERE token = ?
                ''', (now, rx, token))
                conn.commit()
            conn.close()
        except Exception as e:
            app.logger.warning(f"Track pixel telemetry error: {e}")

    pixel_gif = (
        b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff'
        b'\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00'
        b'\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    )
    res = make_response(pixel_gif)
    res.headers['Content-Type'] = 'image/gif'
    res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    res.headers['Pragma'] = 'no-cache'
    return res


@app.route('/api/admin/drills/<drill_id>/resend', methods=['POST'])
def admin_resend_drill(drill_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM drills WHERE id = ? OR token = ?', (drill_id, drill_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Drill record not found"}), 404

    drill_record = dict(row)
    target_email = drill_record.get('target_email')
    if not target_email:
        conn.close()
        return jsonify({"success": False, "message": "Drill record has no target email"}), 400

    drill = next((d for d in DYNAMIC_DRILLS if d['id'] == drill_record.get('drill_id')), None) or DYNAMIC_DRILLS[0]
    sender_email = drill_record.get('sender_email') or f"security-alerts@{DA_DOMAIN}"
    base_url = os.environ.get('BASE_URL', 'https://menteko.savethegeneration.com.et')
    drill_url = f"{base_url}/drill?token={drill_record['token']}&drill={drill['id']}"

    tmpl = drill.get('emailTemplate') or {
        "subject": f"Action Required: {drill.get('title')}",
        "body": f"Dear {drill_record.get('target_name', 'Team Member')},\n\nPlease review the urgent notification below:\n\n",
        "callToAction": "Review Notification"
    }

    html_email = format_phishing_email_html(
        subject=tmpl.get('subject', 'Security Notice'),
        body=tmpl.get('body', ''),
        target_name=drill_record.get('target_name', 'Team Member'),
        call_to_action=tmpl.get('callToAction', 'Review Notification'),
        drill_url=drill_url,
        token=drill_record['token'],
        sender_email=sender_email,
        base_url=base_url
    )

    try:
        send_smtp_email(
            to_email=target_email,
            subject=tmpl.get('subject', 'Security Notice'),
            html_content=html_email,
            text_content=f"{tmpl.get('body', '')}\n\nDrill Link: {drill_url}",
            from_name=tmpl.get('fromName') or drill.get('title', 'Cyber Defense Team'),
            from_email=sender_email
        )
        cursor.execute("UPDATE drills SET status = 'dispatched', reaction_time_seconds = NULL WHERE id = ?", (drill_record['id'],))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Phishing simulation email re-delivered to {target_email} via DirectAdmin SMTP."})
    except Exception as e:
        conn.close()
        return jsonify({"success": False, "message": f"Delivery failed: {e}"}), 500


@app.route('/api/admin/drills/<drill_id>', methods=['DELETE'])
def admin_delete_drill(drill_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM drills WHERE id = ? OR token = ?", (drill_id, drill_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Drill record removed"})


# ============================================================================
# AUTOMATIC DEPLOYMENT / RELOAD WEBHOOK (PYTHONANYWHERE)
# ============================================================================
@app.route('/api/deploy', methods=['GET', 'POST'])
def auto_deploy():
    token = request.args.get('token') or (request.get_json(silent=True) or {}).get('token')
    expected_token = os.environ.get('DEPLOY_TOKEN', 'menteko-deploy-2026')

    if token != expected_token:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    try:
        repo_dir = os.path.dirname(os.path.abspath(__file__))
        result = subprocess.run(
            ['git', 'pull', 'origin', 'fitse'],
            cwd=repo_dir,
            capture_output=True,
            text=True,
            timeout=35
        )

        # If running on DirectAdmin shared hosting, sync frontend dist to public_html
        pub_html = os.path.expanduser('~/domains/menteko.savethegeneration.com.et/public_html')
        if os.path.isdir(pub_html):
            frontend_dist_dir = os.path.join(repo_dir, 'frontend', 'dist')
            if os.path.isdir(frontend_dist_dir):
                subprocess.run(
                    ['rsync', '-a', '--exclude=api', '--exclude=.htaccess', frontend_dist_dir + '/', pub_html + '/'],
                    check=False
                )

        # Touch WSGI / Passenger files to trigger hot reload
        wsgi_candidates = [
            '/var/www/natepythonware_pythonanywhere_com_wsgi.py',
            os.path.join(repo_dir, 'passenger_wsgi.py'),
            os.path.join(repo_dir, 'wsgi_deploy.py'),
            os.path.join(repo_dir, 'tmp', 'restart.txt')
        ]
        reloaded = []
        for p in wsgi_candidates:
            try:
                restart_dir = os.path.dirname(p)
                if restart_dir and not os.path.isdir(restart_dir):
                    if 'tmp' in p:
                        os.makedirs(restart_dir, exist_ok=True)
                if restart_dir and os.path.isdir(restart_dir):
                    if (os.path.exists(p) and os.access(p, os.W_OK)) or (not os.path.exists(p) and os.access(restart_dir, os.W_OK)):
                        with open(p, 'a'):
                            os.utime(p, None)
                        reloaded.append(p)
            except Exception:
                pass

        return jsonify({
            "success": True,
            "git_stdout": result.stdout,
            "git_stderr": result.stderr,
            "reloaded_files": reloaded
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================================
# FRONTEND SPA STATIC FILE SERVING
# ============================================================================

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.exists(os.path.join(assets_dir, filename)):
        return send_from_directory(assets_dir, filename)
    abort(404)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    # Don't intercept API routes that 404
    if path.startswith('api/') or path == 'api':
        return jsonify({"success": False, "message": "API route not found"}), 404

    # Check if a static file directly in dist exists (e.g. logo.png, hero-bg.mp4)
    file_path = os.path.join(FRONTEND_DIST, path)
    if path and os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIST, path)

    # Fallback to index.html for client-side React Router navigation
    if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')

    return "Frontend bundle not found. Run 'npm run build' inside frontend/.", 500


# ============================================================================
# LOCAL ENTRYPOINT
# ============================================================================
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"[pythonanywhere] MENTEKO Flask server running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
