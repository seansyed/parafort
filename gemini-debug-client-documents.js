import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeClientDocumentsIssue() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Read the current client documents file
    const clientDocumentsCode = fs.readFileSync('client/src/pages/client-documents.tsx', 'utf8');
    const serverRoutesCode = fs.readFileSync('server/routes.ts', 'utf8').slice(0, 10000); // First 10k chars
    
    const prompt = `
    CRITICAL ISSUE ANALYSIS:
    
    The user reports that the Client Documents page is still showing mock data and download functionality isn't working. Here's the current code:
    
    CLIENT DOCUMENTS PAGE:
    ${clientDocumentsCode}
    
    SERVER ROUTES (partial):
    ${serverRoutesCode}
    
    PROBLEMS IDENTIFIED:
    1. User can't download or view files
    2. Claims it's still showing mock data
    3. Download functionality not working
    
    REQUIREMENTS:
    - Must use authentic API data only
    - Download functionality must work with real files
    - Service categorization filtering (Business Formation, Bookkeeping, Payroll, Tax)
    - No mock data allowed
    
    Please provide a detailed analysis of what's wrong and specific fixes needed for:
    1. Download functionality
    2. Ensuring authentic data display
    3. File handling
    4. Any missing API endpoints
    
    Format your response as specific actionable fixes.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysis = response.text();
    
    console.log("=== GEMINI ANALYSIS ===");
    console.log(analysis);
    
    // Write analysis to file for reference
    fs.writeFileSync('client-documents-analysis.txt', analysis);
    
    return analysis;
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return null;
  }
}

analyzeClientDocumentsIssue().then(analysis => {
  if (analysis) {
    console.log("\nAnalysis saved to client-documents-analysis.txt");
  }
}).catch(console.error);