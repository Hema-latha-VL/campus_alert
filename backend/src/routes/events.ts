import { Router, Request, Response } from 'express';
import { Event, type IEvent } from '../models/Event';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all events (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { eventType, department } = req.query;
    
    const filter: Record<string, any> = {};
    if (eventType) filter.eventType = eventType;
    if (department) filter.department = department;

    const events = await Event.find(filter).sort({ date: -1 });
    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ detail: 'Failed to fetch events' });
  }
});

// Get single event by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ detail: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ detail: 'Failed to fetch event' });
  }
});

// Create new event (admin/advisor only)
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?._id;
    const userLoginName = (req as any).user?.loginName;
    const userFirstName = (req as any).user?.firstName;
    const userLastName = (req as any).user?.lastName;

    if (!['admin', 'advisor'].includes(userRole)) {
      return res.status(403).json({ detail: 'Only admin and advisor can create events' });
    }

    const { name, eventType, date, time, imageUrl, coordinator, capacity, department, description } = req.body;

    if (!name || !eventType || !date || !time || !coordinator || !capacity || !department || !description) {
      return res.status(400).json({ detail: 'Missing required fields' });
    }

    const event = new Event({
      name,
      eventType,
      date: new Date(date),
      time,
      imageUrl,
      coordinator,
      capacity: Number(capacity),
      department,
      description,
      createdBy: {
        _id: userId,
        loginName: userLoginName,
        firstName: userFirstName,
        lastName: userLastName,
      },
    });

    await event.save();
    res.status(201).json({ event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ detail: 'Failed to create event' });
  }
});

// Update event (admin/advisor who created it)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?._id;

    if (!['admin', 'advisor'].includes(userRole)) {
      return res.status(403).json({ detail: 'Only admin and advisor can update events' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ detail: 'Event not found' });
    }

    // Check if user is admin or the creator
    if (userRole !== 'admin' && event.createdBy._id !== userId) {
      return res.status(403).json({ detail: 'You can only update events you created' });
    }

    const { name, eventType, date, time, imageUrl, coordinator, capacity, department, description } = req.body;

    if (name) event.name = name;
    if (eventType) event.eventType = eventType;
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (imageUrl !== undefined) event.imageUrl = imageUrl;
    if (coordinator) event.coordinator = coordinator;
    if (capacity) event.capacity = Number(capacity);
    if (department) event.department = department;
    if (description) event.description = description;

    await event.save();
    res.json({ event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ detail: 'Failed to update event' });
  }
});

// Delete event (admin/advisor who created it)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?._id;

    if (!['admin', 'advisor'].includes(userRole)) {
      return res.status(403).json({ detail: 'Only admin and advisor can delete events' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ detail: 'Event not found' });
    }

    // Check if user is admin or the creator
    if (userRole !== 'admin' && event.createdBy._id !== userId) {
      return res.status(403).json({ detail: 'You can only delete events you created' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ detail: 'Failed to delete event' });
  }
});

// Acknowledge event and increment views (public)
router.post('/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ detail: 'Event not found' });
    }

    // Increment views count
    event.views = (event.views || 0) + 1;
    await event.save();

    res.json({ event });
  } catch (error) {
    console.error('Error acknowledging event:', error);
    res.status(500).json({ detail: 'Failed to acknowledge event' });
  }
});

export default router;
