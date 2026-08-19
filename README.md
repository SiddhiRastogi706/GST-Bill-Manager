# GST Billing Management System

A complete, modern GST Billing Management System built with Next.js, React, and Tailwind CSS. Perfect for small businesses and accountants to manage invoices, clients, and GST calculations.

## Features

### Authentication & Security
- User registration with email verification
- Secure login with JWT authentication
- Password hashing with bcrypt
- Forgot password with OTP verification
- Role-based access control (Admin & User)
- Session management with auto-logout

### Invoice Management
- Create, edit, view, and delete invoices
- Automatic GST calculations (CGST, SGST, IGST)
- Dynamic line items with HSN codes
- Real-time total calculations
- Invoice status tracking (Draft, Sent, Paid)
- Auto-generated invoice numbers with custom prefix
- Download invoices as PDF
- Share invoices via email or WhatsApp

### Client Management
- Add, edit, and delete clients
- Store GSTIN, address, and contact information
- Search and filter clients
- Client history and transaction tracking

### Product Management
- Manage products and services
- HSN code management
- Price and tax rate configuration
- Stock tracking
- Quick product selection in invoices

### Dashboard & Analytics
- Real-time sales summary
- Monthly revenue and GST reports
- Graphical analytics with charts
- KPI cards (Revenue, GST, Invoices, Clients)
- Activity logs and audit trails

### Admin Panel
- User management and monitoring
- System statistics and health monitoring
- User role management
- System settings and configuration

### Settings & Configuration
- Business information setup
- Invoice settings (prefix, starting number)
- Default tax rate configuration
- Multi-currency support
- State-wise GST configuration

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion (CSS-based)
- **State Management**: React Hooks + localStorage

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB (ready for integration)
- **Authentication**: JWT + Bcrypt
- **Email**: Nodemailer (ready for integration)
- **PDF Generation**: jsPDF/pdfkit (ready for integration)

### Design
- Professional dark theme with blue/purple accents
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive design
- Mobile-first approach

## Installation

### Using shadcn CLI (Recommended)

\`\`\`bash
npx shadcn-cli@latest init -d
cd your-project
npm install
npm run dev
\`\`\`

### Manual Installation

\`\`\`bash
git clone <repository-url>
cd gst-billing-system
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Getting Started

1. **Sign Up**: Create a new account with your business details
2. **Configure Settings**: Set up your business information and invoice preferences
3. **Add Clients**: Create client profiles with GSTIN and contact details
4. **Add Products**: Set up your products/services with HSN codes and tax rates
5. **Create Invoices**: Generate invoices with automatic GST calculations
6. **Track Analytics**: Monitor your business metrics and generate reports

### Demo Credentials

- **Email**: demo@example.com
- **Password**: password123

## Project Structure

\`\`\`
gst-billing-system/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── api/
│   │   └── auth/               # Authentication routes
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── forgot-password/        # Password recovery
│   ├── dashboard/              # Main dashboard
│   ├── invoices/               # Invoice management
│   ├── clients/                # Client management
│   ├── products/               # Product management
│   ├── reports/                # Analytics & reports
│   ├── settings/               # User settings
│   └── admin/                  # Admin panel
├── components/
│   ├── ui/                     # shadcn UI components
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── dashboard-header.tsx    # Dashboard header
│   └── invoice-pdf.tsx         # PDF template
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
└── public/                     # Static assets
\`\`\`

## Key Features Explained

### GST Calculations
- Automatic CGST (9%) and SGST (9%) for intra-state transactions
- IGST (18%) for inter-state transactions
- Customizable tax rates per product
- Real-time calculation updates

### Invoice Management
- Line-item based invoicing
- HSN code support for GST compliance
- Multiple invoice statuses
- Bulk operations support
- Invoice templates

### Analytics
- Revenue tracking
- GST collection monitoring
- Client performance metrics
- Product sales analysis
- Monthly and yearly reports

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure API endpoints
- Input validation and sanitization

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password recovery
- `POST /api/auth/reset-password` - Password reset

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Download PDF

### Clients
- `GET /api/clients` - List clients
- `POST /api/clients` - Add client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Products
- `GET /api/products` - List products
- `POST /api/products` - Add product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=mongodb://localhost:27017/gst-billing
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

The application is ready for deployment on:
- Vercel
- Netlify
- AWS
- Google Cloud
- DigitalOcean
- Heroku

## Future Enhancements

- [ ] Multi-language support
- [ ] Advanced reporting with custom date ranges
- [ ] Recurring invoices
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Bulk invoice generation
- [ ] Advanced inventory management
- [ ] Customer portal
- [ ] API for third-party integrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@gstbilling.com or open an issue on GitHub.

## Changelog

### Version 1.0.0 (Initial Release)
- Complete authentication system
- Invoice management with GST calculations
- Client and product management
- Dashboard with analytics
- Admin panel
- Settings and configuration
- PDF export functionality

---

Built with ❤️ using Next.js and React
