import { GoogleGenerativeAI } from '@google/generative-ai';

async function askGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    I have a data inconsistency issue in my bookkeeping plans. Some plans have prices already stored as cents (like 10000, 100000) while others have prices stored as dollars (like 29, 290). 

    I need a robust solution to:
    1) Detect if a price value is in cents or dollars
    2) Normalize all values to cents for database storage
    3) Always display as dollars in the UI

    The issue: When editing, a plan with monthlyPrice: 29 converts to $0.29 in the form (should be $29.00), but displays as $10000.00 in the card view.

    I need JavaScript functions to:
    - Intelligently detect if a number represents cents or dollars
    - Convert any price to the correct format
    - Handle edge cases where data format is ambiguous

    Show me the exact detection and conversion logic.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('=== GEMINI AI RESPONSE ===');
    console.log(response.text());
    console.log('=== END RESPONSE ===');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

askGemini();