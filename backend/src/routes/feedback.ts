import { Router, Request, Response } from 'express';
import { Feedback } from '../models/Feedback';
import { User } from '../models/User';

const router = Router();

// POST /api/feedback - Submit feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, studentId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ detail: 'Feedback message is required' });
    }

    if (!studentId) {
      return res.status(400).json({ detail: 'Student ID is required' });
    }

    // Get student info
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    // Ensure student has an advisor, or use a default
    const advisorLoginName = student.advisorLoginName || 'unassigned';
    const advisorName = student.advisorName || 'Department Admin';

    // Create feedback
    const feedback = new Feedback({
      studentId: student._id.toString(),
      studentName: `${student.firstName} ${student.lastName}`,
      studentLoginName: student.loginName,
      studentEmail: student.email,
      department: student.department,
      advisorLoginName,
      message: message.trim(),
      status: 'unread',
    });

    await feedback.save();

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ detail: 'Error submitting feedback' });
  }
});

// GET /api/feedback/advisor/:advisorLoginName - Get all feedback for an advisor
router.get('/advisor/:advisorLoginName', async (req: Request, res: Response) => {
  try {
    const { advisorLoginName } = req.params;
    const { status } = req.query;

    const query: any = { advisorLoginName };
    if (status) {
      query.status = status;
    }

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      feedbacks,
      total: feedbacks.length,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({ detail: 'Error fetching feedback' });
  }
});

// PATCH /api/feedback/:feedbackId - Mark feedback as read
router.patch('/:feedbackId', async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    if (!status || !['read', 'unread'].includes(status)) {
      return res.status(400).json({ detail: 'Valid status is required (read or unread)' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ detail: 'Feedback not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback status updated',
      feedback,
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return res.status(500).json({ detail: 'Error updating feedback' });
  }
});

export default router;
