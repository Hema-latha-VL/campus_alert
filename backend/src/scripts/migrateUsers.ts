import { connectDatabase } from '../config/database';
import { User } from '../models/User';

const migrateUsers = async () => {
  try {
    console.log('Starting user migration...');
    
    await connectDatabase();
    
    // Find all users without email field
    const usersWithoutEmail = await User.find({ email: { $exists: false } });
    
    console.log(`Found ${usersWithoutEmail.length} users to migrate`);
    
    let updatedCount = 0;
    
    for (const user of usersWithoutEmail) {
      // Generate email from loginName if not present
      const generatedEmail = `${user.loginName}@kongu.edu`;
      
      // Set default notification preferences based on role
      const defaultNotificationPreferences = {
        email: user.role === 'advisor' || user.role === 'admin', // Enable email for staff by default
        push: true,
        urgent: true,
        eventReminders: user.role === 'advisor' || user.role === 'admin', // Enable for staff
      };
      
      await User.updateOne(
        { _id: user._id },
        { 
          $set: {
            email: generatedEmail,
            notificationPreferences: defaultNotificationPreferences
          }
        }
      );
      
      updatedCount++;
      console.log(`Updated user: ${user.loginName} -> ${generatedEmail}`);
    }
    
    // Also update users who have email field but no notificationPreferences
    const usersWithoutPrefs = await User.find({ 
      email: { $exists: true },
      notificationPreferences: { $exists: false } 
    });
    
    console.log(`Found ${usersWithoutPrefs.length} users without notification preferences`);
    
    for (const user of usersWithoutPrefs) {
      const defaultNotificationPreferences = {
        email: user.role === 'advisor' || user.role === 'admin',
        push: true,
        urgent: true,
        eventReminders: user.role === 'advisor' || user.role === 'admin',
      };
      
      await User.updateOne(
        { _id: user._id },
        { 
          $set: {
            notificationPreferences: defaultNotificationPreferences
          }
        }
      );
      
      updatedCount++;
      console.log(`Updated notification preferences for user: ${user.loginName}`);
    }
    
    console.log(`Migration completed. Updated ${updatedCount} users.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateUsers();
}

export { migrateUsers };
