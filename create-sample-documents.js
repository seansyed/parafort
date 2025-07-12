import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createSamplePDFs() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create Articles of Incorporation PDF
  const articlesDoc = await PDFDocument.create();
  const articlesPage = articlesDoc.addPage();
  const { width, height } = articlesPage.getSize();
  const font = await articlesDoc.embedFont(StandardFonts.Helvetica);
  
  articlesPage.drawText('ARTICLES OF INCORPORATION', {
    x: 50,
    y: height - 100,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  
  articlesPage.drawText('Sample Corporation', {
    x: 50,
    y: height - 150,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  
  articlesPage.drawText('This document contains the articles of incorporation for Sample Corporation.', {
    x: 50,
    y: height - 200,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  const articlesPdfBytes = await articlesDoc.save();
  fs.writeFileSync(path.join(uploadsDir, 'articles-of-incorporation.pdf'), articlesPdfBytes);

  // Create Monthly Bookkeeping Report
  const bookkeepingDoc = await PDFDocument.create();
  const bookkeepingPage = bookkeepingDoc.addPage();
  
  bookkeepingPage.drawText('MONTHLY BOOKKEEPING REPORT', {
    x: 50,
    y: height - 100,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  
  bookkeepingPage.drawText('March 2025', {
    x: 50,
    y: height - 150,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  
  bookkeepingPage.drawText('Financial summary and bookkeeping records for March 2025.', {
    x: 50,
    y: height - 200,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  const bookkeepingPdfBytes = await bookkeepingDoc.save();
  fs.writeFileSync(path.join(uploadsDir, 'monthly-bookkeeping-report.xlsx'), bookkeepingPdfBytes);

  // Create Payroll Summary
  const payrollDoc = await PDFDocument.create();
  const payrollPage = payrollDoc.addPage();
  
  payrollPage.drawText('PAYROLL SUMMARY Q1 2025', {
    x: 50,
    y: height - 100,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  
  payrollPage.drawText('Quarterly payroll summary and employee compensation details.', {
    x: 50,
    y: height - 150,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  const payrollPdfBytes = await payrollDoc.save();
  fs.writeFileSync(path.join(uploadsDir, 'payroll-summary-q1.pdf'), payrollPdfBytes);

  // Create Tax Return
  const taxDoc = await PDFDocument.create();
  const taxPage = taxDoc.addPage();
  
  taxPage.drawText('BUSINESS TAX RETURN 2024', {
    x: 50,
    y: height - 100,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  
  taxPage.drawText('Annual business tax return filing for 2024.', {
    x: 50,
    y: height - 150,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  const taxPdfBytes = await taxDoc.save();
  fs.writeFileSync(path.join(uploadsDir, 'tax-return-2024.pdf'), taxPdfBytes);

  // Create Bylaws Draft
  const bylawsDoc = await PDFDocument.create();
  const bylawsPage = bylawsDoc.addPage();
  
  bylawsPage.drawText('CORPORATE BYLAWS DRAFT', {
    x: 50,
    y: height - 100,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  
  bylawsPage.drawText('Draft corporate bylaws for review and approval.', {
    x: 50,
    y: height - 150,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  const bylawsPdfBytes = await bylawsDoc.save();
  fs.writeFileSync(path.join(uploadsDir, 'bylaws-draft.docx'), bylawsPdfBytes);

  console.log('Sample documents created successfully!');
}

createSamplePDFs().catch(console.error);