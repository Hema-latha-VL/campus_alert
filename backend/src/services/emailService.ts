import nodemailer from 'nodemailer';
import { Event } from '../models/Event';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

/* -------------------- SMTP TRANSPORTER -------------------- */

let transporter: nodemailer.Transporter | null = null;

const initializeTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (!user || !pass) {
    console.warn('SMTP credentials not configured. Email service disabled.');
    return;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 5 * 60 * 1000,
    socketTimeout: 5 * 60 * 1000
  });
};

initializeTransporter();

/* -------------------- SEND EMAIL -------------------- */

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  if (!transporter) {
    console.error('Email transporter not initialized');
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.log("Error details:", error);
    console.error('Failed to send email:', error);
    return false;
  }
};

/* -------------------- EMAIL TEMPLATE -------------------- */

const generateEventReminderEmail = (event: any, userName: string): string => {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTypeLabel =
    event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1);

  const mandatoryBadge = event.isMandatory
    ? `<span style="background:#ef4444;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;">MANDATORY</span>`
    : '';

  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family:Arial,sans-serif">
    <h2>🔔 Event Reminder</h2>
    <p>Dear <strong>${userName}</strong>,</p>

    <h3>${event.name} ${mandatoryBadge}</h3>
    <p><strong>Type:</strong> ${eventTypeLabel}</p>
    <p><strong>Date:</strong> ${eventDate}</p>
    <p><strong>Time:</strong> ${event.time}</p>
    <p><strong>Department:</strong> ${event.department}</p>
    <p><strong>Coordinator:</strong> ${event.coordinator}</p>
    <p><strong>Capacity:</strong> ${event.capacity}</p>

    <p>${event.description}</p>

    ${event.isMandatory
      ? `<p style="color:red;font-weight:bold">⚠️ Attendance is mandatory</p>`
      : `<p>Please attend if interested.</p>`
    }

    <p>Regards,<br/>Campus Pulse Team</p>
  </body>
  </html>
  `;
};

/* -------------------- SEND EVENT REMINDER -------------------- */

export const sendEventReminder = async (
  eventId: string
): Promise<{ success: number; failed: number }> => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    if (event.reminderSent) {
      console.log(`Reminder already sent: ${event.name}`);
      return { success: 0, failed: 0 };
    }

    const users = event.isMandatory
      ? await User.find({
        status: 'active',
        'notificationPreferences.email': true,
      })
      : await User.find({
        status: 'active',
        'notificationPreferences.eventReminders': true,
        'notificationPreferences.email': true,
      });

    let success = 0;
    let failed = 0;

    for (const user of users) {
      const html = generateEventReminderEmail(
        event,
        `${user.firstName} ${user.lastName}`
      );

      const sent = await sendEmail(
        user.email,
        `🔔 Reminder: ${event.name}`,
        html
      );

      sent ? success++ : failed++;
    }

    if (success > 0) {
      event.reminderSent = true;
      await event.save();
    }

    return { success, failed };
  } catch (error) {
    console.error('Error sending reminder:', error);
    return { success: 0, failed: 0 };
  }
};

/* -------------------- UPCOMING EVENTS -------------------- */

export const sendEventRemindersForUpcomingEvents = async (): Promise<{
  totalEvents: number;
  totalSuccess: number;
  totalFailed: number;
}> => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const events = await Event.find({
      date: { $gte: tomorrow, $lte: dayAfter },
      reminderSent: false,
    });

    let totalSuccess = 0;
    let totalFailed = 0;

    for (const event of events) {
      const res = await sendEventReminder(event._id.toString());
      totalSuccess += res.success;
      totalFailed += res.failed;
    }

    return {
      totalEvents: events.length,
      totalSuccess,
      totalFailed,
    };
  } catch (error) {
    console.error('Upcoming reminders error:', error);
    return { totalEvents: 0, totalSuccess: 0, totalFailed: 0 };
  }
};

/* -------------------- VERIFY SMTP -------------------- */

export const testEmailConfiguration = async (): Promise<boolean> => {
  if (!transporter) return false;

  try {
    await transporter.verify();
    console.log('✅ Email configuration valid');
    return true;
  } catch (error) {
    console.error('❌ Email config failed:', error);
    return false;
  }
};

