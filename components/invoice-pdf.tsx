"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  table: {
    marginBottom: 15,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    paddingRight: 10,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
})

export function InvoicePDF({ invoiceData }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
          <Text>Date: {invoiceData.invoiceDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{invoiceData.clientName}</Text>
          <Text>{invoiceData.clientEmail}</Text>
          <Text>{invoiceData.clientPhone}</Text>
          <Text>GSTIN: {invoiceData.clientGSTIN}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>HSN</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Rate</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>

          {invoiceData.lineItems?.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.hsn}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>₹{item.unitPrice}</Text>
              <Text style={styles.tableCell}>₹{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.col}>Subtotal:</Text>
            <Text>₹{invoiceData.subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.col}>GST (18%):</Text>
            <Text>₹{invoiceData.gst}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.col}>Total:</Text>
            <Text>₹{invoiceData.total}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  )
}
