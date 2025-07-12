import { db } from './server/db.ts';
import { users } from './shared/schema.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function checkAndCreateAdminUser() {
  try {
    console.log('🔍 Checking for admin users...');
    
    // Check for existing admin users
    const adminUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'));
    
    console.log(`Found ${adminUsers.length} admin users:`);
    adminUsers.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role}`);
    });
    
    // Check for super admin users
    const superAdminUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'super_admin'));
    
    console.log(`Found ${superAdminUsers.length} super admin users:`);
    superAdminUsers.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role}`);
    });
    
    // If no admin users exist, create one
    if (adminUsers.length === 0 && superAdminUsers.length === 0) {
      console.log('\n🚀 No admin users found. Creating a test admin user...');
      
      const testAdminEmail = 'admin@parafort.com';
      const testAdminPassword = process.env.ADMIN_PASSWORD || 'CHANGE_ME_IN_PRODUCTION';
      
      // Check if user with this email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, testAdminEmail));
      
      if (existingUser.length > 0) {
        console.log(`User with email ${testAdminEmail} already exists. Updating role to admin...`);
        
        const [updatedUser] = await db
          .update(users)
          .set({ role: 'admin' })
          .where(eq(users.email, testAdminEmail))
          .returning();
        
        console.log(`✅ Updated user ${updatedUser.email} to admin role`);
      } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(testAdminPassword, 10);
        
        // Create new admin user
        const [newAdmin] = await db
          .insert(users)
          .values({
            email: testAdminEmail,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();
        
        console.log(`✅ Created new admin user: ${newAdmin.email}`);
        console.log(`📧 Email: ${testAdminEmail}`);
        console.log(`🔑 Password: ${testAdminPassword}`);
      }
    }
    
    console.log('\n✨ Admin user check completed!');
    
  } catch (error) {
    console.error('❌ Error checking/creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

checkAndCreateAdminUser();