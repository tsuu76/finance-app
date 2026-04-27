"""
SQLite database — stores monthly expense history for insights comparison.
Simple key-value style: one row per month per category.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "cashflo.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS monthly_expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                category TEXT NOT NULL,
                amount REAL NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS monthly_summary (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                income REAL NOT NULL,
                total_expenses REAL NOT NULL,
                monthly_savings REAL NOT NULL,
                created_at TEXT DEFAULT (datetime('now')),
                UNIQUE(year, month)
            )
        """)
        conn.commit()


def save_month(year: int, month: int, income: float, expenses: list[dict]):
    """Upsert this month's data into history."""
    with get_conn() as conn:
        # Clear existing entries for this month
        conn.execute(
            "DELETE FROM monthly_expenses WHERE year=? AND month=?", (year, month)
        )
        for e in expenses:
            conn.execute(
                "INSERT INTO monthly_expenses (year, month, category, amount) VALUES (?,?,?,?)",
                (year, month, e["category"], e["amount"]),
            )
        total = sum(e["amount"] for e in expenses)
        savings = income - total
        conn.execute(
            """INSERT INTO monthly_summary (year, month, income, total_expenses, monthly_savings)
               VALUES (?,?,?,?,?)
               ON CONFLICT(year, month) DO UPDATE SET
                 income=excluded.income,
                 total_expenses=excluded.total_expenses,
                 monthly_savings=excluded.monthly_savings""",
            (year, month, income, total, savings),
        )
        conn.commit()


def get_previous_month_expenses(year: int, month: int) -> list[dict]:
    """Return expense rows for the month before the given one."""
    if month == 1:
        prev_year, prev_month = year - 1, 12
    else:
        prev_year, prev_month = year, month - 1

    with get_conn() as conn:
        rows = conn.execute(
            "SELECT category, amount FROM monthly_expenses WHERE year=? AND month=?",
            (prev_year, prev_month),
        ).fetchall()
    return [{"category": r["category"], "amount": r["amount"]} for r in rows]


def get_history(limit: int = 6) -> list[dict]:
    """Return last N months of summary data."""
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT year, month, income, total_expenses, monthly_savings
               FROM monthly_summary
               ORDER BY year DESC, month DESC
               LIMIT ?""",
            (limit,),
        ).fetchall()
    return [dict(r) for r in rows]
