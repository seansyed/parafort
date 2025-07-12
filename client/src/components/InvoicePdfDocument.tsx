import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Define the invoice data structure
interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  company: {
    name: string;
    address: string;
    cityStateZip: string;
    phone: string;
    email: string;
    logoUrl?: string;
  };
  client: {
    name: string;
    address: string;
    cityStateZip: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  notes?: string;
  terms?: string;
}

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#27884b',
  },
  companyDetails: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.3,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#333',
    marginBottom: 10,
  },
  invoiceDetails: {
    textAlign: 'right',
    fontSize: 9,
    color: '#666',
  },
  billToSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textTransform: 'uppercase',
  },
  clientInfo: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.4,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#ddd',
    marginTop: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    padding: 8,
  },
  tableColDescription: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    padding: 8,
  },
  tableColHeaderDescription: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    padding: 8,
  },
  tableColSmall: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    padding: 8,
  },
  tableColHeaderSmall: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  tableCell: {
    fontSize: 9,
    color: '#666',
  },
  summarySection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  summaryLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 10,
    fontSize: 10,
    color: '#666',
  },
  summaryValue: {
    width: 80,
    textAlign: 'right',
    fontSize: 10,
    color: '#333',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: '#27884b',
  },
  grandTotalLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    width: 80,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27884b',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#eee',
  },
  notesSection: {
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  notesText: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4,
  },
  thankYou: {
    textAlign: 'center',
    fontSize: 10,
    color: '#27884b',
    fontWeight: 'bold',
  },
});

interface InvoicePdfDocumentProps {
  invoiceData: InvoiceData;
}

const InvoicePdfDocument: React.FC<InvoicePdfDocumentProps> = ({ invoiceData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{invoiceData.company.name}</Text>
            <Text style={styles.companyDetails}>{invoiceData.company.address}</Text>
            <Text style={styles.companyDetails}>{invoiceData.company.cityStateZip}</Text>
            <Text style={styles.companyDetails}>Phone: {invoiceData.company.phone}</Text>
            <Text style={styles.companyDetails}>Email: {invoiceData.company.email}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceDetails}>Invoice #: {invoiceData.invoiceNumber}</Text>
            <Text style={styles.invoiceDetails}>Date: {invoiceData.invoiceDate}</Text>
            <Text style={styles.invoiceDetails}>Due Date: {invoiceData.dueDate}</Text>
          </View>
        </View>

        {/* Bill To Section */}
        <View style={styles.billToSection}>
          <Text style={styles.billToTitle}>Bill To:</Text>
          <Text style={styles.clientInfo}>{invoiceData.client.name}</Text>
          <Text style={styles.clientInfo}>{invoiceData.client.address}</Text>
          <Text style={styles.clientInfo}>{invoiceData.client.cityStateZip}</Text>
          <Text style={styles.clientInfo}>{invoiceData.client.email}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeaderDescription}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeaderSmall}>
              <Text style={styles.tableCellHeader}>Qty</Text>
            </View>
            <View style={styles.tableColHeaderSmall}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={styles.tableColHeaderSmall}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          {/* Table Rows */}
          {invoiceData.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableColDescription}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableColSmall}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableColSmall}>
                <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.tableColSmall}>
                <Text style={styles.tableCell}>${item.lineTotal.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${invoiceData.subTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax ({(invoiceData.taxRate * 100).toFixed(1)}%):</Text>
            <Text style={styles.summaryValue}>${invoiceData.taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>${invoiceData.grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {invoiceData.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{invoiceData.notes}</Text>
            </View>
          )}
          
          {invoiceData.terms && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Terms & Conditions:</Text>
              <Text style={styles.notesText}>{invoiceData.terms}</Text>
            </View>
          )}
          
          <Text style={styles.thankYou}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdfDocument;
export type { InvoiceData };