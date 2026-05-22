# Espringrocks Aggregates Trading System

A full-stack, event-driven order management, logistics tracking, and transaction ledger system built for **Espringrocks Aggregates Trading**.

This project demonstrates the integration of an event-driven **React.js (Vite)** frontend with a robust **Django REST Framework** backend, satisfying the requirements for the final Event-Driven Programming examination and integrating backend services from the IT119 course.

---

## 📖 Research Methods Study Alignment

### Topic:
*Design and Implementation of an Event-Driven Transaction Ledger and Automated Verification System for Aggregate Trading Operations: A Case Study of Espringrocks Aggregates Trading*

### Problem Statement:
Aggregate trading enterprises traditionally manage operations using manual invoice calculation and verification methods. Truck dimensions (Length x Width) and aggregate height (amount in meters) must be measured and calculated to compute volumetric capacity (Cubic Meters), to which VAT, regional taxes, and Right-of-Way (ROW) surcharges are added. Manual entry is slow, error-prone, and leaves no auditable trail of price changes or operator approvals.

### System Solution:
This system automates this entire lifecycle:
1. **Automated Volumetric Calculations**: Ingests vehicle dimensions and dynamically calculates cubic volume, VAT, and ROW charges instantly using React's event-driven state hooks.
2. **Role-Based Workflows**: Restricts operations through role-based access. Employee-submitted requests are marked as `Pending` until verified by an `IT Administrator`.
3. **Immutable Event Ledgers**: Implements an event-driven Audit Trail recording user authentication, data creation, approvals, and reporting, establishing absolute data integrity.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite, TailwindCSS, Material-UI, Lucide Icons, React Router)
*   **Backend**: Django, Django REST Framework, Simple JWT (JSON Web Tokens)
*   **Database**: SQLite (local persistence)
*   **Libraries**: `jspdf` & `jspdf-autotable` (client-side reporting), `@mui/x-charts` (analytics representation)

---

## 🚀 Key Features

*   **Secure Authentication**: JWT-based authentication for Administrators and Employees.
*   **Live Analytics Dashboard**: Dynamic KPI widgets and interactive monthly revenue charts.
*   **Dynamic Order Calculations**: Automatic billing computation (Cubic Volume, VAT, Tax, Right-of-Way, Total Price) based on hauler dimension inputs.
*   **Multi-Tier Approval System**: Real-time admin notification drawer displaying pending transactions, products, users, or customers requiring approval.
*   **Product Catalog & Price Tracking**: Automated logging of material rate updates (Sands, Gravels, Mixes).
*   **Customer & Truck Fleet Ledger**: Storage of hauler truck plate numbers and load dimensions.
*   **Audit Trail Ledger**: Automatically logs every critical system transaction with user references and timestamps.
*   **Report Generation**: Visual transaction aggregates with custom PDF exporting capabilities.

---

## ⚙️ Project Setup

### Prerequisites
*   Node.js 18+ & npm
*   Python 3.10+

### Setup and Running the Servers

The project contains a unified configuration. Follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-group/espringrocks-aggregates-trading.git
   cd espringrocks-aggregates-trading
   ```

2. **Backend Server Setup**:
   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate   # On Windows
   # source .venv/bin/activate # On Unix/macOS
   
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py seed_data
   python manage.py runserver 8000
   ```
   *Note: The backend API runs at `http://localhost:8000/api/`*

3. **Frontend React Setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Note: Open the local Vite URL, typically `http://localhost:5173/` or `http://localhost:5174/`.*

---

## 🔑 Seeding & Credentials

To seed sample products, customers, and active orders, run the management command:
```bash
python manage.py seed_data
```

### System Accounts:
*   **IT Administrator** (Full dashboard privileges, approvals, management):
    *   **Username**: `admin`
    *   **Password**: `admin123`
*   **Employee** (Order creation, customer registration, catalog browsing):
    *   **Username**: `EMP-1`
    *   **Password**: `employee123`

---

## 📂 Project Structure
*   `backend/core/` - Django application code containing API views, serializers, and SQLite models (`User`, `Product`, `Customer`, `Order`, `AuditTrail`, `SystemUpdate`).
*   `frontend/src/` - React frontend workspace including context state, custom page components, layout containers, and styling hooks.
