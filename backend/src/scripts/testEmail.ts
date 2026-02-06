import { connectDatabase } from '../config/database';
import { sendEmail } from '../services/emailService';
import { Event } from '../models/Event';

const testEmailService = async () => {
  try {
    console.log('Testing email service...');
    
    // Connect to database
    await connectDatabase();
    
    // Test email configuration
    await sendEmail(
      "vinithkrishna18@gmail.com",
      "Test Mail",
      "<h1>Hello</h1>"
    );
    console.log("Email sent successfully");
    // if (isConfigured) {
      // console.log('✅ Email service is configured correctly');
      
      // Test sending a reminder for a sample event (if events exist)
      // const events = await Event.find({}).limit(1);
      
      // if (events.length > 0) {
      //   console.log('Testing event reminder for:', events[0].name);
      //   const result = await emailService.sendEventReminder(events[0]._id.toString());
      //   console.log('Reminder test result:', result);
      // } else {
      //   console.log('No events found to test reminders');
      // }
      
      // // Test upcoming events check
      // console.log('Testing upcoming events check...');
      // const upcomingResult = await emailService.sendEventRemindersForUpcomingEvents();
      // console.log('Upcoming events result:', upcomingResult);
      
    // } else {
    //   console.log('❌ Email service is not configured');
    //   console.log('Please check your environment variables:');
    //   console.log('- SMTP_HOST');
    //   console.log('- SMTP_PORT');
    //   console.log('- SMTP_USER');
    //   console.log('- SMTP_PASS');
    //   console.log('- SMTP_FROM');
    // }
    
  } catch (error) {
    console.error('Email test failed:', error);
  }
  
  process.exit(0);
};

// Run test if this file is executed directly
if (require.main === module) {
  testEmailService();
}

export { testEmailService };
