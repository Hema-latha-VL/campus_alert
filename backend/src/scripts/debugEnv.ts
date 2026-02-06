import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Environment Variables Debug ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
console.log('SMTP_FROM:', process.env.SMTP_FROM);
console.log('=====================================');

// Test if dotenv is working
if (!process.env.SMTP_HOST) {
  console.log('❌ Environment variables not loaded!');
  console.log('Make sure .env file exists and has SMTP configuration');
} else {
  console.log('✅ Environment variables loaded successfully');
}
