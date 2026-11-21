#!/usr/bin/env python3
"""
LearnIQ – Adaptive AI Exam-Prep Tutor with a Learner Model
Backend API Server & Static File Host
"""

import sys
import os
import json
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver
import time

PORT = 5173
HOST = "0.0.0.0"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
STATE_FILE = os.path.join(DATA_DIR, "learniq_state.json")

# In-memory / persistent cache for server session
def load_persisted_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[LearnIQ Server] Error loading state: {e}")
    return None

def save_persisted_state(state):
    try:
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
    except Exception as e:
        print(f"[LearnIQ Server] Error saving state: {e}")

class LearnIQRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def _read_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            raw = self.rfile.read(content_length).decode("utf-8")
            try:
                return json.loads(raw)
            except Exception:
                return {}
        return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/status":
            self._send_json({
                "status": "online",
                "app": "LearnIQ Adaptive AI Exam-Prep",
                "version": "1.0.0",
                "time": time.time(),
                "storage": "Local & Server Sync Active"
            })
            return

        elif path == "/api/state":
            state = load_persisted_state()
            self._send_json({"state": state})
            return

        elif path == "/api/teacher/cohort":
            cohort = {
                "totalStudents": 42,
                "classAverageMastery": 68.4,
                "classAccuracy": 73.1,
                "atRiskCount": 4,
                "mostDifficultConcepts": [
                    {"concept": "Recursion", "avgMastery": 38.5, "errorRate": 61.5, "flaggedMisconceptions": 29},
                    {"concept": "Linked Lists", "avgMastery": 45.2, "errorRate": 54.8, "flaggedMisconceptions": 22},
                    {"concept": "Stacks & Queues", "avgMastery": 56.0, "errorRate": 44.0, "flaggedMisconceptions": 16},
                    {"concept": "Binary Search", "avgMastery": 62.1, "errorRate": 37.9, "flaggedMisconceptions": 14},
                    {"concept": "Arrays & Bounds", "avgMastery": 69.8, "errorRate": 30.2, "flaggedMisconceptions": 11}
                ],
                "commonMisconceptions": [
                    {"name": "Missing Recursion Base Case", "count": 28, "concept": "Recursion", "severity": "Critical"},
                    {"name": "Array Off-by-One Length vs Index", "count": 24, "concept": "Arrays", "severity": "Moderate"},
                    {"name": "NullPointerException on Empty Linked List", "count": 19, "concept": "Linked Lists", "severity": "High"},
                    {"name": "Pass-by-Value Reference Mutation Confusion", "count": 15, "concept": "Functions", "severity": "Moderate"},
                    {"name": "Stack Overflow from Infinite Loop Recursion", "count": 13, "concept": "Recursion", "severity": "High"}
                ],
                "atRiskStudents": [
                    {"id": "s101", "name": "Marcus Vance", "email": "marcus@campus.edu", "weakestConcept": "Recursion", "mastery": 32, "misconceptions": 4, "lastActive": "2 hours ago", "status": "Needs Immediate Intervention"},
                    {"id": "s102", "name": "Elena Rostova", "email": "elena@campus.edu", "weakestConcept": "Linked Lists", "mastery": 39, "misconceptions": 3, "lastActive": "Yesterday", "status": "Needs Review"},
                    {"id": "s103", "name": "David Kim", "email": "dkim@campus.edu", "weakestConcept": "Recursion", "mastery": 36, "misconceptions": 3, "lastActive": "3 hours ago", "status": "Struggling with Base Cases"},
                    {"id": "s104", "name": "Chloe Bennett", "email": "chloeb@campus.edu", "weakestConcept": "Sorting", "mastery": 44, "misconceptions": 2, "lastActive": "4 hours ago", "status": "Declining Accuracy"}
                ]
            }
            self._send_json(cohort)
            return

        # Default static file handler
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_body()

        if path == "/api/sync-state":
            save_persisted_state(body)
            self._send_json({"success": True, "saved_at": time.time()})
            return

        elif path == "/api/reset-demo":
            if os.path.exists(STATE_FILE):
                os.remove(STATE_FILE)
            self._send_json({"success": True, "message": "Demo state reset to defaults"})
            return

        elif path == "/api/tutor":
            # AI Tutor endpoint with context injection
            user_message = body.get("message", "")
            student_context = body.get("context", {})
            weak_concepts = student_context.get("weakConcepts", ["Recursion"])
            mastery = student_context.get("mastery", {})
            
            # Smart Socratic response generator
            response = self._generate_tutor_response(user_message, weak_concepts, student_context)
            self._send_json({"response": response})
            return

        elif path == "/api/misconception-detect":
            question_id = body.get("questionId")
            selected_option = body.get("selectedOption")
            student_reasoning = body.get("studentReasoning", "")
            concept = body.get("concept", "Recursion")

            analysis = self._analyze_misconception(question_id, selected_option, student_reasoning, concept)
            self._send_json(analysis)
            return

        self._send_json({"error": "Endpoint not found"}, status=404)

    def _generate_tutor_response(self, query, weak_concepts, context):
        q = query.lower()
        weak_str = ", ".join(weak_concepts) if weak_concepts else "Recursion"

        if "recursion" in q or "base case" in q:
            return (
                "Great question! In recursion, imagine you're standing in front of Russian nesting dolls (Matryoshka). "
                "Each doll opens up another doll inside it (the recursive step). But what happens if you never reach the solid wooden doll at the center? "
                "You would keep searching forever — that's a **StackOverflowError**!\n\n"
                "The solid center doll is your **Base Case**: a condition that returns a concrete answer without calling itself again. "
                "For example:\n```java\nif (n <= 1) return 1; // Base case!\nreturn n * factorial(n - 1); // Recursive call\n```\n"
                "Would you like to trace what happens to the call stack when `factorial(3)` runs?"
            )
        elif "stack" in q or "queue" in q:
            return (
                "Think of a **Stack** like a stack of cafeteria trays: the last one placed on top is the first one taken off (**LIFO**: Last-In, First-Out). "
                "A **Queue**, on the other hand, is like a movie ticket line: the first person to arrive is the first served (**FIFO**: First-In, First-Out).\n\n"
                "In Java:\n- Use `Deque<T> stack = new ArrayDeque<>();` for Stacks (`push()`, `pop()`)\n"
                "- Use `Queue<T> queue = new LinkedList<>();` for Queues (`offer()`, `poll()`)\n\n"
                "Which problem are you tackling right now?"
            )
        elif "linked list" in q:
            return (
                "With an Array, elements sit right next to each other in memory like numbered lockers. "
                "With a **Linked List**, each node lives wherever there's free memory and holds a treasure map pointer (`next`) to the next node!\n\n"
                "The biggest pitfall students encounter is attempting to read `current.next` when `current` is already `null` — this throws a `NullPointerException`. "
                "Always check `while (current != null)` before dereferencing!"
            )
        elif "weak" in q or "mistake" in q or "progress" in q:
            return (
                f"Based on your Learner Model, your current focus areas are **{weak_str}**. "
                f"You have attempted {context.get('totalQuestions', 12)} questions with an accuracy of {context.get('accuracy', 65)}%.\n\n"
                "I suggest we solve one targeted scaffolded problem on **Recursion Base Cases** right now. Ready for a quick challenge?"
            )
        else:
            return (
                f"Hello! I am Socrates, your LearnIQ Adaptive AI Tutor. I see you're currently sharpening your Java & DSA skills, "
                f"with current focus on **{weak_str}**.\n\n"
                "I believe in understanding *why* things work, not just memorizing syntax. "
                "Feel free to ask me to explain any error, show an interactive code trace, break down a tricky algorithm, or quiz you!"
            )

    def _analyze_misconception(self, q_id, selected_opt, reasoning, concept):
        # Default smart pedagogical analyzer
        return {
            "hasMisconception": True,
            "misconceptionKey": "RECURSION_MISSING_BASE_CASE",
            "title": "Unterminated Recursive Call / Missing Base Case",
            "category": "Control Flow & Call Stack",
            "explanation": "You recognized the recursive formula, but omitted or misplaced the terminating condition. Without checking for the boundary condition first, the method invokes itself indefinitely until the JVM call stack memory is exhausted.",
            "counterExample": {
                "incorrectCode": "// Flawed Logic:\nint sum(int n) {\n    return n + sum(n - 1); // Never stops!\n}",
                "correctCode": "// Correct Logic:\nint sum(int n) {\n    if (n <= 0) return 0; // Base case prevents StackOverflow\n    return n + sum(n - 1);\n}",
                "trace": "sum(2) -> 2 + sum(1) -> 2 + 1 + sum(0) -> returns 0 -> unwinds cleanly to 3."
            },
            "targetedRemediation": "Write the base case at line 1 of any recursive method before calculating recursive steps.",
            "recommendedExercise": "Identify the base case for reversing a Linked List recursively.",
            "resolved": False
        }


def run_server(port=PORT):
    handler = LearnIQRequestHandler
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    # Try preferred port, fallback to alternative if busy
    target_port = port
    for p in [target_port, 5174, 5175, 8080, 8000]:
        try:
            with socketserver.TCPServer((HOST, p), handler) as httpd:
                print(f"================================================================")
                print(f"🚀 LearnIQ – Adaptive AI Exam-Prep Server Running!")
                print(f"👉 Local URL: http://localhost:{p}")
                print(f"👉 Network:   http://{HOST}:{p}")
                print(f"📁 Serving:   {BASE_DIR}")
                print(f"🧠 Learner Model Storage: {DATA_DIR}")
                print(f"================================================================")
                httpd.serve_forever()
                break
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"[LearnIQ] Port {p} busy, trying next port...")
                continue
            else:
                raise e

if __name__ == "__main__":
    cli_port = PORT
    if len(sys.argv) > 1:
        for i, arg in enumerate(sys.argv):
            if arg == "--port" and i + 1 < len(sys.argv):
                cli_port = int(sys.argv[i + 1])
    run_server(cli_port)
