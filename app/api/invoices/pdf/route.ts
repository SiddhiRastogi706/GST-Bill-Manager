import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json()
    console.log("[v0] POST /api/invoices/pdf - Received data:", invoiceData)

    // Create a simple HTML invoice that can be printed or converted to PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${invoiceData.invoiceNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .invoice-container {
              max-width: 900px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 30px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
            }
            .company-info h1 {
              margin: 0;
              color: #007bff;
            }
            .invoice-number {
              text-align: right;
            }
            .invoice-number h2 {
              margin: 0;
              font-size: 24px;
              color: #007bff;
            }
            .invoice-date {
              color: #666;
              font-size: 14px;
            }
            .client-info {
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
            }
            .client-details {
              flex: 1;
            }
            .client-details h3 {
              margin: 0 0 10px 0;
              color: #333;
            }
            .client-details p {
              margin: 5px 0;
              color: #666;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background-color: #007bff;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .summary {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 30px;
            }
            .summary-table {
              width: 300px;
            }
            .summary-table td {
              border: none;
              padding: 10px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
            }
            .summary-label {
              font-weight: 600;
            }
            .summary-value {
              text-align: right;
            }
            .total-row {
              border-top: 2px solid #007bff;
              border-bottom: 2px solid #007bff;
              font-size: 18px;
              font-weight: bold;
              color: #007bff;
            }
            .footer {
              border-top: 1px solid #ddd;
              padding-top: 20px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .invoice-container { border: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="company-info">
                <h1>INVOICE</h1>
              </div>
              <div class="invoice-number">
                <h2>${invoiceData.invoiceNumber}</h2>
                <div class="invoice-date">${invoiceData.invoiceDate}</div>
              </div>
            </div>

            <div class="client-info">
              <div class="client-details">
                <h3>Bill To:</h3>
                <p><strong>${invoiceData.clientName}</strong></p>
                <p>${invoiceData.clientGSTIN}</p>
              </div>
              <div class="client-details">
                <h3>From:</h3>
                <p><strong>Your Company Name</strong></p>
                <p>GST Registration Number</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>HSN Code</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                  <th>Tax %</th>
                  <th>GST</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.lineItems
                  .map(
                    (item: any) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.hsn}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.unitPrice.toLocaleString()}</td>
                    <td>₹${item.amount.toLocaleString()}</td>
                    <td>${item.taxRate}%</td>
                    <td>₹${((item.amount * item.taxRate) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="summary">
              <table class="summary-table">
                <tr>
                  <td class="summary-label">Subtotal:</td>
                  <td class="summary-value">₹${invoiceData.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td class="summary-label">GST:</td>
                  <td class="summary-value">₹${invoiceData.totalGST.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr class="total-row">
                  <td>Grand Total:</td>
                  <td class="summary-value">₹${invoiceData.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>This is an electronically generated invoice. No signature is required.</p>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Return as HTML that can be printed or converted to PDF by the browser
    console.log("[v0] PDF HTML generated, size:", html.length)
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${invoiceData.invoiceNumber}.html"`,
      },
    })
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
