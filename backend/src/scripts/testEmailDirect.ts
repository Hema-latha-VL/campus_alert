import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

console.log('=== Direct Email Test ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'NOT SET');

const testDirectConnection = async () => {
  try {
    const config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    console.log('\n=== Testing Direct Connection ===');
    console.log('Config:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user ? config.auth.user : 'NOT SET',
      pass: config.auth.pass ? '***' : 'NOT SET'
    });

    if (!config.auth.user || !config.auth.pass) {
      console.log('❌ SMTP credentials missing!');
      return;
    }

    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport(config);

    console.log('Testing connection...');
    await transporter.verify();
    
    console.log('✅ Direct connection successful!');
    
    // Test sending email
    const testEmail = {
      from: process.env.SMTP_FROM,
      to: config.auth.user, // Send to self for testing
      subject: 'Test Email from Campus Pulse',
      html: '<h1>Test Email</h1><p>This is a test email from Campus Pulse email system.</p>'
    };

    console.log('Sending test email...');
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);

  } catch (error) {
    console.error('❌ Direct connection failed:', error);
  }
};

testDirectConnection();
