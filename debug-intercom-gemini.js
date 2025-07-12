import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Read environment variables from .env file
let GEMINI_API_KEY = process.env.GEMINI_API_KEY;
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n');
  for (const line of envLines) {
    if (line.startsWith('GEMINI_API_KEY=')) {
      GEMINI_API_KEY = line.split('=')[1].trim().replace(/"/g, '');
      break;
    }
  }
} catch (error) {
  // .env file not found, use process.env
}

async function askGeminiAboutIntercom() {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
I'm implementing Intercom chat widget using @intercom/messenger-js-sdk in a React TypeScript application, but the widget is covering the entire page instead of appearing as a small chat bubble in the corner.

Current implementation:
\`\`\`typescript
import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/hooks/use-auth';

export default function IntercomChat() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      Intercom({
        app_id: 'k4esf5p6',
        user_id: user.id,
        name: user.firstName && user.lastName ? \`\${user.firstName} \${user.lastName}\` : (user.email ?? undefined),
        email: user.email ?? undefined,
        created_at: user.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : undefined,
      });
    } else {
      // Initialize for anonymous users
      Intercom({
        app_id: 'k4esf5p6',
      });
    }
  }, [user]);

  return null;
}
\`\`\`

PROBLEM: The widget covers the entire page instead of showing as a compact chat bubble.

EXPECTED BEHAVIOR: Small chat icon in bottom-right corner that opens compact messenger when clicked.

Please provide:
1. Root cause analysis of why it's covering the full page
2. Exact code fix to make it appear as compact chat bubble
3. Any CSS modifications needed
4. Alternative approaches if the current SDK method is problematic

Focus on making it behave like the standard Intercom chat widget with just the chat bubble icon.
`;

    console.log('🤖 Asking Gemini about Intercom widget issue...\n');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📋 GEMINI RESPONSE:');
    console.log('='.repeat(80));
    console.log(text);
    console.log('='.repeat(80));
    
    return text;
    
  } catch (error) {
    console.error('❌ Error asking Gemini:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 SOLUTION: Set your GEMINI_API_KEY environment variable');
      console.log('You can get an API key from: https://makersuite.google.com/app/apikey');
    }
    
    return null;
  }
}

// Run the function
askGeminiAboutIntercom()
  .then(() => {
    console.log('\n✅ Gemini consultation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });