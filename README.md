# 🏢 VendorBridge ERP

> **A Modern, Full-Stack Procurement & Vendor Management System**
>
> Built for speed, transparency, and seamless collaboration between Procurement Teams and Vendors.

## ✨ Overview

**VendorBridge ERP** is an end-to-end digital procurement platform designed to eliminate fragmented workflows. It eliminates chaos caused by scattered emails, Excel sheets, and manual follow-ups by centralizing the entire procurement lifecycle—from creating a Request for Quotation (RFQ) to generating final Invoices—in a single, unified, role-based system.

Built with cutting-edge technologies including **Next.js 15**, **Tailwind CSS v4**, and **MongoDB**, VendorBridge delivers an incredibly fast and premium user experience out of the box.

---

## 🎯 Key Features

### 🛡️ Strict Role-Based Access Control (RBAC)
- **System Admin:** Full control over the system, user management, and vendor onboarding
- **Procurement Manager:** Oversees operations and provides final approvals for high-value bids
- **Procurement Officer:** Creates RFQs, analyzes bids, and drives workflows forward
- **Vendor:** Restricted portal to view invited RFQs and submit secure quotations

### 🔄 Complete Procurement Workflow
- **RFQs (Request for Quotation)** – Create detailed multi-item RFQs and invite specific vendors
- **Vendor Bidding** – Vendors submit pricing and delivery terms dynamically
- **Dynamic Quotation Comparison** – System automatically compares bids side-by-side with instant visual highlighting
- **Purchase Orders (POs)** – Auto-generated upon manager approval
- **Invoices** – Generated from POs once delivery is verified

### 📄 Print-Ready Documents
- Custom CSS print stylesheets ensure clean, professional, UI-free documents
- Generate PDFs or print Purchase Orders and Invoices directly from the browser
- A4-formatted output ready for immediate distribution

### 📊 Real-Time Analytics & Audit Trails
- **Dashboard Analytics** – Visualized procurement spend and vendor performance using Recharts
- **Immutable Activity Logs** – Comprehensive audit trail tracking every action with timestamps
- **Color-Coded Status Badges** – Quick visual status identification across workflows

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | High-quality UI components |
| [Radix UI](https://www.radix-ui.com/) | Accessible component primitives |
| [Lucide React](https://lucide.dev/) | Beautiful icon library |
| [Recharts](https://recharts.org/) | Composable charting library |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| Next.js Serverless APIs | Backend route handlers (`app/api/*`) |
| [MongoDB](https://www.mongodb.com/) | NoSQL document database |
| [Mongoose](https://mongoosejs.com/) | MongoDB object modeling |
| `bcryptjs` | Secure password hashing |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas cloud account)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tirthpatel90/VendorBridge.git
   cd VendorBridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/vendorbridge
   ```
   
   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendorbridge?retryWrites=true&w=majority
   ```

4. **Seed the database**
   
   Start the development server:
   ```bash
   npm run dev
   ```
   
   Open your browser and navigate to:
   ```
   http://localhost:3000/api/seed
   ```
   
   You should see a JSON response confirming successful seeding.

5. **Access the application**
   ```
   http://localhost:3000
   ```

---

## 🔑 Default Test Credentials

After database seeding, use these test accounts. Password for all accounts: `password123`

| Role | Email | Description |
|------|-------|-------------|
| **Admin** | `aditi.admin@vendorbridge.io` | System administration & user management |
| **Manager** | `neha.gupta@vendorbridge.io` | Quotation approval & PO generation |
| **Officer** | `aarav.mehta@vendorbridge.io` | RFQ creation & bid comparison |
| **Vendor** | `rajesh@infrasupplies.in` | Vendor portal & quotation submission |

---

## 📋 How It Works: The 8-Step Procurement Lifecycle

VendorBridge automates a logical procurement process with strict role-based transitions and automatic data flow across MongoDB collections.

### **Step 1: Procurement Officer Creates an RFQ**
Officer navigates to `/rfqs/new` and creates a Request for Quotation with:
- Item specifications and quantities
- Delivery deadline
- Selected vendors to invite
- System saves to `rfq` collection; selected vendors are flagged as invited

### **Step 2: Vendors Submit Quotations**
Vendors log in and access `/quotations` portal:
- View only RFQs they were invited to
- Enter unit prices, payment terms, and delivery timelines
- System dynamically calculates totals and saves to `quotation` collection

### **Step 3: Bid Comparison**
Officer navigates to `/quotations/compare`:
- **Dynamic Comparison Engine** fetches all bids for the RFQ
- Automatically highlights lowest price per item in **green**
- Drastically reduces evaluation time

### **Step 4: Approval Workflow**
Officer forwards preferred quotation to Manager via `/approvals`:
- Manager reviews and hits "Approve"
- Quotation status updated; RFQ marked as "Awarded"

### **Step 5: Purchase Order Generation**
**Automated upon approval:**
- System parses approved items, prices, and vendor details
- Creates structured PO in `purchaseOrder` collection
- Immediately visible to Procurement team and Vendor

### **Step 6: Invoice Generation**
**Automated after delivery verification:**
- System creates invoice record in `invoice` collection
- Pulls financial data and due dates from associated PO

### **Step 7: Print / PDF Export**
Users click "Print" or "Download PDF":
- Custom CSS strips navigation and UI elements
- Clean, professional A4-formatted document
- Ready for printing or browser PDF export

### **Step 8: Analytics & Audit Tracking**
Managers access real-time insights:
- **Dashboard** (`/dashboard`) – Spend analytics via Recharts
- **Activity Logs** (`/activity`) – Immutable audit trail with timestamps

---

## 📁 Project Structure

```
VendorBridge/
├── app/
│   ├── (app)/                    # 🔒 Protected application routes
│   │   ├── activity/             # Audit logs and timeline
│   │   ├── approvals/            # Manager approval dashboard
│   │   ├── dashboard/            # Analytics & KPIs
│   │   ├── invoices/             # Invoice management
│   │   ├── profile/              # User profile settings
│   │   ├── purchase-orders/      # PO listing & details
│   │   ├── quotations/           # Comparison & submission
│   │   ├── rfqs/                 # RFQ creation & tracking
│   │   ├── settings/             # Global configuration
│   │   ├── users/                # Admin user management
│   │   └── vendors/              # Vendor CRM portal
│   ├── api/                      # 🔌 Backend API endpoints
│   │   ├── activities/           # Audit trail endpoints
│   │   ├── auth/                 # Authentication logic
│   │   ├── invoices/             # Invoice CRUD
│   │   ├── purchase-orders/      # PO CRUD
│   │   ├── quotations/           # Quotation aggregation
│   │   ├── rfqs/                 # RFQ endpoints
│   │   ├── seed/                 # Database seeding
│   │   ├── users/                # User management
│   │   └── vendors/              # Vendor endpoints
│   ├── layout.tsx                # Root HTML & Context Providers
│   └── globals.css               # Tailwind & theme tokens
├── components/
│   ├── ui/                       # Shadcn UI atomic components
│   ├── charts/                   # Recharts visualizations
│   ├── auth-form.tsx             # Login/registration form
│   ├── route-guard.tsx           # Auth protection wrapper
│   ├── sidebar-nav.tsx           # Role-based navigation
│   └── topbar.tsx                # Global header & breadcrumbs
├── lib/
│   ├── models/                   # 📊 Mongoose schemas
│   │   ├── activity.ts           # User action tracking
│   │   ├── invoice.ts            # Payment records
│   │   ├── purchaseOrder.ts      # Order details
│   │   ├── quotation.ts          # Vendor pricing
│   │   ├── rfq.ts                # Procurement requests
│   │   ├── user.ts               # Authentication & roles
│   │   └── vendor.ts             # Supplier CRM
│   ├── auth-context.tsx          # 🔐 Global session state
│   ├── store-context.tsx         # 📡 API & async state
│   ├── mongodb.ts                # DB connection caching
│   ├── rbac.ts                   # Role-based access rules
│   └── utils.ts                  # Helper utilities
├── public/                       # Static assets
├── package.json                  # Dependencies & scripts
├── tailwind.config.js            # Theme customization
└── README.md                      # You are here
```

---

## 🎨 Tech Highlights

- ✅ **Modern React 19** with hooks and server components
- ✅ **Type-safe** with TypeScript (where applicable)
- ✅ **Responsive Design** with Tailwind CSS v4
- ✅ **Database Caching** prevents MongoDB connection exhaustion
- ✅ **Immutable Audit Logs** for compliance and traceability
- ✅ **Print-Optimized CSS** for professional document generation
- ✅ **Real-Time Analytics** with interactive Recharts visualizations

---

## 🔐 Security Features

- **Password Hashing** – bcryptjs for secure credential storage
- **Role-Based Access Control** – Fine-grained permission enforcement
- **Route Guards** – Client-side auth validation with server-side verification
- **Immutable Audit Trail** – All actions logged with timestamps and user details
- **Protected API Endpoints** – Authentication required for all sensitive operations

---

## 📚 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (if configured)
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📖 Documentation

For detailed API documentation and workflow guides, refer to the inline comments in:
- `app/api/*` – API endpoint documentation
- `lib/models/*` – Database schema definitions
- `components/*` – Component-level implementation notes

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your `MONGODB_URI` in `.env.local`
- Ensure MongoDB service is running locally or check MongoDB Atlas network access
- Check firewall settings for port 27017

### Seeding Failed
- Clear the database manually or delete existing collections
- Revisit `http://localhost:3000/api/seed`
- Check browser console and server logs for error messages

### Authentication Problems
- Clear browser cookies and local storage
- Verify test credentials from the credentials table above
- Check that the `user` collection was properly seeded

---

## 📞 Support

For issues, feature requests, or questions:
- Open an [Issue](https://github.com/tirthpatel90/VendorBridge/issues)
- Check existing discussions and documentation

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Tirth Patel**
- GitHub: [@tirthpatel90](https://github.com/tirthpatel90)

---

<div align="center">
  <p><strong>Made with ❤️ for procurement teams worldwide</strong></p>
  <p>⭐ If you found this helpful, please consider giving it a star!</p>
</div>