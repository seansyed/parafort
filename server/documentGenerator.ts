import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import archiver from "archiver";
import { BusinessEntity } from "@shared/schema";

export interface DocumentGenerationOptions {
  businessEntity: BusinessEntity;
  documentType: "articles" | "operating-agreement";
  format: "docx" | "pdf";
}

export class DocumentGenerator {
  async generateArticlesOfOrganization(entity: BusinessEntity, format: "docx" | "pdf"): Promise<Buffer> {
    if (format === "docx") {
      return this.generateArticlesDocx(entity);
    } else {
      return this.generateArticlesPdf(entity);
    }
  }

  async generateOperatingAgreement(entity: BusinessEntity, format: "docx" | "pdf"): Promise<Buffer> {
    if (format === "docx") {
      return this.generateOperatingAgreementDocx(entity);
    } else {
      return this.generateOperatingAgreementPdf(entity);
    }
  }

  private async generateArticlesDocx(entity: BusinessEntity): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLES OF ORGANIZATION",
                bold: true,
                size: 28,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `FOR ${entity.name?.toUpperCase() || "[BUSINESS NAME]"}`,
                bold: true,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `A ${entity.state || "[STATE]"} Limited Liability Company`,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLE I - NAME",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The name of the Limited Liability Company is ${entity.name || "[BUSINESS NAME]"}.`,
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLE II - REGISTERED OFFICE AND REGISTERED AGENT",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The registered office of the Company is located at:`,
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${entity.streetAddress || "[STREET ADDRESS]"}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${entity.city || "[CITY]"}, ${entity.stateAddress || "[STATE]"} ${entity.zipCode || "[ZIP CODE]"}`,
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The registered agent is: ${entity.registeredAgent || "[REGISTERED AGENT NAME]"}`,
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLE III - PURPOSE",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: entity.businessPurpose || 
                      "The purpose of the Company is to engage in any lawful act or activity for which a limited liability company may be organized under the laws of the State.",
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLE IV - MANAGEMENT",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "The Company shall be managed by its members.",
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLE V - EFFECTIVE DATE",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "These Articles of Organization shall be effective upon filing with the Secretary of State.",
                size: 20,
              }),
            ],
            spacing: { after: 600 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ORGANIZER SIGNATURE",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 800, after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Signature: _________________________________",
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date().toLocaleDateString()}`,
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Print Name: _________________________________",
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  }

  private async generateOperatingAgreementDocx(entity: BusinessEntity): Promise<Buffer> {
    const isSingleMember = true; // This would be determined by member count in a real implementation
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${isSingleMember ? "SINGLE-MEMBER" : "MULTI-MEMBER"} LLC OPERATING AGREEMENT`,
                bold: true,
                size: 28,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `FOR ${entity.name?.toUpperCase() || "[BUSINESS NAME]"}`,
                bold: true,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "1. FORMATION AND PURPOSE",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `This Operating Agreement ("Agreement") governs the operations of ${entity.name || "[BUSINESS NAME]"}, a ${entity.state || "[STATE]"} Limited Liability Company ("Company").`,
                size: 18,
              }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The purpose of the Company is: ${entity.businessPurpose || "to engage in any lawful business activity."}`,
                size: 18,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "2. MEMBERS AND MEMBERSHIP INTERESTS",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          ...(isSingleMember ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "The Company has one (1) member who owns 100% of the membership interests.",
                  size: 18,
                }),
              ],
              spacing: { after: 300 },
            }),
          ] : [
            new Paragraph({
              children: [
                new TextRun({
                  text: "The Company has multiple members with ownership percentages as follows:",
                  size: 18,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "[MEMBER NAMES AND PERCENTAGES TO BE FILLED]",
                  size: 18,
                  italics: true,
                }),
              ],
              spacing: { after: 300 },
            }),
          ]),

          new Paragraph({
            children: [
              new TextRun({
                text: "3. MANAGEMENT STRUCTURE",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The Company shall be managed by its ${isSingleMember ? "sole member" : "members"}.`,
                size: 18,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "4. CAPITAL CONTRIBUTIONS",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Initial capital contributions and future contribution requirements shall be as agreed upon by the members.",
                size: 18,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "5. DISTRIBUTIONS",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Distributions shall be made to members in proportion to their membership interests, as determined by the managing members.",
                size: 18,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "6. DISSOLUTION",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The Company may be dissolved ${isSingleMember ? "at the discretion of the sole member" : "by unanimous consent of all members"}.`,
                size: 18,
              }),
            ],
            spacing: { after: 600 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "MEMBER SIGNATURE(S)",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 800, after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Signature: _________________________________",
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date().toLocaleDateString()}`,
                size: 18,
              }),
            ],
            spacing: { after: 400 },
          }),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  }

  private async generateArticlesPdf(entity: BusinessEntity): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    let yPosition = height - 50;
    
    // Title
    page.drawText('ARTICLES OF ORGANIZATION', {
      x: width / 2 - 120,
      y: yPosition,
      size: 18,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 40;
    page.drawText(`FOR ${entity.name?.toUpperCase() || "[BUSINESS NAME]"}`, {
      x: width / 2 - 100,
      y: yPosition,
      size: 14,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 30;
    page.drawText(`A ${entity.state || "[STATE]"} Limited Liability Company`, {
      x: width / 2 - 80,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 60;
    
    // Article I
    page.drawText('ARTICLE I - NAME', {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    page.drawText(`The name of the Limited Liability Company is ${entity.name || "[BUSINESS NAME]"}.`, {
      x: 50,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 40;
    
    // Article II
    page.drawText('ARTICLE II - REGISTERED OFFICE AND REGISTERED AGENT', {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    page.drawText('The registered office of the Company is located at:', {
      x: 50,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 20;
    page.drawText(`${entity.streetAddress || "[STREET ADDRESS]"}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 15;
    page.drawText(`${entity.city || "[CITY]"}, ${entity.stateAddress || "[STATE]"} ${entity.zipCode || "[ZIP CODE]"}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 20;
    page.drawText(`The registered agent is: ${entity.registeredAgent || "[REGISTERED AGENT NAME]"}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  private async generateOperatingAgreementPdf(entity: BusinessEntity): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    let yPosition = height - 50;
    
    // Title
    page.drawText('LLC OPERATING AGREEMENT', {
      x: width / 2 - 100,
      y: yPosition,
      size: 18,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 40;
    page.drawText(`FOR ${entity.name?.toUpperCase() || "[BUSINESS NAME]"}`, {
      x: width / 2 - 100,
      y: yPosition,
      size: 14,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 60;
    
    // Section 1
    page.drawText('1. FORMATION AND PURPOSE', {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    const purposeText = `This Operating Agreement governs the operations of ${entity.name || "[BUSINESS NAME]"}, a ${entity.state || "[STATE]"} Limited Liability Company.`;
    page.drawText(purposeText, {
      x: 50,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

export const documentGenerator = new DocumentGenerator();