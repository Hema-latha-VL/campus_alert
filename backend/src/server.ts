import createApp from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { seedDemoUsers } from './scripts/seed';
import { schedulerService } from './services/schedulerService';

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Seed demo users
    await seedDemoUsers();

    // Test email configuration
    const emailTest = await schedulerService.testEmailService();
    if (emailTest) {
      console.log('✅ Email service configured successfully');
      // Start scheduler service
      schedulerService.start();
    } else {
      console.log('⚠️ Email service not configured - scheduler disabled');
    }

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS origins: ${config.cors.origins.join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
