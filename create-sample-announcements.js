import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Neon
if (typeof WebSocket === 'undefined') {
  global.WebSocket = ws;
}

async function createSampleAnnouncements() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  try {
    console.log('Creating sample announcements...');

    // Create announcements table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'general',
        priority VARCHAR(20) DEFAULT 'normal',
        status VARCHAR(20) DEFAULT 'draft',
        target_audience VARCHAR(50) DEFAULT 'all',
        scheduled_date TIMESTAMP,
        publish_date TIMESTAMP,
        expiration_date TIMESTAMP,
        display_location VARCHAR(50) DEFAULT 'dashboard',
        dismissible BOOLEAN DEFAULT true,
        view_count INTEGER DEFAULT 0,
        click_count INTEGER DEFAULT 0,
        dismiss_count INTEGER DEFAULT 0,
        has_call_to_action BOOLEAN DEFAULT false,
        cta_text VARCHAR(100),
        cta_url VARCHAR(500),
        cta_type VARCHAR(50),
        background_color VARCHAR(20) DEFAULT '#10b981',
        text_color VARCHAR(20) DEFAULT '#ffffff',
        icon_type VARCHAR(50) DEFAULT 'info',
        auto_hide BOOLEAN DEFAULT false,
        auto_hide_delay INTEGER,
        specific_pages TEXT[],
        specific_user_ids TEXT[],
        created_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create announcement_interactions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcement_interactions (
        id SERIAL PRIMARY KEY,
        announcement_id INTEGER REFERENCES announcements(id) ON DELETE CASCADE,
        user_id VARCHAR(50) NOT NULL,
        interaction_type VARCHAR(50) NOT NULL,
        interaction_data JSONB,
        is_dismissed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample announcements
    const sampleAnnouncements = [
      {
        title: 'Welcome to ParaFort Business Services!',
        content: 'Start your business formation journey today with our comprehensive suite of services. Get expert guidance and streamlined processes.',
        type: 'promotion',
        priority: 'high',
        status: 'published',
        target_audience: 'all',
        display_location: 'dashboard',
        dismissible: true,
        has_call_to_action: true,
        cta_text: 'Start Your Business',
        cta_url: '/business-formation-service',
        background_color: '#10b981',
        text_color: '#ffffff',
        icon_type: 'announcement',
        created_by: 'system'
      },
      {
        title: 'New Feature: AI Business Name Generator',
        content: 'Generate unique and available business names with our AI-powered tool. Check domain availability and trademark status instantly.',
        type: 'feature',
        priority: 'normal',
        status: 'published',
        target_audience: 'all',
        display_location: 'dashboard',
        dismissible: true,
        has_call_to_action: true,
        cta_text: 'Try Name Generator',
        cta_url: '/business-name-generator',
        background_color: '#3b82f6',
        text_color: '#ffffff',
        icon_type: 'info',
        created_by: 'system'
      },
      {
        title: 'Annual Report Filing Deadline Reminder',
        content: 'Don\'t forget to file your annual report! Most states require annual filings to maintain good standing. We can help you stay compliant.',
        type: 'general',
        priority: 'urgent',
        status: 'published',
        target_audience: 'clients',
        display_location: 'dashboard',
        dismissible: true,
        has_call_to_action: true,
        cta_text: 'File Annual Report',
        cta_url: '/multi-step-checkout/5',
        background_color: '#f59e0b',
        text_color: '#ffffff',
        icon_type: 'warning',
        created_by: 'system'
      }
    ];

    for (const announcement of sampleAnnouncements) {
      await pool.query(`
        INSERT INTO announcements (
          title, content, type, priority, status, target_audience,
          display_location, dismissible, has_call_to_action, cta_text,
          cta_url, background_color, text_color, icon_type, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        announcement.title, announcement.content, announcement.type,
        announcement.priority, announcement.status, announcement.target_audience,
        announcement.display_location, announcement.dismissible,
        announcement.has_call_to_action, announcement.cta_text,
        announcement.cta_url, announcement.background_color,
        announcement.text_color, announcement.icon_type, announcement.created_by
      ]);
    }

    console.log('✅ Sample announcements created successfully!');
    console.log('Created announcements:');
    sampleAnnouncements.forEach((announcement, index) => {
      console.log(`${index + 1}. ${announcement.title} (${announcement.priority} priority)`);
    });

  } catch (error) {
    console.error('❌ Error creating sample announcements:', error);
  } finally {
    await pool.end();
  }
}

// Run the function
createSampleAnnouncements();