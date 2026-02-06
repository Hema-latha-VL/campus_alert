import * as cron from 'node-cron';
import { sendEventRemindersForUpcomingEvents, testEmailConfiguration } from './emailService';

class SchedulerService {
  private tasks: cron.ScheduledTask[] = [];

  constructor() {
    this.initializeSchedules();
  }

  private initializeSchedules() {
    // Run every day at 9:00 AM to check for upcoming events
    const dailyReminderTask = cron.schedule('0 9 * * *', async () => {
      console.log('Running daily event reminder check...');
      const result = await sendEventRemindersForUpcomingEvents();
      console.log(`Daily reminder check completed: ${result.totalEvents} events processed`);
    }, {
      timezone: 'Asia/Kolkata'
    });

    this.tasks.push(dailyReminderTask);

    // Run every 6 hours for urgent reminders (for events starting soon)
    const urgentReminderTask = cron.schedule('0 */6 * * *', async () => {
      console.log('Running urgent event reminder check...');
      const result = await sendEventRemindersForUpcomingEvents();
      console.log(`Urgent reminder check completed: ${result.totalEvents} events processed`);
    }, {
      timezone: 'Asia/Kolkata'
    });

    this.tasks.push(urgentReminderTask);
  }

  start() {
    console.log('Starting scheduler service...');
    this.tasks.forEach(task => task.start());
    console.log(`Scheduler started with ${this.tasks.length} tasks`);
  }

  stop() {
    console.log('Stopping scheduler service...');
    this.tasks.forEach(task => task.stop());
    console.log('Scheduler stopped');
  }

  // Manual trigger for testing
  async triggerDailyReminder() {
    console.log('Manually triggering daily reminder...');
    return await sendEventRemindersForUpcomingEvents();
  }

  // Test email configuration
  async testEmailService() {
    return await testEmailConfiguration();
  }
}

export const schedulerService = new SchedulerService();
