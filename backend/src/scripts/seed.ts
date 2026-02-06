import { User } from '../models/User';
import { hashPassword } from '../utils/security';

export const seedDemoUsers = async (): Promise<void> => {
  try {
    const adminLogin = 'kec@kongu.edu';
    const existingAdmin = await User.findOne({ loginName: adminLogin, role: 'admin' });
    if (!existingAdmin) {
      const passwordHash = await hashPassword('Test@1234');
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        loginName: adminLogin,
        department: 'Administration',
        role: 'admin',
        status: 'active',
        phoneNumber: '0000000000',
        passwordHash,
      });
      console.log(`✅ Created admin user: ${adminLogin}`);
    }

    console.log('✅ Demo users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
  }
};
