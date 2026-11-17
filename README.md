# Cynbit — Interactive Project Scope & Lead Conversion Engine

> **Full Stack Developer Intern Assessment** | Submitted by **Dhruv Joshi**

An interactive, full-stack **Project Cost & Timeline Estimator** paired with a **Real-Time Lead Pipeline Portal**, built to upgrade Cynbit's static lead-capture flow into a high-converting, self-serve client scoping experience.

---

## Live Links

* **Live Prototype (Frontend):** https://cynbit-project-estimator-seven.vercel.app
* **Live REST API (Backend):** https://cynbit-project-estimator-pv4t.onrender.com/api/leads/
* **GitHub Repository:** https://github.com/joshidhruv951-spec/cynbit-project-estimator

---

## Problem Statement & Audit Findings

Static "Contact Us" forms on agency and technology websites create friction for both visitors and engineering/sales teams:
1. **High Visitor Drop-off:** Prospective clients hesitate to reach out without immediate ballpark visibility into project budgets and timelines.
2. **Unqualified Inquiries:** Teams spend hours on initial calls just to gather basic technical scope.
3. **Fragmented Lead Tracking:** Inquiries sit in email inboxes instead of a structured, actionable pipeline.

### The Solution
* **Client-Facing Interactive Configurator:** Visitors select their solution type, required technical modules, and delivery urgency to receive an instant, server-calculated cost range and timeline estimate, then generate a proposal in one click.
* **Internal Admin Leads Portal (Demo):** A real-time CRM view for Cynbit's team to inspect incoming scoped leads, track total pipeline value, and update deal statuses (`New Lead` -> `Contacted` -> `Proposal Sent` -> `Closed Won`).

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS | Responsive multi-step configurator, live state updates, and Admin CRM UI |
| **Backend** | Python, Django 5, Django REST Framework | Server-side pricing calculation engine, RESTful API endpoints, and validation |
| **Database** | Relational ORM (`ProjectLead` schema) | Stores JSON module arrays, cost bounds, timelines, and CRM statuses |
| **Hosting** | Vercel (Frontend) + Render (Backend) | Production deployment with CORS and WhiteNoise static handling |

---

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/estimate/calculate/` | Computes estimated cost range and delivery weeks from selected solution, modules, and urgency. |
| `GET` | `/api/leads/` | Fetches all submitted project leads along with aggregated pipeline KPIs. |
| `POST` | `/api/leads/` | Validates and saves a newly generated client proposal to the database. |
| `PATCH` | `/api/leads/<id>/` | Updates the CRM pipeline status of a specific lead. |

---

## Note for Evaluators

* **Zero-Friction Admin Access:** Click **Admin Leads Portal (Demo)** in the top navigation bar to inspect submitted leads and update deal statuses without needing login credentials.
* **Cold Start Notice:** The backend runs on Render's free tier; the very first API call after inactivity may take ~25-30 seconds to wake up.