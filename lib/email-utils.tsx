// Email template generators for invoices and notifications

export function generateInvoiceEmailHTML(invoiceData: any): string {
  const lineItemsHTML = invoiceData.lineItems
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${item.description}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.unitPrice.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.amount.toLocaleString()}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            border-bottom: 3px solid #007bff;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #007bff;
            margin: 0 0 5px 0;
            font-size: 28px;
          }
          .invoice-number {
            color: #666;
            font-size: 14px;
          }
          .client-info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
          }
          .info-label {
            font-weight: 600;
            color: #333;
            margin-top: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #007bff;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
          }
          .summary {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
          .summary-box {
            width: 300px;
            border-top: 2px solid #007bff;
            padding-top: 10px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .summary-row.total {
            border-bottom: 2px solid #007bff;
            font-weight: 600;
            font-size: 18px;
            color: #007bff;
            padding: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice ${invoiceData.invoiceNumber}</h1>
            <div class="invoice-number">Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}</div>
          </div>

          <div class="client-info">
            <div class="info-label">Bill To:</div>
            <p>${invoiceData.clientName}</p>
            ${invoiceData.clientGSTIN ? `<p><strong>GSTIN:</strong> ${invoiceData.clientGSTIN}</p>` : ""}
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHTML}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-box">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${invoiceData.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div class="summary-row">
                <span>GST (18%):</span>
                <span>₹${invoiceData.totalGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>₹${invoiceData.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="#" class="button">View Invoice</a>
          </div>

          <div class="footer">
            <p>This is an electronically generated invoice. No signature is required.</p>
            <p>For any queries, please contact us.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function generateWelcomeEmailHTML(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #007bff;
            margin-bottom: 10px;
          }
          .content {
            line-height: 1.8;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to GST Billing System! 🎉</h1>
          
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for signing up with our GST Billing Management System. We're excited to have you on board!</p>
            <p>You now have access to powerful tools to manage your invoices, clients, and business finances with ease.</p>
            
            <h2 style="color: #333; margin-top: 20px;">Getting Started:</h2>
            <ul>
              <li>Create and manage invoices with automatic GST calculations</li>
              <li>Maintain a database of your clients and products</li>
              <li>Generate professional invoice PDFs</li>
              <li>Track your business statistics and analytics</li>
              <li>Export reports for your records</li>
            </ul>

            <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
          </div>

          <div class="footer">
            <p>Happy invoicing! 📊</p>
            <p>© 2025 GST Billing System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function sendInvoiceEmail(email: string, invoiceData: any): Promise<boolean> {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: `Invoice ${invoiceData.invoiceNumber} from Your Company`,
        html: generateInvoiceEmailHTML(invoiceData),
        type: "invoice",
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending invoice email:", error)
    return false
  }
}

export async function sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Welcome to GST Billing System",
        html: generateWelcomeEmailHTML(userName),
        type: "welcome",
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}
