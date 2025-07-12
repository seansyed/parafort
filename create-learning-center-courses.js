// Script to populate Learning Center with 12 comprehensive courses for Gold Plan subscribers
import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const coursesData = [
  {
    title: "Strategic Marketing",
    slug: "strategic-marketing",
    shortDescription: "Master marketing fundamentals and develop winning strategies",
    description: "Learn how to develop effective marketing strategies that drive business growth. This comprehensive course covers market research, target audience identification, brand positioning, and multi-channel marketing campaigns.",
    category: "Marketing",
    difficulty: "intermediate",
    estimatedDuration: 240, // 4 hours
    courseOrder: 1,
    learningObjectives: ["Develop comprehensive marketing strategies", "Identify and analyze target markets", "Create effective brand positioning", "Design multi-channel campaigns"],
    tags: ["marketing", "strategy", "branding", "campaigns"],
    modules: [
      {
        title: "Marketing Fundamentals",
        description: "Understanding core marketing concepts and principles",
        moduleOrder: 1,
        estimatedDuration: 60,
        lessons: [
          { title: "Introduction to Strategic Marketing", lessonType: "video", lessonOrder: 1, estimatedDuration: 15 },
          { title: "Market Analysis Techniques", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 20 },
          { title: "Customer Segmentation", lessonType: "video", lessonOrder: 3, estimatedDuration: 25 }
        ]
      },
      {
        title: "Brand Development",
        description: "Creating and positioning your brand effectively",
        moduleOrder: 2,
        estimatedDuration: 90,
        lessons: [
          { title: "Brand Identity Creation", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Brand Positioning Strategies", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Brand Communication", lessonType: "text", lessonOrder: 3, estimatedDuration: 25 }
        ]
      },
      {
        title: "Campaign Implementation",
        description: "Executing successful marketing campaigns",
        moduleOrder: 3,
        estimatedDuration: 90,
        lessons: [
          { title: "Digital Marketing Channels", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Campaign Measurement", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "ROI Optimization", lessonType: "video", lessonOrder: 3, estimatedDuration: 30 }
        ]
      }
    ]
  },
  {
    title: "Your People",
    slug: "your-people",
    shortDescription: "Build and manage high-performing teams",
    description: "Discover strategies for recruiting, developing, and retaining top talent. Learn effective leadership techniques, team dynamics, and performance management systems.",
    category: "Human Resources",
    difficulty: "intermediate",
    estimatedDuration: 300, // 5 hours
    courseOrder: 2,
    learningObjectives: ["Master recruitment and hiring processes", "Develop leadership skills", "Implement performance management", "Create positive team culture"],
    tags: ["hr", "leadership", "team-building", "performance"],
    modules: [
      {
        title: "Talent Acquisition",
        description: "Finding and hiring the right people",
        moduleOrder: 1,
        estimatedDuration: 100,
        lessons: [
          { title: "Defining Role Requirements", lessonType: "text", lessonOrder: 1, estimatedDuration: 25 },
          { title: "Recruitment Strategies", lessonType: "video", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Interview Techniques", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 40 }
        ]
      },
      {
        title: "Leadership Development",
        description: "Building effective leadership capabilities",
        moduleOrder: 2,
        estimatedDuration: 100,
        lessons: [
          { title: "Leadership Styles", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Communication Skills", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Conflict Resolution", lessonType: "video", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Performance Management",
        description: "Managing and optimizing team performance",
        moduleOrder: 3,
        estimatedDuration: 100,
        lessons: [
          { title: "Goal Setting", lessonType: "text", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Performance Reviews", lessonType: "video", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Employee Development", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 35 }
        ]
      }
    ]
  },
  {
    title: "Business Financial Strategy",
    slug: "business-financial-strategy",
    shortDescription: "Master financial planning and strategic decision-making",
    description: "Learn essential financial management skills including budgeting, forecasting, cash flow management, and strategic financial planning for sustainable business growth.",
    category: "Finance",
    difficulty: "advanced",
    estimatedDuration: 360, // 6 hours
    courseOrder: 3,
    learningObjectives: ["Create comprehensive financial plans", "Manage cash flow effectively", "Analyze financial performance", "Make strategic investment decisions"],
    tags: ["finance", "budgeting", "strategy", "analysis"],
    modules: [
      {
        title: "Financial Fundamentals",
        description: "Core financial concepts for business owners",
        moduleOrder: 1,
        estimatedDuration: 120,
        lessons: [
          { title: "Financial Statements Overview", lessonType: "video", lessonOrder: 1, estimatedDuration: 40 },
          { title: "Cash Flow Analysis", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 40 },
          { title: "Financial Ratios", lessonType: "text", lessonOrder: 3, estimatedDuration: 40 }
        ]
      },
      {
        title: "Strategic Planning",
        description: "Long-term financial planning and strategy",
        moduleOrder: 2,
        estimatedDuration: 120,
        lessons: [
          { title: "Business Valuation", lessonType: "video", lessonOrder: 1, estimatedDuration: 45 },
          { title: "Investment Analysis", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 40 },
          { title: "Risk Management", lessonType: "video", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Growth Financing",
        description: "Funding strategies for business expansion",
        moduleOrder: 3,
        estimatedDuration: 120,
        lessons: [
          { title: "Funding Options", lessonType: "text", lessonOrder: 1, estimatedDuration: 40 },
          { title: "Investor Relations", lessonType: "video", lessonOrder: 2, estimatedDuration: 40 },
          { title: "Financial Projections", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 40 }
        ]
      }
    ]
  },
  {
    title: "Access to Capital",
    slug: "access-to-capital",
    shortDescription: "Navigate funding options and secure business capital",
    description: "Explore various funding sources from bootstrapping to venture capital. Learn how to prepare compelling investment proposals and build relationships with investors.",
    category: "Finance",
    difficulty: "advanced",
    estimatedDuration: 280, // 4.67 hours
    courseOrder: 4,
    learningObjectives: ["Identify appropriate funding sources", "Prepare investment proposals", "Build investor relationships", "Understand equity and debt financing"],
    tags: ["funding", "investment", "capital", "proposals"],
    modules: [
      {
        title: "Funding Landscape",
        description: "Overview of available funding options",
        moduleOrder: 1,
        estimatedDuration: 90,
        lessons: [
          { title: "Bootstrapping Strategies", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Traditional Bank Loans", lessonType: "text", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Alternative Financing", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Investment Preparation",
        description: "Preparing for investment rounds",
        moduleOrder: 2,
        estimatedDuration: 95,
        lessons: [
          { title: "Business Plan Development", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "Financial Projections", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Pitch Deck Creation", lessonType: "video", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Investor Relations",
        description: "Building and maintaining investor relationships",
        moduleOrder: 3,
        estimatedDuration: 95,
        lessons: [
          { title: "Finding Investors", lessonType: "text", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Due Diligence Process", lessonType: "video", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Negotiating Terms", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 30 }
        ]
      }
    ]
  },
  {
    title: "Government Contracting",
    slug: "government-contracting",
    shortDescription: "Navigate government contracts and procurement processes",
    description: "Learn how to identify, bid on, and win government contracts. Understand compliance requirements, certification processes, and relationship building with government agencies.",
    category: "Business Development",
    difficulty: "advanced",
    estimatedDuration: 320, // 5.33 hours
    courseOrder: 5,
    learningObjectives: ["Navigate government procurement systems", "Prepare competitive proposals", "Understand compliance requirements", "Build government relationships"],
    tags: ["government", "contracts", "procurement", "compliance"],
    modules: [
      {
        title: "Government Market Overview",
        description: "Understanding the government contracting landscape",
        moduleOrder: 1,
        estimatedDuration: 100,
        lessons: [
          { title: "Federal vs State vs Local", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "Procurement Processes", lessonType: "text", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Market Research", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Certification and Registration",
        description: "Getting certified to do business with government",
        moduleOrder: 2,
        estimatedDuration: 110,
        lessons: [
          { title: "SAM Registration", lessonType: "video", lessonOrder: 1, estimatedDuration: 40 },
          { title: "Small Business Certifications", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Security Clearances", lessonType: "text", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Proposal Development",
        description: "Creating winning government proposals",
        moduleOrder: 3,
        estimatedDuration: 110,
        lessons: [
          { title: "RFP Analysis", lessonType: "video", lessonOrder: 1, estimatedDuration: 40 },
          { title: "Proposal Writing", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Pricing Strategies", lessonType: "video", lessonOrder: 3, estimatedDuration: 35 }
        ]
      }
    ]
  },
  {
    title: "Partnerships",
    slug: "partnerships",
    shortDescription: "Build strategic partnerships for business growth",
    description: "Discover how to identify, develop, and manage strategic partnerships that accelerate business growth. Learn partnership structures, negotiation tactics, and relationship management.",
    category: "Business Development",
    difficulty: "intermediate",
    estimatedDuration: 260, // 4.33 hours
    courseOrder: 6,
    learningObjectives: ["Identify strategic partnership opportunities", "Structure partnership agreements", "Negotiate win-win deals", "Manage partnership relationships"],
    tags: ["partnerships", "alliances", "negotiation", "relationships"],
    modules: [
      {
        title: "Partnership Strategy",
        description: "Developing a strategic approach to partnerships",
        moduleOrder: 1,
        estimatedDuration: 85,
        lessons: [
          { title: "Partnership Types", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Strategic Planning", lessonType: "text", lessonOrder: 2, estimatedDuration: 25 },
          { title: "Partner Identification", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Partnership Development",
        description: "Building and structuring partnerships",
        moduleOrder: 2,
        estimatedDuration: 90,
        lessons: [
          { title: "Initial Outreach", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Value Proposition", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Agreement Structure", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Partnership Management",
        description: "Managing ongoing partnership relationships",
        moduleOrder: 3,
        estimatedDuration: 85,
        lessons: [
          { title: "Performance Monitoring", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Communication Strategies", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 25 },
          { title: "Conflict Resolution", lessonType: "video", lessonOrder: 3, estimatedDuration: 30 }
        ]
      }
    ]
  },
  {
    title: "Entrepreneurial Leadership",
    slug: "entrepreneurial-leadership",
    shortDescription: "Develop leadership skills for entrepreneurial success",
    description: "Build essential leadership capabilities for entrepreneurs including vision setting, team building, decision making, and organizational culture development.",
    category: "Leadership",
    difficulty: "intermediate",
    estimatedDuration: 290, // 4.83 hours
    courseOrder: 7,
    learningObjectives: ["Develop entrepreneurial mindset", "Build visionary leadership skills", "Create organizational culture", "Master decision-making processes"],
    tags: ["leadership", "entrepreneurship", "vision", "culture"],
    modules: [
      {
        title: "Entrepreneurial Mindset",
        description: "Developing the right mindset for entrepreneurial success",
        moduleOrder: 1,
        estimatedDuration: 95,
        lessons: [
          { title: "Risk and Opportunity", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Innovation Thinking", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Resilience Building", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Vision and Strategy",
        description: "Creating and communicating compelling vision",
        moduleOrder: 2,
        estimatedDuration: 100,
        lessons: [
          { title: "Vision Development", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "Strategic Communication", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Change Management", lessonType: "video", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Organizational Development",
        description: "Building strong organizational foundations",
        moduleOrder: 3,
        estimatedDuration: 95,
        lessons: [
          { title: "Culture Creation", lessonType: "text", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Team Dynamics", lessonType: "video", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Performance Systems", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 30 }
        ]
      }
    ]
  },
  {
    title: "Managing Sales",
    slug: "managing-sales",
    shortDescription: "Build and manage high-performing sales teams",
    description: "Learn how to develop sales strategies, build sales teams, implement sales processes, and drive consistent revenue growth through effective sales management.",
    category: "Sales",
    difficulty: "intermediate",
    estimatedDuration: 270, // 4.5 hours
    courseOrder: 8,
    learningObjectives: ["Develop sales strategies", "Build sales teams", "Implement sales processes", "Manage sales performance"],
    tags: ["sales", "management", "revenue", "process"],
    modules: [
      {
        title: "Sales Strategy",
        description: "Developing comprehensive sales strategies",
        moduleOrder: 1,
        estimatedDuration: 90,
        lessons: [
          { title: "Sales Planning", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Target Market Analysis", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Competitive Positioning", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Sales Team Building",
        description: "Recruiting and developing sales talent",
        moduleOrder: 2,
        estimatedDuration: 90,
        lessons: [
          { title: "Sales Hiring", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Sales Training", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Compensation Design", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Sales Operations",
        description: "Implementing effective sales processes",
        moduleOrder: 3,
        estimatedDuration: 90,
        lessons: [
          { title: "Sales Process Design", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "CRM Implementation", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Sales Analytics", lessonType: "video", lessonOrder: 3, estimatedDuration: 30 }
        ]
      }
    ]
  },
  {
    title: "Growing Globally",
    slug: "growing-globally",
    shortDescription: "Expand your business into international markets",
    description: "Navigate the complexities of international business expansion including market entry strategies, cultural considerations, legal requirements, and operational challenges.",
    category: "Business Development",
    difficulty: "advanced",
    estimatedDuration: 340, // 5.67 hours
    courseOrder: 9,
    learningObjectives: ["Develop international expansion strategies", "Navigate cultural differences", "Understand legal requirements", "Manage global operations"],
    tags: ["international", "expansion", "global", "markets"],
    modules: [
      {
        title: "Global Market Analysis",
        description: "Analyzing international market opportunities",
        moduleOrder: 1,
        estimatedDuration: 115,
        lessons: [
          { title: "Market Research", lessonType: "video", lessonOrder: 1, estimatedDuration: 40 },
          { title: "Competitive Analysis", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Entry Strategy", lessonType: "text", lessonOrder: 3, estimatedDuration: 40 }
        ]
      },
      {
        title: "Cultural and Legal Considerations",
        description: "Understanding international business environments",
        moduleOrder: 2,
        estimatedDuration: 115,
        lessons: [
          { title: "Cultural Intelligence", lessonType: "video", lessonOrder: 1, estimatedDuration: 40 },
          { title: "Legal Requirements", lessonType: "text", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Regulatory Compliance", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 40 }
        ]
      },
      {
        title: "International Operations",
        description: "Managing global business operations",
        moduleOrder: 3,
        estimatedDuration: 110,
        lessons: [
          { title: "Supply Chain Management", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "International Finance", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 40 },
          { title: "Global Team Management", lessonType: "video", lessonOrder: 3, estimatedDuration: 35 }
        ]
      }
    ]
  },
  {
    title: "Opportunity and Innovation",
    slug: "opportunity-and-innovation",
    shortDescription: "Identify opportunities and drive innovation in your business",
    description: "Learn systematic approaches to opportunity identification, innovation management, and creating competitive advantages through continuous innovation.",
    category: "Innovation",
    difficulty: "intermediate",
    estimatedDuration: 250, // 4.17 hours
    courseOrder: 10,
    learningObjectives: ["Identify market opportunities", "Manage innovation processes", "Create competitive advantages", "Foster innovative culture"],
    tags: ["innovation", "opportunity", "creativity", "competitive-advantage"],
    modules: [
      {
        title: "Opportunity Recognition",
        description: "Systematic approaches to identifying opportunities",
        moduleOrder: 1,
        estimatedDuration: 85,
        lessons: [
          { title: "Market Scanning", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Trend Analysis", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 25 },
          { title: "Customer Insights", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Innovation Management",
        description: "Managing the innovation process effectively",
        moduleOrder: 2,
        estimatedDuration: 85,
        lessons: [
          { title: "Innovation Framework", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Idea Generation", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 25 },
          { title: "Innovation Portfolio", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Innovation Culture",
        description: "Building a culture that supports innovation",
        moduleOrder: 3,
        estimatedDuration: 80,
        lessons: [
          { title: "Creative Environment", lessonType: "video", lessonOrder: 1, estimatedDuration: 25 },
          { title: "Risk Taking", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Learning Organization", lessonType: "text", lessonOrder: 3, estimatedDuration: 25 }
        ]
      }
    ]
  },
  {
    title: "Opportunity Assessment",
    slug: "opportunity-assessment",
    shortDescription: "Evaluate and prioritize business opportunities effectively",
    description: "Master frameworks and tools for systematically evaluating business opportunities, conducting feasibility studies, and making informed investment decisions.",
    category: "Strategy",
    difficulty: "advanced",
    estimatedDuration: 300, // 5 hours
    courseOrder: 11,
    learningObjectives: ["Develop assessment frameworks", "Conduct feasibility analysis", "Prioritize opportunities", "Make investment decisions"],
    tags: ["assessment", "evaluation", "feasibility", "decision-making"],
    modules: [
      {
        title: "Assessment Frameworks",
        description: "Systematic approaches to opportunity evaluation",
        moduleOrder: 1,
        estimatedDuration: 100,
        lessons: [
          { title: "Evaluation Criteria", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "Scoring Models", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Risk Assessment", lessonType: "text", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Feasibility Analysis",
        description: "Conducting comprehensive feasibility studies",
        moduleOrder: 2,
        estimatedDuration: 100,
        lessons: [
          { title: "Market Feasibility", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "Technical Feasibility", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Financial Feasibility", lessonType: "text", lessonOrder: 3, estimatedDuration: 35 }
        ]
      },
      {
        title: "Decision Making",
        description: "Making informed opportunity investment decisions",
        moduleOrder: 3,
        estimatedDuration: 100,
        lessons: [
          { title: "Decision Trees", lessonType: "video", lessonOrder: 1, estimatedDuration: 35 },
          { title: "Portfolio Management", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Implementation Planning", lessonType: "text", lessonOrder: 3, estimatedDuration: 35 }
        ]
      }
    ]
  },
  {
    title: "Military Spouse Pathway to Business",
    slug: "military-spouse-pathway-to-business",
    shortDescription: "Specialized guidance for military spouses starting businesses",
    description: "Comprehensive course designed specifically for military spouses, covering unique challenges, available resources, networking strategies, and business opportunities in the military community.",
    category: "Specialized",
    difficulty: "beginner",
    estimatedDuration: 280, // 4.67 hours
    courseOrder: 12,
    learningObjectives: ["Navigate military lifestyle challenges", "Access military spouse resources", "Build military community networks", "Develop portable business models"],
    tags: ["military-spouse", "entrepreneurship", "resources", "community"],
    modules: [
      {
        title: "Military Spouse Challenges",
        description: "Understanding unique challenges and opportunities",
        moduleOrder: 1,
        estimatedDuration: 95,
        lessons: [
          { title: "Frequent Relocations", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Deployment Cycles", lessonType: "text", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Portable Business Models", lessonType: "interactive", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Military Resources",
        description: "Leveraging available military and veteran resources",
        moduleOrder: 2,
        estimatedDuration: 95,
        lessons: [
          { title: "SBA Veterans Programs", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Military Spouse Organizations", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 35 },
          { title: "Base Resources", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      },
      {
        title: "Community Building",
        description: "Building networks within the military community",
        moduleOrder: 3,
        estimatedDuration: 90,
        lessons: [
          { title: "Military Spouse Networks", lessonType: "video", lessonOrder: 1, estimatedDuration: 30 },
          { title: "Online Communities", lessonType: "interactive", lessonOrder: 2, estimatedDuration: 30 },
          { title: "Military Market Opportunities", lessonType: "text", lessonOrder: 3, estimatedDuration: 30 }
        ]
      }
    ]
  }
];

async function createLearningCenterData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Creating Learning Center courses and content...');
    
    for (const courseData of coursesData) {
      // Insert course
      const courseResult = await client.query(`
        INSERT INTO courses (
          title, slug, short_description, description, category, 
          difficulty, estimated_duration, course_order, 
          learning_objectives, tags, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        courseData.title,
        courseData.slug,
        courseData.shortDescription,
        courseData.description,
        courseData.category,
        courseData.difficulty,
        courseData.estimatedDuration,
        courseData.courseOrder,
        JSON.stringify(courseData.learningObjectives),
        JSON.stringify(courseData.tags),
        true
      ]);
      
      const courseId = courseResult.rows[0].id;
      console.log(`Created course: ${courseData.title} (ID: ${courseId})`);
      
      // Insert modules for this course
      for (const moduleData of courseData.modules) {
        const moduleResult = await client.query(`
          INSERT INTO course_modules (
            course_id, title, description, module_order, 
            estimated_duration, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
          courseId,
          moduleData.title,
          moduleData.description,
          moduleData.moduleOrder,
          moduleData.estimatedDuration,
          true
        ]);
        
        const moduleId = moduleResult.rows[0].id;
        console.log(`  Created module: ${moduleData.title} (ID: ${moduleId})`);
        
        // Insert lessons for this module
        for (const lessonData of moduleData.lessons) {
          await client.query(`
            INSERT INTO course_lessons (
              module_id, title, lesson_type, lesson_order, 
              estimated_duration, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            moduleId,
            lessonData.title,
            lessonData.lessonType,
            lessonData.lessonOrder,
            lessonData.estimatedDuration,
            true
          ]);
          
          console.log(`    Created lesson: ${lessonData.title}`);
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('\n✅ Learning Center data created successfully!');
    console.log(`📚 Created ${coursesData.length} courses with comprehensive modules and lessons`);
    console.log('🎓 Learning Center is now ready for Gold Plan subscribers');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating Learning Center data:', error);
    throw error;
  } finally {
    client.release();
  }
}

createLearningCenterData()
  .then(() => {
    console.log('Learning Center setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to setup Learning Center:', error);
    process.exit(1);
  });