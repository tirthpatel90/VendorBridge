# VendorBridge ERP

A modern, full-stack Vendor Management and Procurement ERP system built with **Next.js 15**, **Tailwind CSS**, and **MongoDB**.

VendorBridge streamlines the entire procurement lifecycle—from creating RFQs and comparing vendor quotations, to generating Purchase Orders and tracking Invoices.

![VendorBridge Dashboard](https://via.placeholder.com/1200x600?text=VendorBridge+ERP+Dashboard)

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct views for Procurement Officers, Managers, System Admins, and Vendors.
- **Vendor Portal:** Vendors can register, view open RFQs, and submit quotations with pricing and delivery timelines.
- **Dynamic Quotation Comparison:** Procurement officers can view and compare vendor bids side-by-side, with automatic highlighting of the lowest prices.
- **Procurement Workflow:** End-to-end tracking of RFQs ➔ Quotations ➔ Approvals ➔ Purchase Orders ➔ Invoices.
- **Activity & Audit Logs:** A comprehensive trail of all actions performed within the system.
- **Responsive Design:** A beautiful, emerald-green themed UI built with `shadcn/ui` that works seamlessly on desktop and mobile.
- **Print-Ready Documents:** Generate cleanly formatted, print-ready Purchase Orders and Invoices directly from the browser.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS
- **Backend:** Next.js API Routes, Mongoose (MongoDB)
- **UI Components:** shadcn/ui, Radix UI
- **Icons & Visualization:** Lucide React, Recharts
- **State Management:** React Context API (`lib/store-context.tsx`)

## 📦 Getting Started

### 1. Prerequisites

- Node.js (v18 or higher)
- A MongoDB instance (local or MongoDB Atlas)

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/vendorbridge
```
*(Replace the URI with your actual MongoDB connection string)*

### 4. Seed the Database

To populate the database with initial users, vendors, and sample data, start the development server:

```bash
npm run dev
```

Then, open your browser and navigate to the seed endpoint:

```
http://localhost:3000/api/seed
```
You should see a success message indicating the database has been seeded.

### 5. Running the Application

After seeding, navigate to the main application:

```
http://localhost:3000
```

## 📁 Project Structure

- `app/(app)/*`: Main application routes (Dashboard, Vendors, RFQs, etc.)
- `app/api/*`: Next.js API routes for MongoDB interaction.
- `components/*`: Reusable UI components (mostly `shadcn/ui`).
- `lib/models/*`: Mongoose database schemas.
- `lib/store-context.tsx`: Global application state management.
- `lib/auth-context.tsx`: Authentication and user session state.
- `lib/rbac.ts`: Role-based access control definitions.

## 📄 License

This project is licensed under the MIT License.
