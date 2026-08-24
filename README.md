# 🧾 GST Billing Management System

> **A modern, full-featured GST Billing & Business Management System built with Next.js, React, and Tailwind CSS.**

A complete billing solution designed for **small businesses, freelancers, and accountants** to manage invoices, clients, products, GST calculations, analytics, and business settings from one centralized dashboard.

---

## ✨ Highlights

* 🔐 Secure authentication with JWT & bcrypt
* 🧾 Complete invoice management
* 🇮🇳 Automatic GST calculation — CGST, SGST & IGST
* 👥 Client & customer management
* 📦 Product & inventory management
* 📊 Real-time business analytics
* 📈 Revenue & GST reporting
* 👨‍💼 Admin dashboard with role-based access
* 📄 PDF invoice generation
* 📱 Fully responsive & mobile-friendly UI
* 🎨 Modern dark-themed glassmorphism design

---

## 🚀 Features

### 🔐 Authentication & Security

* User registration & email verification
* Secure login with JWT authentication
* Password hashing using bcrypt
* Forgot password with OTP verification
* Role-based access control
* Admin & User roles
* Session management with auto-logout
* Secure API endpoints
* Input validation & sanitization

### 🧾 Invoice Management

* Create, edit, view & delete invoices
* Automatic GST calculations
* CGST, SGST & IGST support
* Dynamic invoice line items
* HSN code support
* Real-time total calculation
* Invoice status tracking:

  * Draft
  * Sent
  * Paid
* Auto-generated invoice numbers
* Custom invoice prefixes
* PDF invoice generation
* Share invoices via Email & WhatsApp
* Bulk invoice operations
* Custom invoice templates

### 👥 Client Management

* Add, edit & delete clients
* GSTIN management
* Business address & contact details
* Search & filter clients
* Client transaction history
* Client performance tracking

### 📦 Product Management

* Manage products & services
* HSN code management
* Configurable pricing
* Custom tax rates
* Stock tracking
* Quick product selection while creating invoices

### 📊 Dashboard & Analytics

Monitor your business performance through an interactive dashboard.

* Real-time sales summary
* Monthly revenue tracking
* GST collection reports
* Invoice statistics
* Client analytics
* Product performance
* Interactive charts
* KPI cards
* Activity logs
* Audit trails

### 👨‍💼 Admin Panel

* User management
* User role management
* System statistics
* Application health monitoring
* Activity monitoring
* System configuration

### ⚙️ Settings & Configuration

* Business information
* Invoice configuration
* Custom invoice prefix
* Starting invoice number
* Default tax rates
* State-wise GST configuration
* Multi-currency support

---

## 🧮 GST Calculation

The system automatically determines the applicable GST based on the transaction type.

| Transaction Type | GST                      |
| ---------------- | ------------------------ |
| Intra-State      | CGST + SGST              |
| Inter-State      | IGST                     |
| Custom Rate      | Configurable per product |

### Example

For an intra-state transaction with an 18% GST rate:

```text
CGST = 9%
SGST = 9%
Total GST = 18%
```

For an inter-state transaction:

```text
IGST = 18%
```

Tax rates can also be customized according to the product/service configuration.

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 16** — App Router
* **React 19**
* **Tailwind CSS v4**
* **Recharts** — Data visualization
* **Lucide React** — Icons
* **Framer Motion** — Animations
* React Hooks
* LocalStorage

### Backend

* **Node.js**
* **Next.js API Routes**
* **MongoDB** — Database integration ready
* **JWT** — Authentication
* **bcrypt** — Password security
* **Nodemailer** — Email integration ready
* **jsPDF / PDFKit** — PDF generation ready

### UI & Design

* 🌙 Dark modern interface
* ✨ Glassmorphism
* 🎨 Blue & purple accent system
* 🌀 Smooth animations
* 📱 Responsive design
* ⚡ Mobile-first architecture

---

## 📁 Project Structure

```text
gst-billing-system/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── api/
│   │   └── auth/
│   │
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── dashboard/
│   ├── invoices/
│   ├── clients/
│   ├── products/
│   ├── reports/
│   ├── settings/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── sidebar.tsx
│   ├── dashboard-header.tsx
│   └── invoice-pdf.tsx
│
├── hooks/
│
├── lib/
│
├── public/
│
├── .env.local
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| `POST` | `/api/auth/signup`          | Register user          |
| `POST` | `/api/auth/login`           | Login user             |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password`  | Reset password         |

### Invoices

| Method   | Endpoint                | Description          |
| -------- | ----------------------- | -------------------- |
| `GET`    | `/api/invoices`         | Get invoices         |
| `POST`   | `/api/invoices`         | Create invoice       |
| `GET`    | `/api/invoices/:id`     | Get invoice          |
| `PUT`    | `/api/invoices/:id`     | Update invoice       |
| `DELETE` | `/api/invoices/:id`     | Delete invoice       |
| `GET`    | `/api/invoices/:id/pdf` | Download invoice PDF |

### Clients

| Method   | Endpoint           | Description   |
| -------- | ------------------ | ------------- |
| `GET`    | `/api/clients`     | Get clients   |
| `POST`   | `/api/clients`     | Add client    |
| `PUT`    | `/api/clients/:id` | Update client |
| `DELETE` | `/api/clients/:id` | Delete client |

### Products

| Method   | Endpoint            | Description    |
| -------- | ------------------- | -------------- |
| `GET`    | `/api/products`     | Get products   |
| `POST`   | `/api/products`     | Add product    |
| `PUT`    | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>

cd gst-billing-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

DATABASE_URL=mongodb://localhost:27017/gst-billing

JWT_SECRET=your-secret-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧑‍💻 Usage

### Getting Started

1. **Create an Account**
   Register using your business information.

2. **Configure Business Settings**
   Add business details, invoice prefix, tax rates, and preferences.

3. **Add Clients**
   Store customer information including GSTIN and address.

4. **Add Products**
   Configure products/services, HSN codes, prices, and tax rates.

5. **Create Invoices**
   Add products and let the system automatically calculate GST.

6. **Track Business Performance**
   Monitor revenue, GST, invoices, clients, and product performance through analytics.

---

## 🔑 Demo Credentials

```text
Email:    demo@example.com
Password: password123
```

> ⚠️ Demo credentials are intended for local/demo environments only.

---

## ☁️ Deployment

### Vercel

```bash
npm install -g vercel

vercel
```

### Supported Platforms

The application can be deployed on:

* ▲ Vercel
* Netlify
* AWS
* Google Cloud
* DigitalOcean
* Heroku

---

## 🔮 Future Enhancements

* [ ] Multi-language support
* [ ] Advanced custom reports
* [ ] Recurring invoices
* [ ] Razorpay / Stripe integration
* [ ] React Native mobile application
* [ ] Real-time notifications
* [ ] Bulk invoice generation
* [ ] Advanced inventory management
* [ ] Customer portal
* [ ] Third-party API integrations
* [ ] Automated invoice reminders
* [ ] Expense management
* [ ] Backup & restore functionality

---

## 🔒 Security

The application follows modern security practices including:

* JWT-based authentication
* bcrypt password hashing
* Role-based authorization
* Secure API routes
* Input validation
* Data sanitization
* Session management
* Protected admin functionality

---

## 📌 Project Status

**Version:** `1.0.0`

**Status:** 🚀 Active Development

The current version includes authentication, invoicing, client management, product management, analytics, admin controls, and business configuration.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to your branch
git push origin feature/amazing-feature
```

Then open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Support

For issues, suggestions, or feature requests, please open an issue in the GitHub repository.

---

<div align="center">

### 🧾 GST Billing Management System

**Built with ❤️ using Next.js, React & Tailwind CSS**

⭐ If you found this project useful, consider giving it a star!

</div>
