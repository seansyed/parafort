/**
 * Add Remaining Course Modules to Strategic Marketing Excellence
 * Complete the comprehensive blueprint with beautiful visual design
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function addRemainingCourseModules() {
  console.log('🎓 Adding remaining course modules...');

  try {
    // Create Module 2: The Blueprint - Building Your Strategic Framework
    const module2 = await sql`INSERT INTO path_sections (
      path_id, title, description, section_order, estimated_duration
    ) VALUES (
      1, 
      'Module 2: The Blueprint - Building Your Strategic Framework',
      'Transform market intelligence into coherent brand identity, compelling messaging, and a clear, measurable action plan.',
      2,
      150
    ) RETURNING id`;

    // Module 2 Steps
    await sql`INSERT INTO section_steps (section_id, title, content, step_type, step_order, estimated_duration) VALUES
      (${module2[0].id}, 'Brand Architecture - Beyond Logos to Brand Identity', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Brand Architecture Workshop</h1>
           <p class="text-lg opacity-90">Build the foundational framework that guides every brand decision</p>
         </div>

         <div class="brand-pyramid bg-white p-6 rounded-lg shadow-lg border mb-6">
           <h3 class="text-lg font-semibold mb-4 text-center">🏗️ The Brand Pyramid</h3>
           <div class="pyramid-levels space-y-4">
             <div class="level bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500 text-center">
               <h4 class="font-bold text-yellow-700">Emotional Benefits</h4>
               <p class="text-sm text-yellow-600">How your brand makes people feel</p>
             </div>
             <div class="level bg-green-100 p-4 rounded-lg border-l-4 border-green-500 text-center">
               <h4 class="font-bold text-green-700">Functional Benefits</h4>
               <p class="text-sm text-green-600">What your product actually does</p>
             </div>
             <div class="level bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500 text-center">
               <h4 class="font-bold text-blue-700">Product Features</h4>
               <p class="text-sm text-blue-600">Tangible characteristics and capabilities</p>
             </div>
           </div>
         </div>

         <div class="brand-foundation bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">🎯 Brand Foundation Elements</h3>
           <div class="foundation-grid grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="element-card bg-white p-4 rounded-lg border">
               <h4 class="font-semibold text-purple-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 2L3 7v11h14V7l-7-5z"/>
                 </svg>
                 Mission Statement
               </h4>
               <p class="text-sm text-gray-600">Why your company exists beyond making money</p>
               <div class="example bg-purple-50 p-2 rounded mt-2 text-xs italic">
                 "To democratize access to quality education for entrepreneurs"
               </div>
             </div>
             <div class="element-card bg-white p-4 rounded-lg border">
               <h4 class="font-semibold text-blue-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M4 8a4 4 0 018 0v1h1a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2h1V8z"/>
                 </svg>
                 Vision Statement
               </h4>
               <p class="text-sm text-gray-600">The future state you want to create</p>
               <div class="example bg-blue-50 p-2 rounded mt-2 text-xs italic">
                 "A world where every entrepreneur has the tools to succeed"
               </div>
             </div>
             <div class="element-card bg-white p-4 rounded-lg border">
               <h4 class="font-semibold text-green-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                 </svg>
                 Core Values
               </h4>
               <p class="text-sm text-gray-600">Principles that guide your decisions</p>
               <div class="example bg-green-50 p-2 rounded mt-2 text-xs italic">
                 "Excellence, Integrity, Innovation, Customer-First"
               </div>
             </div>
             <div class="element-card bg-white p-4 rounded-lg border">
               <h4 class="font-semibold text-orange-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z"/>
                 </svg>
                 Brand Personality
               </h4>
               <p class="text-sm text-gray-600">Human characteristics of your brand</p>
               <div class="example bg-orange-50 p-2 rounded mt-2 text-xs italic">
                 "Professional yet approachable, confident but humble"
               </div>
             </div>
           </div>
         </div>

         <div class="voice-tone-guide bg-indigo-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-indigo-800">🗣️ Brand Voice & Tone Guide</h3>
           <div class="voice-examples grid grid-cols-1 md:grid-cols-3 gap-4">
             <div class="voice-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-green-600 mb-2">✅ We Are</h4>
               <ul class="text-sm space-y-1">
                 <li>• Confident but not arrogant</li>
                 <li>• Clear and direct</li>
                 <li>• Helpful and educational</li>
                 <li>• Professional yet warm</li>
               </ul>
             </div>
             <div class="voice-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-red-600 mb-2">❌ We Are Not</h4>
               <ul class="text-sm space-y-1">
                 <li>• Pushy or aggressive</li>
                 <li>• Technical jargon-heavy</li>
                 <li>• Overly casual or silly</li>
                 <li>• Condescending or superior</li>
               </ul>
             </div>
             <div class="voice-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-blue-600 mb-2">📝 Writing Style</h4>
               <ul class="text-sm space-y-1">
                 <li>• Use active voice</li>
                 <li>• Write in second person</li>
                 <li>• Keep sentences concise</li>
                 <li>• Include specific examples</li>
               </ul>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Complete the Brand Architecture worksheet: Define your mission, vision, values, and create your voice/tone guidelines.</p>
         </div>
       </div>', 
       'assignment', 0, 45),

      (${module2[0].id}, 'Strategic Messaging Hierarchy - Your Communication Framework', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Strategic Messaging Hierarchy</h1>
           <p class="text-lg opacity-90">Create consistent messaging for every context and touchpoint</p>
         </div>

         <div class="storybrand-framework bg-blue-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-blue-800">📖 StoryBrand Framework</h3>
           <div class="story-elements grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div class="story-card bg-white p-4 rounded border-t-4 border-blue-500">
               <h4 class="font-bold text-blue-700">1. Character</h4>
               <p class="text-sm text-gray-600">Your customer is the hero</p>
             </div>
             <div class="story-card bg-white p-4 rounded border-t-4 border-red-500">
               <h4 class="font-bold text-red-700">2. Problem</h4>
               <p class="text-sm text-gray-600">What challenge do they face?</p>
             </div>
             <div class="story-card bg-white p-4 rounded border-t-4 border-green-500">
               <h4 class="font-bold text-green-700">3. Guide</h4>
               <p class="text-sm text-gray-600">You are the wise mentor</p>
             </div>
             <div class="story-card bg-white p-4 rounded border-t-4 border-purple-500">
               <h4 class="font-bold text-purple-700">4. Plan</h4>
               <p class="text-sm text-gray-600">Simple steps to success</p>
             </div>
             <div class="story-card bg-white p-4 rounded border-t-4 border-orange-500">
               <h4 class="font-bold text-orange-700">5. Call to Action</h4>
               <p class="text-sm text-gray-600">Clear next step</p>
             </div>
             <div class="story-card bg-white p-4 rounded border-t-4 border-indigo-500">
               <h4 class="font-bold text-indigo-700">6. Success</h4>
               <p class="text-sm text-gray-600">The happy ending</p>
             </div>
           </div>
         </div>

         <div class="messaging-hierarchy bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">🏗️ The Messaging Hierarchy</h3>
           <div class="hierarchy-levels space-y-4">
             <div class="level-1 bg-white p-4 rounded-lg border-l-4 border-purple-500">
               <h4 class="font-bold text-purple-700 mb-2">Level 1: Tagline (3-7 words)</h4>
               <p class="text-sm text-gray-600 mb-2">The essence of your brand in its simplest form</p>
               <div class="example bg-purple-50 p-3 rounded">
                 <p class="text-sm font-semibold">"Growth Through Strategy"</p>
                 <p class="text-xs text-purple-600">Example: Nike - "Just Do It"</p>
               </div>
             </div>
             <div class="level-2 bg-white p-4 rounded-lg border-l-4 border-blue-500">
               <h4 class="font-bold text-blue-700 mb-2">Level 2: Elevator Pitch (30 seconds)</h4>
               <p class="text-sm text-gray-600 mb-2">Complete explanation of what you do and for whom</p>
               <div class="example bg-blue-50 p-3 rounded">
                 <p class="text-sm">"We help small business owners stop random marketing activities and build strategic frameworks that drive predictable growth."</p>
               </div>
             </div>
             <div class="level-3 bg-white p-4 rounded-lg border-l-4 border-green-500">
               <h4 class="font-bold text-green-700 mb-2">Level 3: Core Pillars (3-4 key themes)</h4>
               <p class="text-sm text-gray-600 mb-2">Main benefits/themes you consistently communicate</p>
               <div class="example bg-green-50 p-3 rounded">
                 <div class="pillars grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                   <div class="pillar bg-white p-2 rounded border">Strategic Foundation</div>
                   <div class="pillar bg-white p-2 rounded border">Measurable Results</div>
                   <div class="pillar bg-white p-2 rounded border">Systematic Growth</div>
                 </div>
               </div>
             </div>
             <div class="level-4 bg-white p-4 rounded-lg border-l-4 border-orange-500">
               <h4 class="font-bold text-orange-700 mb-2">Level 4: Proof Points</h4>
               <p class="text-sm text-gray-600 mb-2">Statistics, testimonials, case studies that support your pillars</p>
               <div class="example bg-orange-50 p-3 rounded">
                 <div class="proof-points text-xs space-y-1">
                   <p>• "94% of clients see growth within 90 days"</p>
                   <p>• "From $10K to $100K in 18 months - Sarah M."</p>
                   <p>• "Featured in Forbes, Entrepreneur, Inc."</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div class="messaging-templates bg-gray-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">📝 Messaging Templates</h3>
           <div class="templates grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="template bg-white p-4 rounded border">
               <h4 class="font-semibold text-blue-700 mb-2">Website Homepage</h4>
               <div class="template-structure text-sm space-y-2">
                 <div class="bg-blue-50 p-2 rounded">Level 1: Hero headline</div>
                 <div class="bg-blue-50 p-2 rounded">Level 2: Subheading</div>
                 <div class="bg-blue-50 p-2 rounded">Level 3: Feature sections</div>
                 <div class="bg-blue-50 p-2 rounded">Level 4: Social proof</div>
               </div>
             </div>
             <div class="template bg-white p-4 rounded border">
               <h4 class="font-semibold text-green-700 mb-2">Social Media Bio</h4>
               <div class="template-structure text-sm space-y-2">
                 <div class="bg-green-50 p-2 rounded">Level 1: Profile tagline</div>
                 <div class="bg-green-50 p-2 rounded">Level 2: What you do</div>
                 <div class="bg-green-50 p-2 rounded">Level 4: Key proof point</div>
               </div>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Write your complete Messaging Hierarchy using the framework. This becomes your "cheat sheet" for all future content creation.</p>
         </div>
       </div>', 
       'assignment', 1, 50),

      (${module2[0].id}, 'GOST Framework - Your 12-Month Strategic Action Plan', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">GOST Planning Framework</h1>
           <p class="text-lg opacity-90">Transform strategic thinking into actionable 12-month roadmap</p>
         </div>

         <div class="gost-overview bg-white p-6 rounded-lg shadow-lg border mb-6">
           <h3 class="text-lg font-semibold mb-4 text-center">🎯 GOST Framework Overview</h3>
           <div class="gost-levels grid grid-cols-1 md:grid-cols-4 gap-4">
             <div class="level bg-blue-50 p-4 rounded-lg text-center border-t-4 border-blue-500">
               <h4 class="font-bold text-blue-700 mb-2">Goals</h4>
               <p class="text-xs text-gray-600">High-level business outcomes (12 months)</p>
               <div class="icon bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mt-2">
                 <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 2L3 7v11h14V7l-7-5z"/>
                 </svg>
               </div>
             </div>
             <div class="level bg-green-50 p-4 rounded-lg text-center border-t-4 border-green-500">
               <h4 class="font-bold text-green-700 mb-2">Objectives</h4>
               <p class="text-xs text-gray-600">Specific, measurable milestones (quarterly)</p>
               <div class="icon bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mt-2">
                 <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                 </svg>
               </div>
             </div>
             <div class="level bg-purple-50 p-4 rounded-lg text-center border-t-4 border-purple-500">
               <h4 class="font-bold text-purple-700 mb-2">Strategies</h4>
               <p class="text-xs text-gray-600">Broad approaches to achieve objectives</p>
               <div class="icon bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mt-2">
                 <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                 </svg>
               </div>
             </div>
             <div class="level bg-orange-50 p-4 rounded-lg text-center border-t-4 border-orange-500">
               <h4 class="font-bold text-orange-700 mb-2">Tactics</h4>
               <p class="text-xs text-gray-600">Specific actions and activities</p>
               <div class="icon bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mt-2">
                 <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                 </svg>
               </div>
             </div>
           </div>
         </div>

         <div class="gost-workshop bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">🛠️ GOST Planning Workshop</h3>
           
           <div class="workshop-section mb-6">
             <h4 class="font-semibold text-blue-700 mb-3">Step 1: Set Your Goals (1-3 High-Level Outcomes)</h4>
             <div class="goal-examples bg-white p-4 rounded border">
               <div class="examples grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div class="example bg-blue-50 p-3 rounded">
                   <p class="font-semibold text-sm">Revenue Goal</p>
                   <p class="text-xs text-gray-600">"Increase annual revenue by 150%"</p>
                 </div>
                 <div class="example bg-green-50 p-3 rounded">
                   <p class="font-semibold text-sm">Market Goal</p>
                   <p class="text-xs text-gray-600">"Become recognized leader in our niche"</p>
                 </div>
                 <div class="example bg-purple-50 p-3 rounded">
                   <p class="font-semibold text-sm">Customer Goal</p>
                   <p class="text-xs text-gray-600">"Build community of 5,000 engaged customers"</p>
                 </div>
               </div>
             </div>
           </div>

           <div class="workshop-section mb-6">
             <h4 class="font-semibold text-green-700 mb-3">Step 2: Define SMART Objectives (Quarterly Milestones)</h4>
             <div class="smart-framework bg-white p-4 rounded border">
               <div class="smart-criteria grid grid-cols-1 md:grid-cols-5 gap-2 text-center">
                 <div class="criteria bg-red-50 p-2 rounded text-xs">
                   <strong>S</strong>pecific
                 </div>
                 <div class="criteria bg-blue-50 p-2 rounded text-xs">
                   <strong>M</strong>easurable
                 </div>
                 <div class="criteria bg-green-50 p-2 rounded text-xs">
                   <strong>A</strong>chievable
                 </div>
                 <div class="criteria bg-yellow-50 p-2 rounded text-xs">
                   <strong>R</strong>elevant
                 </div>
                 <div class="criteria bg-purple-50 p-2 rounded text-xs">
                   <strong>T</strong>ime-bound
                 </div>
               </div>
               <div class="objective-example bg-gray-50 p-3 rounded mt-3">
                 <p class="text-sm italic">"Generate 200 Marketing Qualified Leads in Q1 with a target Cost Per Lead of $50 through content marketing and paid ads"</p>
               </div>
             </div>
           </div>

           <div class="workshop-section mb-6">
             <h4 class="font-semibold text-purple-700 mb-3">Step 3: Choose Your Strategies (Broad Approaches)</h4>
             <div class="strategy-examples bg-white p-4 rounded border">
               <div class="strategies grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div class="strategy bg-purple-50 p-3 rounded">
                   <h5 class="font-semibold text-sm">Content Authority Strategy</h5>
                   <p class="text-xs text-gray-600">"Establish thought leadership through valuable, educational content"</p>
                 </div>
                 <div class="strategy bg-blue-50 p-3 rounded">
                   <h5 class="font-semibold text-sm">Community Building Strategy</h5>
                   <p class="text-xs text-gray-600">"Build engaged community around our expertise and values"</p>
                 </div>
                 <div class="strategy bg-green-50 p-3 rounded">
                   <h5 class="font-semibold text-sm">Partnership Strategy</h5>
                   <p class="text-xs text-gray-600">"Leverage strategic partnerships for mutual growth"</p>
                 </div>
                 <div class="strategy bg-orange-50 p-3 rounded">
                   <h5 class="font-semibold text-sm">Customer Success Strategy</h5>
                   <p class="text-xs text-gray-600">"Turn customers into advocates through exceptional experience"</p>
                 </div>
               </div>
             </div>
           </div>

           <div class="workshop-section">
             <h4 class="font-semibold text-orange-700 mb-3">Step 4: Plan Your Tactics (Specific Actions)</h4>
             <div class="tactics-examples bg-white p-4 rounded border">
               <div class="tactics-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div class="tactic-group">
                   <h5 class="font-semibold text-sm mb-2">Content Tactics</h5>
                   <ul class="text-xs space-y-1 text-gray-600">
                     <li>• Weekly podcast episodes</li>
                     <li>• Bi-weekly blog posts</li>
                     <li>• Monthly webinar series</li>
                     <li>• Daily social media posts</li>
                   </ul>
                 </div>
                 <div class="tactic-group">
                   <h5 class="font-semibold text-sm mb-2">Engagement Tactics</h5>
                   <ul class="text-xs space-y-1 text-gray-600">
                     <li>• Monthly newsletter</li>
                     <li>• Quarterly customer surveys</li>
                     <li>• Live Q&A sessions</li>
                     <li>• Industry conference speaking</li>
                   </ul>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div class="planning-template bg-yellow-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-yellow-800">📋 12-Month Planning Template</h3>
           <div class="template-structure bg-white p-4 rounded border">
             <div class="quarters grid grid-cols-1 md:grid-cols-4 gap-4">
               <div class="quarter bg-blue-50 p-3 rounded">
                 <h4 class="font-semibold text-blue-700 text-sm">Q1 Focus</h4>
                 <p class="text-xs text-gray-600">Foundation & Launch</p>
               </div>
               <div class="quarter bg-green-50 p-3 rounded">
                 <h4 class="font-semibold text-green-700 text-sm">Q2 Focus</h4>
                 <p class="text-xs text-gray-600">Growth & Optimization</p>
               </div>
               <div class="quarter bg-purple-50 p-3 rounded">
                 <h4 class="font-semibold text-purple-700 text-sm">Q3 Focus</h4>
                 <p class="text-xs text-gray-600">Scale & Expansion</p>
               </div>
               <div class="quarter bg-orange-50 p-3 rounded">
                 <h4 class="font-semibold text-orange-700 text-sm">Q4 Focus</h4>
                 <p class="text-xs text-gray-600">Refinement & Planning</p>
               </div>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Complete your 12-Month GOST Framework with detailed quarterly focus areas and specific tactics for Q1 implementation.</p>
         </div>
       </div>', 
       'assignment', 2, 55)`;

    console.log('✅ Module 2: Strategic Framework completed!');

    // Create Module 3: The Engine - Customer Acquisition System
    const module3 = await sql`INSERT INTO path_sections (
      path_id, title, description, section_order, estimated_duration
    ) VALUES (
      1, 
      'Module 3: The Engine - Designing Your Customer Acquisition System',
      'Strategically select and build core marketing channels that reliably attract and convert your ideal customers.',
      3,
      180
    ) RETURNING id`;

    // Module 3 Steps
    await sql`INSERT INTO section_steps (section_id, title, content, step_type, step_order, estimated_duration) VALUES
      (${module3[0].id}, 'Digital Hub Architecture - High-Converting Website Design', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Your Digital Hub Strategy</h1>
           <p class="text-lg opacity-90">Design a website that converts visitors into customers</p>
         </div>

         <div class="homepage-anatomy bg-white p-6 rounded-lg shadow-lg border mb-6">
           <h3 class="text-lg font-semibold mb-4">🏠 Perfect Homepage Anatomy</h3>
           <div class="homepage-sections space-y-4">
             <div class="section bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
               <h4 class="font-bold text-red-700 mb-2">Above the Fold (Critical 3 seconds)</h4>
               <div class="elements grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div class="element bg-white p-3 rounded border">
                   <h5 class="font-semibold text-sm">Clear Value Proposition</h5>
                   <p class="text-xs text-gray-600">"What you do + who you serve"</p>
                 </div>
                 <div class="element bg-white p-3 rounded border">
                   <h5 class="font-semibold text-sm">Primary CTA Button</h5>
                   <p class="text-xs text-gray-600">"Get Started", "Book Demo"</p>
                 </div>
                 <div class="element bg-white p-3 rounded border">
                   <h5 class="font-semibold text-sm">Hero Image/Video</h5>
                   <p class="text-xs text-gray-600">Visual representation</p>
                 </div>
               </div>
             </div>
             <div class="section bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
               <h4 class="font-bold text-blue-700 mb-2">Social Proof Section</h4>
               <div class="proof-elements grid grid-cols-1 md:grid-cols-4 gap-2">
                 <div class="element bg-white p-2 rounded text-xs text-center">Customer Logos</div>
                 <div class="element bg-white p-2 rounded text-xs text-center">Testimonials</div>
                 <div class="element bg-white p-2 rounded text-xs text-center">Case Studies</div>
                 <div class="element bg-white p-2 rounded text-xs text-center">Awards/Media</div>
               </div>
             </div>
             <div class="section bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
               <h4 class="font-bold text-green-700 mb-2">Features/Benefits Section</h4>
               <p class="text-sm text-gray-600">3-4 key features with clear benefits for each</p>
             </div>
             <div class="section bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
               <h4 class="font-bold text-purple-700 mb-2">Trust Building Elements</h4>
               <div class="trust-elements grid grid-cols-1 md:grid-cols-3 gap-2">
                 <div class="element bg-white p-2 rounded text-xs text-center">Security Badges</div>
                 <div class="element bg-white p-2 rounded text-xs text-center">Guarantee</div>
                 <div class="element bg-white p-2 rounded text-xs text-center">Contact Info</div>
               </div>
             </div>
           </div>
         </div>

         <div class="psychological-triggers bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">🧠 Psychological Conversion Triggers</h3>
           <div class="triggers grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="trigger-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-orange-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                 </svg>
                 Social Proof
               </h4>
               <ul class="text-sm space-y-1">
                 <li>• Customer testimonials with photos</li>
                 <li>• Usage statistics ("10,000+ users")</li>
                 <li>• Media mentions and awards</li>
                 <li>• Real-time activity notifications</li>
               </ul>
             </div>
             <div class="trigger-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-red-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                 </svg>
                 Scarcity & Urgency
               </h4>
               <ul class="text-sm space-y-1">
                 <li>• Limited-time offers</li>
                 <li>• Stock availability counters</li>
                 <li>• Deadline timers</li>
                 <li>• Exclusive access messaging</li>
               </ul>
             </div>
             <div class="trigger-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-blue-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                 </svg>
                 Authority Signals
               </h4>
               <ul class="text-sm space-y-1">
                 <li>• Professional credentials</li>
                 <li>• Industry certifications</li>
                 <li>• Speaking engagements</li>
                 <li>• Published expertise</li>
               </ul>
             </div>
             <div class="trigger-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-green-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                 </svg>
                 Risk Reversal
               </h4>
               <ul class="text-sm space-y-1">
                 <li>• Money-back guarantees</li>
                 <li>• Free trial periods</li>
                 <li>• "No questions asked" policies</li>
                 <li>• Success guarantees</li>
               </ul>
             </div>
           </div>
         </div>

         <div class="seo-fundamentals bg-green-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-green-800">🔍 On-Page SEO Fundamentals</h3>
           <div class="seo-checklist grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="checklist-section">
               <h4 class="font-semibold text-green-700 mb-3">Technical SEO Basics</h4>
               <div class="checklist space-y-2">
                 <div class="item flex items-center">
                   <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                   </svg>
                   <span class="text-sm">Unique, descriptive title tags</span>
                 </div>
                 <div class="item flex items-center">
                   <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                   </svg>
                   <span class="text-sm">Compelling meta descriptions</span>
                 </div>
                 <div class="item flex items-center">
                   <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                   </svg>
                   <span class="text-sm">Proper header tag hierarchy (H1, H2, H3)</span>
                 </div>
                 <div class="item flex items-center">
                   <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                   </svg>
                   <span class="text-sm">Image alt text optimization</span>
                 </div>
               </div>
             </div>
             <div class="checklist-section">
               <h4 class="font-semibold text-green-700 mb-3">Keyword Strategy</h4>
               <div class="keyword-approach bg-white p-4 rounded border">
                 <div class="keyword-types space-y-3">
                   <div class="type">
                     <h5 class="font-semibold text-sm">Primary Keywords</h5>
                     <p class="text-xs text-gray-600">Main terms your ideal customers search for</p>
                   </div>
                   <div class="type">
                     <h5 class="font-semibold text-sm">Long-tail Keywords</h5>
                     <p class="text-xs text-gray-600">Specific, lower-competition phrases</p>
                   </div>
                   <div class="type">
                     <h5 class="font-semibold text-sm">Intent-based Keywords</h5>
                     <p class="text-xs text-gray-600">Terms that indicate buying intent</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Audit your current website against the Perfect Homepage Anatomy checklist. Identify top 3 improvements needed for better conversion.</p>
         </div>
       </div>', 
       'assignment', 0, 50),

      (${module3[0].id}, 'Content as Strategic Asset - Pillar & Cluster Strategy', 
       '<div class="learning-content">
         <div class="hero-section bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-lg mb-6 text-white">
           <h1 class="text-2xl font-bold mb-2">Content as Strategic Asset</h1>
           <p class="text-lg opacity-90">Build authority and SEO dominance through systematic content strategy</p>
         </div>

         <div class="pillar-cluster-overview bg-white p-6 rounded-lg shadow-lg border mb-6">
           <h3 class="text-lg font-semibold mb-4">🏗️ Pillar & Cluster Content Architecture</h3>
           <div class="architecture-visual bg-gray-50 p-4 rounded">
             <div class="pillar-example text-center mb-4">
               <div class="pillar bg-blue-500 text-white p-4 rounded-lg mx-auto max-w-sm">
                 <h4 class="font-bold">PILLAR PAGE</h4>
                 <p class="text-sm">"Ultimate Guide to Digital Marketing Strategy"</p>
                 <p class="text-xs opacity-90">Comprehensive, authoritative content</p>
               </div>
             </div>
             <div class="clusters grid grid-cols-2 md:grid-cols-4 gap-3">
               <div class="cluster bg-green-100 p-3 rounded text-center">
                 <p class="text-xs font-semibold">SEO Strategy</p>
                 <p class="text-xs text-gray-600">Cluster Post</p>
               </div>
               <div class="cluster bg-green-100 p-3 rounded text-center">
                 <p class="text-xs font-semibold">Social Media Strategy</p>
                 <p class="text-xs text-gray-600">Cluster Post</p>
               </div>
               <div class="cluster bg-green-100 p-3 rounded text-center">
                 <p class="text-xs font-semibold">Email Marketing</p>
                 <p class="text-xs text-gray-600">Cluster Post</p>
               </div>
               <div class="cluster bg-green-100 p-3 rounded text-center">
                 <p class="text-xs font-semibold">Content Marketing</p>
                 <p class="text-xs text-gray-600">Cluster Post</p>
               </div>
             </div>
             <div class="connections mt-3 text-center">
               <p class="text-xs text-gray-600">All cluster posts link back to pillar page</p>
             </div>
           </div>
         </div>

         <div class="content-benefits bg-blue-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-blue-800">🎯 Why Pillar & Cluster Works</h3>
           <div class="benefits grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="benefit-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-blue-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                 </svg>
                 SEO Authority Building
               </h4>
               <p class="text-sm text-gray-600">Google recognizes topical authority when multiple related pages link to comprehensive pillar content</p>
             </div>
             <div class="benefit-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-green-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                 </svg>
                 User Experience
               </h4>
               <p class="text-sm text-gray-600">Visitors find comprehensive information organized logically, keeping them engaged longer</p>
             </div>
             <div class="benefit-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-purple-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                 </svg>
                 Content Efficiency
               </h4>
               <p class="text-sm text-gray-600">Strategic content creation vs. random blog posts - every piece serves the larger strategy</p>
             </div>
             <div class="benefit-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-orange-700 mb-2 flex items-center">
                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                 </svg>
                 Lead Generation
               </h4>
               <p class="text-sm text-gray-600">Pillar pages become powerful lead magnets and demonstrate expertise to prospects</p>
             </div>
           </div>
         </div>

         <div class="content-planning bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4">📋 Content Planning Matrix</h3>
           <div class="planning-framework bg-white p-4 rounded border">
             <div class="framework-steps space-y-4">
               <div class="step bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                 <h4 class="font-semibold text-yellow-700">Step 1: Identify Your Pillar Topics</h4>
                 <p class="text-sm text-gray-600">3-5 broad topics your ideal customers care about most</p>
                 <div class="examples mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                   <div class="example bg-white p-2 rounded border text-xs">Digital Marketing Strategy</div>
                   <div class="example bg-white p-2 rounded border text-xs">Customer Acquisition</div>
                   <div class="example bg-white p-2 rounded border text-xs">Business Growth</div>
                 </div>
               </div>
               <div class="step bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                 <h4 class="font-semibold text-blue-700">Step 2: Create Comprehensive Pillar Pages</h4>
                 <div class="pillar-requirements text-sm space-y-1">
                   <p>• 3,000-5,000 words of authoritative content</p>
                   <p>• Cover the topic comprehensively</p>
                   <p>• Include multimedia (images, videos, infographics)</p>
                   <p>• Optimize for head keywords</p>
                 </div>
               </div>
               <div class="step bg-green-50 p-3 rounded border-l-4 border-green-500">
                 <h4 class="font-semibold text-green-700">Step 3: Develop Supporting Cluster Content</h4>
                 <div class="cluster-requirements text-sm space-y-1">
                   <p>• 8-12 cluster posts per pillar topic</p>
                   <p>• 1,000-2,000 words each</p>
                   <p>• Target long-tail keywords</p>
                   <p>• All link back to pillar page</p>
                 </div>
               </div>
               <div class="step bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                 <h4 class="font-semibold text-purple-700">Step 4: Create Content Calendar</h4>
                 <div class="calendar-structure text-sm space-y-1">
                   <p>• 1 pillar page per quarter</p>
                   <p>• 2-3 cluster posts per month</p>
                   <p>• Mix content types (how-to, case studies, tools)</p>
                   <p>• Promote across all channels</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div class="content-brainstorming bg-orange-50 p-6 rounded-lg mb-6">
           <h3 class="text-lg font-semibold mb-4 text-orange-800">🧠 Content Brainstorming Techniques</h3>
           <div class="brainstorming-methods grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="method-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-orange-700 mb-2">Customer Questions Method</h4>
               <ul class="text-sm space-y-1">
                 <li>• Sales team FAQ compilation</li>
                 <li>• Customer support ticket analysis</li>
                 <li>• Social media question monitoring</li>
                 <li>• Forum and community research</li>
               </ul>
             </div>
             <div class="method-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-blue-700 mb-2">Competitor Content Gaps</h4>
               <ul class="text-sm space-y-1">
                 <li>• Analyze competitor content</li>
                 <li>• Identify missing topics</li>
                 <li>• Find improvement opportunities</li>
                 <li>• Create better, more comprehensive content</li>
               </ul>
             </div>
             <div class="method-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-green-700 mb-2">Keyword Research</h4>
               <ul class="text-sm space-y-1">
                 <li>• Use tools like SEMrush, Ahrefs</li>
                 <li>• Focus on search intent</li>
                 <li>• Target question-based queries</li>
                 <li>• Look for featured snippet opportunities</li>
               </ul>
             </div>
             <div class="method-card bg-white p-4 rounded border">
               <h4 class="font-semibold text-purple-700 mb-2">Internal Data Mining</h4>
               <ul class="text-sm space-y-1">
                 <li>• Analyze website search queries</li>
                 <li>• Review email response patterns</li>
                 <li>• Study user behavior analytics</li>
                 <li>• Survey existing customers</li>
               </ul>
             </div>
           </div>
         </div>

         <div class="action-section bg-green-50 p-6 rounded-lg">
           <h3 class="text-lg font-semibold mb-2 text-green-800">📝 Your Action Item</h3>
           <p class="text-green-700">Choose your first pillar topic and brainstorm 10 cluster content ideas. Create a 3-month content calendar with publication schedule.</p>
         </div>
       </div>', 
       'assignment', 1, 60)`;

    console.log('✅ Module 3: Customer Acquisition System started!');
    console.log('📊 Advanced Learning System now includes:');
    console.log('   - Module 0: Mindset Shift (2 lessons)');
    console.log('   - Module 1: Market Intelligence (3 lessons)');
    console.log('   - Module 2: Strategic Framework (3 lessons)');
    console.log('   - Module 3: Customer Acquisition (2+ lessons)');
    console.log('   - Beautiful visual design with icons, frameworks, and interactive elements');

  } catch (error) {
    console.error('❌ Error adding course modules:', error);
    throw error;
  }
}

addRemainingCourseModules().catch(console.error);