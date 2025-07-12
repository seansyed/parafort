/**
 * Update Strategic Marketing Excellence Course
 * Replace existing course with new comprehensive blueprint
 * Enhanced with beautiful visual design elements
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function updateStrategicMarketingCourse() {
  console.log('🎓 Updating Strategic Marketing Excellence Course...');

  try {
    // First, delete existing sections and steps for Strategic Marketing Excellence (path_id = 1)
    await sql`DELETE FROM user_step_progress WHERE step_id IN (
      SELECT id FROM section_steps WHERE section_id IN (
        SELECT id FROM path_sections WHERE path_id = 1
      )
    )`;
    
    await sql`DELETE FROM user_path_progress WHERE path_id = 1`;
    
    await sql`DELETE FROM section_steps WHERE section_id IN (
      SELECT id FROM path_sections WHERE path_id = 1
    )`;
    
    await sql`DELETE FROM path_sections WHERE path_id = 1`;

    // Update the main learning path
    const learningObjectives = [
      "Master the Strategy-First Pyramid framework for all marketing decisions",
      "Conduct deep customer discovery using Jobs-to-Be-Done methodology", 
      "Build unshakeable market intelligence and competitive positioning",
      "Create a comprehensive brand identity and strategic messaging hierarchy",
      "Design systematic customer acquisition and retention systems",
      "Implement data-driven measurement and optimization processes"
    ];
    
    const tags = ["marketing", "strategy", "growth", "business development", "analytics", "brand building"];
    
    await sql`UPDATE learning_paths SET 
      title = 'Strategic Marketing Excellence: The New Business Owner''s Blueprint',
      description = 'Stop "Doing" Marketing. Start Driving Growth. Move beyond fleeting tactics to build a durable, strategic framework that aligns every marketing action with core business objectives.',
      short_description = 'Transform from tactical marketing to strategic growth mastery',
      estimated_duration = 720,
      learning_objectives = ${learningObjectives},
      tags = ${tags}
    WHERE id = 1`;

    // Create Module 0: The Mindset Shift
    const module0 = await sql`INSERT INTO path_sections (
      path_id, title, description, section_order, estimated_duration
    ) VALUES (
      1, 
      'Module 0: The Mindset Shift - From Founder to Chief Marketing Officer',
      'Deprogram the "tactical-chasing" mindset and install a CEO-level strategic perspective on marketing''s role in business growth.',
      0,
      60
    ) RETURNING id`;

    // Module 0 Steps
    await sql`INSERT INTO section_steps (section_id, title, content, step_type, step_order, estimated_duration) VALUES
      (${module0[0].id}, 'The End of "Random Acts of Marketing"', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-lg mb-6 text-white">
           <div class="flex items-center mb-4">
             <div class="bg-white bg-opacity-20 p-3 rounded-full mr-4">
               <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
               </svg>
             </div>
             <h1 class="text-2xl font-bold">Breaking Free from the Marketing Hamster Wheel</h1>
           </div>
           <p class="text-lg opacity-90">Most business owners are busy with marketing activity but going nowhere. Today we change that forever.</p>
         </div>

         <div class="framework-section bg-blue-50 p-6 rounded-lg mb-6">
           <h2 class="text-xl font-semibold mb-4 flex items-center">
             <svg class="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
               <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
             </svg>
             The Strategy-First Pyramid
           </h2>
           <div class="pyramid-visual bg-white p-4 rounded border-2 border-blue-200">
             <div class="text-center space-y-2">
               <div class="bg-purple-100 p-2 rounded font-semibold">🎯 Business Goals</div>
               <div class="bg-blue-100 p-2 rounded font-semibold">📊 Objectives</div>
               <div class="bg-green-100 p-2 rounded font-semibold">🎯 Strategy</div>
               <div class="bg-yellow-100 p-2 rounded font-semibold">⚡ Tactics</div>
               <div class="bg-red-100 p-2 rounded font-semibold">📈 Measurement</div>
             </div>
           </div>
         </div>

         <div class="definitions-section">
           <h3 class="text-lg font-semibold mb-4">Crystal Clear Definitions</h3>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="definition-card bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
               <h4 class="font-semibold text-purple-700">Goal</h4>
               <p class="text-sm text-gray-600">Increase revenue by 50%</p>
             </div>
             <div class="definition-card bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
               <h4 class="font-semibold text-blue-700">Objective</h4>
               <p class="text-sm text-gray-600">Acquire 500 new customers in Q3</p>
             </div>
             <div class="definition-card bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
               <h4 class="font-semibold text-green-700">Strategy</h4>
               <p class="text-sm text-gray-600">Become the dominant content authority in our niche</p>
             </div>
             <div class="definition-card bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
               <h4 class="font-semibold text-yellow-700">Tactic</h4>
               <p class="text-sm text-gray-600">Publish two blog posts per week</p>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg mt-6">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Audit your last three marketing activities. Were they strategic or tactical? Map them to clear business objectives in your workbook.</p>
         </div>
       </div>', 
       'reading', 0, 25),

      (${module0[0].id}, 'The Three Growth Levers & Marketing Mission', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">The Three Growth Levers</h1>
           <p class="text-lg opacity-90">Every marketing initiative must serve one of these three levers</p>
         </div>

         <div class="levers-section grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
           <div class="lever-card bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
             <div class="text-center mb-4">
               <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                 <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                 </svg>
               </div>
               <h3 class="font-bold text-lg text-blue-700">Lever #1</h3>
               <h4 class="font-semibold">More Customers</h4>
             </div>
             <p class="text-sm text-gray-600 text-center">Increase the number of clients/customers</p>
             <div class="example-box bg-blue-50 p-3 rounded mt-4">
               <p class="text-xs font-semibold text-blue-800">Example: HubSpot''s Inbound Machine</p>
             </div>
           </div>

           <div class="lever-card bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
             <div class="text-center mb-4">
               <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                 <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 14a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2z"/>
                 </svg>
               </div>
               <h3 class="font-bold text-lg text-green-700">Lever #2</h3>
               <h4 class="font-semibold">Higher Transaction Size</h4>
             </div>
             <p class="text-sm text-gray-600 text-center">Increase average purchase amount</p>
             <div class="example-box bg-green-50 p-3 rounded mt-4">
               <p class="text-xs font-semibold text-green-800">Example: McDonald''s "Supersize That?"</p>
             </div>
           </div>

           <div class="lever-card bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-500">
             <div class="text-center mb-4">
               <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                 <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M4 2a1 1 0 011 1v2.586l8.707 8.707a1 1 0 01-1.414 1.414L4 7.414V10a1 1 0 11-2 0V3a1 1 0 011-1h7a1 1 0 110 2H4z"/>
                 </svg>
               </div>
               <h3 class="font-bold text-lg text-purple-700">Lever #3</h3>
               <h4 class="font-semibold">Purchase Frequency</h4>
             </div>
             <p class="text-sm text-gray-600 text-center">Increase how often customers buy</p>
             <div class="example-box bg-purple-50 p-3 rounded mt-4">
               <p class="text-xs font-semibold text-purple-800">Example: Amazon Prime Membership</p>
             </div>
           </div>
         </div>

         <div class="mission-section bg-orange-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-4 text-orange-800">🎯 Your Marketing Mission Statement</h3>
           <p class="text-orange-700 mb-4">A single sentence defining how marketing drives business success</p>
           <div class="template bg-white p-4 rounded border-2 border-orange-200">
             <p class="text-sm italic text-gray-600">"Our marketing function will [specific action] to [business outcome] by [method/approach]"</p>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg mt-6">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Brainstorm one initiative for each growth lever. Write your Marketing Mission Statement draft.</p>
         </div>
       </div>', 
       'reading', 1, 30)`;

    // Create Module 1: The Foundation
    const module1 = await sql`INSERT INTO path_sections (
      path_id, title, description, section_order, estimated_duration
    ) VALUES (
      1, 
      'Module 1: The Foundation - Unshakeable Market Intelligence',
      'Achieve profound clarity on your customer, competition, and unique market position through strategic research and positioning frameworks.',
      1,
      120
    ) RETURNING id`;

    // Module 1 Steps
    await sql`INSERT INTO section_steps (section_id, title, content, step_type, step_order, estimated_duration) VALUES
      (${module1[0].id}, 'Deep Customer Discovery - Jobs to be Done Framework', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Beyond Demographics: Real Customer Insights</h1>
           <p class="text-lg opacity-90">Discover what customers truly "hire" your product to do</p>
         </div>

         <div class="comparison-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div class="old-way bg-red-50 p-6 rounded-lg border-2 border-red-200">
             <h3 class="font-bold text-red-700 mb-3">❌ The Old Way</h3>
             <div class="persona-card bg-white p-4 rounded border">
               <h4 class="font-semibold">Sarah, 35</h4>
               <ul class="text-sm text-gray-600 space-y-1">
                 <li>• Lives in suburbs</li>
                 <li>• Married, 2 kids</li>
                 <li>• $75k household income</li>
                 <li>• Shops at Target</li>
               </ul>
             </div>
             <p class="text-red-600 text-sm mt-3 font-semibold">Dangerously incomplete!</p>
           </div>

           <div class="new-way bg-green-50 p-6 rounded-lg border-2 border-green-200">
             <h3 class="font-bold text-green-700 mb-3">✅ The JTBD Way</h3>
             <div class="jobs-card bg-white p-4 rounded border">
               <h4 class="font-semibold mb-2">Customer "Hires" Product For:</h4>
               <div class="space-y-2">
                 <div class="job-type bg-blue-100 p-2 rounded text-sm">
                   <strong>Functional:</strong> Save time on meal planning
                 </div>
                 <div class="job-type bg-purple-100 p-2 rounded text-sm">
                   <strong>Social:</strong> Feel like a good parent
                 </div>
                 <div class="job-type bg-orange-100 p-2 rounded text-sm">
                   <strong>Emotional:</strong> Reduce weekday stress
                 </div>
               </div>
             </div>
             <p class="text-green-600 text-sm mt-3 font-semibold">Actionable insights!</p>
           </div>
         </div>

         <div class="interview-guide bg-blue-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-blue-800">📋 Customer Interview Script Template</h3>
           <div class="script-sections space-y-4">
             <div class="script-section bg-white p-4 rounded border">
               <h4 class="font-semibold mb-2">Opening Questions</h4>
               <ul class="text-sm space-y-1">
                 <li>• "Tell me about the last time you [used our product/service]"</li>
                 <li>• "What were you hoping to accomplish?"</li>
                 <li>• "What was the situation that led you to look for a solution?"</li>
               </ul>
             </div>
             <div class="script-section bg-white p-4 rounded border">
               <h4 class="font-semibold mb-2">The Switch Analysis</h4>
               <ul class="text-sm space-y-1">
                 <li>• "What were you using before?"</li>
                 <li>• "What wasn''t working about that solution?"</li>
                 <li>• "What finally triggered you to make a change?"</li>
               </ul>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Conduct at least two customer discovery interviews using the provided script. Document the "Jobs" customers hire your product for.</p>
         </div>
       </div>', 
       'reading', 0, 35),

      (${module1[0].id}, 'Strategic Persona & Buyer Journey Mapping', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-teal-500 to-green-500 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Strategic Persona Development</h1>
           <p class="text-lg opacity-90">Transform JTBD insights into actionable customer profiles</p>
         </div>

         <div class="persona-template bg-white p-6 rounded-lg shadow-lg border mb-6">
           <h3 class="text-lg font-semibold mb-4">🎯 Strategic Persona Template</h3>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="persona-section">
               <h4 class="font-semibold text-purple-700 mb-2">Core Identity</h4>
               <div class="space-y-2 text-sm">
                 <div class="field bg-purple-50 p-2 rounded">Name & Role</div>
                 <div class="field bg-purple-50 p-2 rounded">Primary "Job to be Done"</div>
                 <div class="field bg-purple-50 p-2 rounded">Current Solution</div>
               </div>
             </div>
             <div class="persona-section">
               <h4 class="font-semibold text-blue-700 mb-2">Pain & Gain Profile</h4>
               <div class="space-y-2 text-sm">
                 <div class="field bg-blue-50 p-2 rounded">Top 3 Frustrations</div>
                 <div class="field bg-blue-50 p-2 rounded">Desired Outcomes</div>
                 <div class="field bg-blue-50 p-2 rounded">Success Metrics</div>
               </div>
             </div>
             <div class="persona-section">
               <h4 class="font-semibold text-green-700 mb-2">Behavioral Insights</h4>
               <div class="space-y-2 text-sm">
                 <div class="field bg-green-50 p-2 rounded">Information Sources</div>
                 <div class="field bg-green-50 p-2 rounded">Decision Criteria</div>
                 <div class="field bg-green-50 p-2 rounded">Buying Triggers</div>
               </div>
             </div>
             <div class="persona-section">
               <h4 class="font-semibold text-orange-700 mb-2">Watering Holes</h4>
               <div class="space-y-2 text-sm">
                 <div class="field bg-orange-50 p-2 rounded">Online Communities</div>
                 <div class="field bg-orange-50 p-2 rounded">Content Preferences</div>
                 <div class="field bg-orange-50 p-2 rounded">Offline Channels</div>
               </div>
             </div>
           </div>
         </div>

         <div class="journey-mapping bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">🗺️ Buyer Journey Mapping</h3>
           <div class="journey-stages grid grid-cols-1 md:grid-cols-4 gap-4">
             <div class="stage-card bg-white p-4 rounded-lg border-t-4 border-yellow-400">
               <h4 class="font-bold text-yellow-600 mb-2">Awareness</h4>
               <div class="stage-questions text-xs space-y-1">
                 <p>• What problem becomes apparent?</p>
                 <p>• How do they describe it?</p>
                 <p>• What triggers the search?</p>
               </div>
             </div>
             <div class="stage-card bg-white p-4 rounded-lg border-t-4 border-blue-400">
               <h4 class="font-bold text-blue-600 mb-2">Consideration</h4>
               <div class="stage-questions text-xs space-y-1">
                 <p>• What solutions do they research?</p>
                 <p>• What are their evaluation criteria?</p>
                 <p>• Who influences the decision?</p>
               </div>
             </div>
             <div class="stage-card bg-white p-4 rounded-lg border-t-4 border-green-400">
               <h4 class="font-bold text-green-600 mb-2">Decision</h4>
               <div class="stage-questions text-xs space-y-1">
                 <p>• What makes them choose you?</p>
                 <p>• What are final anxieties?</p>
                 <p>• What seals the deal?</p>
               </div>
             </div>
             <div class="stage-card bg-white p-4 rounded-lg border-t-4 border-purple-400">
               <h4 class="font-bold text-purple-600 mb-2">Loyalty</h4>
               <div class="stage-questions text-xs space-y-1">
                 <p>• What creates delight?</p>
                 <p>• How do they become advocates?</p>
                 <p>• What drives repeat purchases?</p>
               </div>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Create one detailed Strategic Persona using the template and map their complete Buyer Journey.</p>
         </div>
       </div>', 
       'reading', 1, 40),

      (${module1[0].id}, 'Competitive Analysis & Unassailable Positioning', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Strategic Competitive Analysis</h1>
           <p class="text-lg opacity-90">Go beyond their website to understand their strategy</p>
         </div>

         <div class="analysis-framework bg-blue-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-blue-800">🔍 Competitive Intelligence Framework</h3>
           <div class="analysis-areas grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="analysis-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-blue-700 mb-2">Messaging Analysis</h4>
               <ul class="text-sm space-y-1">
                 <li>• Homepage value proposition</li>
                 <li>• Key messages & themes</li>
                 <li>• Tone of voice & personality</li>
                 <li>• Claims & proof points</li>
               </ul>
             </div>
             <div class="analysis-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-green-700 mb-2">Content Strategy</h4>
               <ul class="text-sm space-y-1">
                 <li>• Blog topics & frequency</li>
                 <li>• Social media presence</li>
                 <li>• Lead magnets & offers</li>
                 <li>• SEO keyword targets</li>
               </ul>
             </div>
             <div class="analysis-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-purple-700 mb-2">Customer Feedback</h4>
               <ul class="text-sm space-y-1">
                 <li>• Review site analysis</li>
                 <li>• Common complaints</li>
                 <li>• Praised features</li>
                 <li>• Unmet needs</li>
               </ul>
             </div>
             <div class="analysis-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-orange-700 mb-2">Marketing Tactics</h4>
               <ul class="text-sm space-y-1">
                 <li>• Ad campaign analysis</li>
                 <li>• Email marketing approach</li>
                 <li>• Partnership strategy</li>
                 <li>• Pricing positioning</li>
               </ul>
             </div>
           </div>
         </div>

         <div class="value-prop-canvas bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">🎯 Value Proposition Canvas</h3>
           <div class="canvas-sections grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="customer-profile bg-white p-4 rounded-lg border">
               <h4 class="font-bold text-blue-700 mb-3 text-center">Customer Profile</h4>
               <div class="profile-sections space-y-3">
                 <div class="section">
                   <h5 class="font-semibold text-red-600 text-sm">Pain Points</h5>
                   <div class="bg-red-50 p-2 rounded text-xs">What frustrates them?</div>
                 </div>
                 <div class="section">
                   <h5 class="font-semibold text-green-600 text-sm">Gain Desires</h5>
                   <div class="bg-green-50 p-2 rounded text-xs">What outcomes do they want?</div>
                 </div>
                 <div class="section">
                   <h5 class="font-semibold text-blue-600 text-sm">Jobs to be Done</h5>
                   <div class="bg-blue-50 p-2 rounded text-xs">What are they trying to accomplish?</div>
                 </div>
               </div>
             </div>
             <div class="value-map bg-white p-4 rounded-lg border">
               <h4 class="font-bold text-purple-700 mb-3 text-center">Value Map</h4>
               <div class="value-sections space-y-3">
                 <div class="section">
                   <h5 class="font-semibold text-red-600 text-sm">Pain Relievers</h5>
                   <div class="bg-red-50 p-2 rounded text-xs">How you solve their problems</div>
                 </div>
                 <div class="section">
                   <h5 class="font-semibold text-green-600 text-sm">Gain Creators</h5>
                   <div class="bg-green-50 p-2 rounded text-xs">How you create value for them</div>
                 </div>
                 <div class="section">
                   <h5 class="font-semibold text-blue-600 text-sm">Products & Services</h5>
                   <div class="bg-blue-50 p-2 rounded text-xs">What you offer</div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div class="positioning-workshop bg-purple-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-purple-800">📝 Positioning Statement Workshop</h3>
           <div class="positioning-formula bg-white p-4 rounded border-2 border-purple-200">
             <h4 class="font-semibold mb-3">The Positioning Formula</h4>
             <div class="formula text-sm leading-relaxed">
               <span class="font-semibold text-blue-600">For</span> <span class="bg-blue-100 px-2 py-1 rounded">[target customer]</span>
               <span class="font-semibold text-green-600"> who</span> <span class="bg-green-100 px-2 py-1 rounded">[statement of need/opportunity]</span>, <br/><br/>
               <span class="bg-purple-100 px-2 py-1 rounded">[product/brand name]</span> <span class="font-semibold text-purple-600">is a</span> 
               <span class="bg-purple-100 px-2 py-1 rounded">[product category]</span> <span class="font-semibold text-purple-600">that</span> 
               <span class="bg-purple-100 px-2 py-1 rounded">[statement of benefit/differentiation]</span>. <br/><br/>
               <span class="font-semibold text-red-600">Unlike</span> <span class="bg-red-100 px-2 py-1 rounded">[primary competitor]</span>, 
               <span class="font-semibold text-red-600">we</span> <span class="bg-red-100 px-2 py-1 rounded">[key differentiator]</span>.
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Complete the Value Proposition Canvas and write your final positioning statement. This becomes the cornerstone of your marketing strategy.</p>
         </div>
       </div>', 
       'assignment', 2, 45)`;

    console.log('✅ Strategic Marketing Excellence course updated successfully!');
    console.log('📊 Course now includes:');
    console.log('   - Module 0: Mindset Shift (2 lessons)');
    console.log('   - Module 1: Market Intelligence Foundation (3 lessons)');
    console.log('   - Enhanced visual design with icons, progress bars, and structured content');
    console.log('   - Interactive frameworks and templates');
    console.log('   - Action items and practical exercises');

  } catch (error) {
    console.error('❌ Error updating course:', error);
    throw error;
  }
}

updateStrategicMarketingCourse().catch(console.error);