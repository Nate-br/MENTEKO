import os
import sys
import json
import sqlite3
import uuid
import subprocess
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_from_directory, abort

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

    conn.commit()

    # Seed scenarios if table is empty
    cursor.execute('SELECT COUNT(*) as cnt FROM scenarios')
    if cursor.fetchone()['cnt'] == 0:
        seed_scenarios(conn)

    conn.close()


def seed_scenarios(conn):
    cursor = conn.cursor()
    scenarios = [
        {
            "id": "scen-phishing-1",
            "title": "Urgent Account Verification",
            "category": "phishing",
            "difficulty": "beginner",
            "format": "MESSAGE",
            "context": "You receive an email while checking your inbox on a weekday morning. Nothing else in your account activity looks unusual.",
            "content": {
                "sender": "security-alert@meskelbank-verify.test",
                "subject": "Urgent: Account Verification Required",
                "body": "Your account requires verification. We detected unusual sign-in activity. Verify immediately to avoid restrictions on your account within 24 hours.",
                "callToAction": "VERIFY ACCOUNT"
            },
            "indicators": [
                {"id": "ind-1", "title": "Urgency", "description": "The message pressures you to act within a strict, short deadline."},
                {"id": "ind-2", "title": "Suspicious sender", "description": "The domain 'meskelbank-verify.test' mimics a bank but is not the official domain."},
                {"id": "ind-3", "title": "External action", "description": "The button pushes you toward an unverified link instead of your normal banking app."},
                {"id": "ind-4", "title": "Threat language", "description": "The message threatens 'restrictions' to create fear and rush your decision."}
            ],
            "options": [
                {"id": "opt-open", "label": "OPEN / CONTINUE", "isCorrect": False},
                {"id": "opt-verify", "label": "VERIFY FIRST", "isCorrect": True},
                {"id": "opt-report", "label": "REPORT", "isCorrect": False}
            ],
            "explanation": "This message uses urgency and a lookalike domain to rush you into clicking before you think. Verifying first — by checking the sender domain and contacting the organization through a known, separate channel — neutralizes the pressure.",
            "betterResponse": "STOP before clicking. CHECK the sender domain. VERIFY through the official app or a known phone number. REPORT the message if it looks fraudulent.",
            "isActive": 1
        },
        {
            "id": "scen-impersonation-1",
            "title": "The \"Bank Officer\" Call",
            "category": "impersonation",
            "difficulty": "intermediate",
            "format": "CALL TRANSCRIPT",
            "context": "Your phone rings from an unknown number. The caller identifies themselves as a fraud-prevention officer from your bank.",
            "content": {
                "sender": "+251-9XX-XXX-XXX (unlisted)",
                "subject": "Incoming call: \"Fraud Prevention Department\"",
                "body": "Caller: \"This is the fraud prevention team. We've flagged a suspicious transfer on your account. To cancel it, I need you to confirm your PIN and the code that was just sent to your phone.\"",
                "callToAction": "PROVIDE PIN & CODE"
            },
            "indicators": [
                {"id": "ind-1", "title": "Unverifiable caller identity", "description": "Anyone can claim to work for a bank on an inbound call; the number is not independently confirmed."},
                {"id": "ind-2", "title": "Request for secrets", "description": "No legitimate bank employee asks for your PIN or one-time verification code."},
                {"id": "ind-3", "title": "Manufactured emergency", "description": "A 'suspicious transfer' is used to justify an unusually urgent request."},
                {"id": "ind-4", "title": "Pressure to stay on the line", "description": "The caller keeps you engaged so you don't pause to verify independently."}
            ],
            "options": [
                {"id": "opt-open", "label": "PROVIDE THE CODE", "isCorrect": False},
                {"id": "opt-verify", "label": "HANG UP & VERIFY", "isCorrect": True},
                {"id": "opt-report", "label": "REPORT", "isCorrect": False}
            ],
            "explanation": "A real fraud team will never ask for your PIN or a one-time code over the phone. The safest response is to end the call and independently contact your bank using a number you already trust, not one provided by the caller.",
            "betterResponse": "STOP giving information. CHECK by hanging up. VERIFY using the number on your card or official app. REPORT the call to your bank and, if needed, authorities.",
            "isActive": 1
        },
        {
            "id": "scen-payment-1",
            "title": "Advance Fee \"Refund\"",
            "category": "payment-fraud",
            "difficulty": "intermediate",
            "format": "MESSAGE",
            "context": "A message arrives claiming you are owed a refund from a service you used months ago. It asks you to pay a small fee first to \"release\" the funds.",
            "content": {
                "sender": "refunds@paylink-support.test",
                "subject": "You have a pending refund of 4,200 ETB",
                "body": "Our records show a pending refund of 4,200 ETB on your account. To release the funds today, send a 150 ETB processing fee to the agent code below.",
                "callToAction": "SEND PROCESSING FEE"
            },
            "indicators": [
                {"id": "ind-1", "title": "Pay to receive money", "description": "Legitimate refunds are never released by first sending the recipient money."},
                {"id": "ind-2", "title": "Unfamiliar reference", "description": "There is no matching transaction you can independently recall or look up."},
                {"id": "ind-3", "title": "Same-day pressure", "description": "'Today' framing discourages you from checking your actual account history first."},
                {"id": "ind-4", "title": "Informal payment channel", "description": "Requesting payment to an 'agent code' bypasses normal, traceable payment channels."}
            ],
            "options": [
                {"id": "opt-open", "label": "SEND THE FEE", "isCorrect": False},
                {"id": "opt-verify", "label": "VERIFY FIRST", "isCorrect": True},
                {"id": "opt-report", "label": "REPORT", "isCorrect": False}
            ],
            "explanation": "Any request to pay money in order to receive money is a classic advance-fee fraud pattern. Verifying directly with the organization named — through official channels, not the contact info in the message — exposes the scam before any money moves.",
            "betterResponse": "STOP before paying. CHECK your real transaction history. VERIFY the refund with the official provider. REPORT the message as fraud.",
            "isActive": 1
        },
        {
            "id": "scen-evidence-1",
            "title": "The Forwarded Payment Screenshot",
            "category": "fake-evidence",
            "difficulty": "advanced",
            "format": "CHAT + IMAGE",
            "context": "A buyer for an item you're selling online sends a screenshot that appears to show a completed bank transfer, then asks you to ship immediately.",
            "content": {
                "sender": "Buyer (unknown contact)",
                "subject": "Payment sent — screenshot attached",
                "body": "Buyer: \"Just sent the payment, here's the screenshot as proof. Please ship the item now, I'm in a rush and need it before my flight.\"",
                "meta": {"attachment": "transfer_receipt.png (unverified)"},
                "callToAction": "SHIP ITEM NOW"
            },
            "indicators": [
                {"id": "ind-1", "title": "Screenshot as proof", "description": "Images of transfers can be easily edited and are not confirmation that funds arrived."},
                {"id": "ind-2", "title": "No funds check", "description": "The request skips checking your actual account balance or transaction notification."},
                {"id": "ind-3", "title": "Shipping urgency", "description": "A rushed deadline discourages you from waiting for the transfer to actually settle."},
                {"id": "ind-4", "title": "New, unverified contact", "description": "There is no prior trusted relationship with this buyer to rely on."}
            ],
            "options": [
                {"id": "opt-open", "label": "SHIP IMMEDIATELY", "isCorrect": False},
                {"id": "opt-verify", "label": "VERIFY IN YOUR ACCOUNT", "isCorrect": True},
                {"id": "opt-report", "label": "REPORT", "isCorrect": False}
            ],
            "explanation": "A transfer screenshot alone proves nothing — only your own account activity confirms a payment actually cleared. Waiting to verify the real balance or notification protects you from shipping against a fabricated payment.",
            "betterResponse": "STOP before shipping. CHECK your account directly, not the image. VERIFY the funds have actually settled. REPORT the buyer if the 'proof' doesn't match reality.",
            "isActive": 1
        },
        {
            "id": "scen-social-1",
            "title": "The \"IT Support\" Message",
            "category": "social-engineering",
            "difficulty": "beginner",
            "format": "CHAT MESSAGE",
            "context": "A message appears in your workplace chat from an account styled like your IT helpdesk, referencing a ticket you don't remember opening.",
            "content": {
                "sender": "IT-Helpdesk (internal chat)",
                "subject": "Quick favor before I close your ticket",
                "body": "Hi, this is IT support. We're finishing up a system migration and need your login one more time to confirm your account transferred correctly. Can you send your username and password so I can check?",
                "callToAction": "REPLY WITH CREDENTIALS"
            },
            "indicators": [
                {"id": "ind-1", "title": "Direct credential request", "description": "No legitimate IT team needs your plaintext password to 'check' anything."},
                {"id": "ind-2", "title": "Manufactured familiarity", "description": "References to a 'ticket' and 'migration' create false context to seem routine."},
                {"id": "ind-3", "title": "Framed as a small favor", "description": "Minimizing the request ('quick favor') lowers your guard."},
                {"id": "ind-4", "title": "Unverified identity", "description": "The display name is not confirmed against your organization's real directory."}
            ],
            "options": [
                {"id": "opt-open", "label": "SEND CREDENTIALS", "isCorrect": False},
                {"id": "opt-verify", "label": "VERIFY THROUGH IT", "isCorrect": True},
                {"id": "opt-report", "label": "REPORT", "isCorrect": False}
            ],
            "explanation": "Social engineering relies on borrowed authority and small, 'reasonable-sounding' asks. Verifying through a separate, known channel — like calling your real IT desk — breaks the impersonation immediately.",
            "betterResponse": "STOP sharing credentials in chat. CHECK the sender against your real directory. VERIFY by contacting IT through a known channel. REPORT the message to security.",
            "isActive": 1
        }
    ]

    now = datetime.now(timezone.utc).isoformat()
    for s in scenarios:
        cursor.execute('''
        INSERT OR REPLACE INTO scenarios
        (id, title, category, difficulty, format, context, content, indicators, options, explanation, betterResponse, isActive, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            s["id"], s["title"], s["category"], s["difficulty"], s["format"],
            s["context"], json.dumps(s["content"]), json.dumps(s["indicators"]),
            json.dumps(s["options"]), s["explanation"], s["betterResponse"],
            s["isActive"], now
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

        # Touch PythonAnywhere WSGI file to trigger hot reload
        wsgi_candidates = [
            '/var/www/natepythonware_pythonanywhere_com_wsgi.py',
            os.path.join(repo_dir, 'wsgi_deploy.py')
        ]
        reloaded = []
        for p in wsgi_candidates:
            if os.path.exists(p):
                os.utime(p, None)
                reloaded.append(p)

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
