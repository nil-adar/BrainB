import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';

const router = Router();

/**
 * 1) שליפת תלמידים לפי מורה
 *    GET /api/students?teacherId=<teacherId>
 */
router.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const teacherIdRaw = req.query.teacherId as string;
    if (!teacherIdRaw) {
      res.status(400).json({ message: 'Missing teacherId' });
      return;
    }

    let teacherId: mongoose.Types.ObjectId;
    try {
      teacherId = new mongoose.Types.ObjectId(teacherIdRaw);
    } catch {
      res.status(400).json({ message: 'Invalid teacherId format' });
      return;
    }

    try {
      const docs = await User.find({ teacherId, role: 'student' })
        .select('name firstName lastName class classId parentIds avatar teacherId')
        .lean();

      const students = docs.map((doc) => {
        // פיצול השדה name אם firstName/lastName חסרים
        let firstName = doc.firstName || '';
        let lastName = doc.lastName || '';
        if (!firstName && !lastName && doc.name) {
          const parts = doc.name.trim().split(' ');
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ') || '';
        }
        return {
          id: doc._id.toString(),
          firstName,
          lastName,
          class: doc.class,
          classId: doc.classId,
          teacherId: doc.teacherId,
          parentIds: (doc.parentIds || []).map((pid) => pid.toString()),
          avatar: doc.avatar || '',
        };
      });

      res.status(200).json(students);
    } catch (error) {
      console.error('Error in GET /api/students:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

/**
 * 2) שליפת תלמידים לפי הורה
 *    GET /api/students/by-parent/:parentId
 */
router.get(
  '/by-parent/:parentId',
  async (req: Request, res: Response): Promise<void> => {
    const { parentId } = req.params;
    console.log('📥 בקשת תלמידים עבור הורה:', parentId);

    try {
      const parent = await User.findById(parentId);
      if (!parent) {
        res.status(404).json({ message: 'Parent not found' });
        return;
      }
      if (parent.role !== 'parent') {
        res.status(403).json({ message: 'User is not a parent' });
        return;
      }

      const docs = await User.find({
        _id: { $in: parent.parentOf },
        role: 'student',
      })
        .select('name classId teacherId parentIds avatar')
        .lean();

      const students = docs.map((doc) => {
        const parts = doc.name ? doc.name.trim().split(' ') : [];
        const firstName = doc.firstName || parts[0] || '';
        const lastName = doc.lastName || parts.slice(1).join(' ') || '';
        return {
          id: doc._id.toString(),
          firstName,
          lastName,
          classId: doc.classId,
          teacherId: doc.teacherId,
          parentIds: (doc.parentIds || []).map((pid) => pid.toString()),
          avatar: doc.avatar || '',
        };
      });

      console.log('📦 נמצאו תלמידים (parent):', students.length);
      res.status(200).json(students);
    } catch (error) {
      console.error('❌ שגיאה בשליפת תלמידים לפי הורה:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

/**
 * 3) שליפת תלמיד בודד לפי מזהה
 *    GET /api/students/:studentId
 */
router.get(
  '/:studentId',
  async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.params;
    try {
      const doc = await User.findById(studentId)
        .select('name firstName lastName classId teacherId parentIds avatar')
        .lean();
      if (!doc) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      const parts = doc.name ? doc.name.trim().split(' ') : [];
      const firstName = doc.firstName || parts[0] || '';
      const lastName = doc.lastName || parts.slice(1).join(' ') || '';
      const student = {
        id: doc._id.toString(),
        firstName,
        lastName,
        classId: doc.classId,
        teacherId: doc.teacherId,
        parentIds: (doc.parentIds || []).map((pid) => pid.toString()),
        avatar: doc.avatar || '',
      };

      res.status(200).json(student);
    } catch (err) {
      console.error('❌ שגיאה בשליפת תלמיד לפי id:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
);router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await User.findOne({ uniqueId: req.body.uniqueId });
    if (existing) {
      res.status(409).json({
        success: false,
        message: "תלמיד עם תעודת זהות זו כבר קיים"
      });
      return;
    }

    const newStudent = new User({
      ...req.body,
      role: "student",
    });

    await newStudent.save();
    res.status(201).json({ success: true, studentId: newStudent._id });
  } catch (error) {
    console.error("❌ שגיאה ביצירת תלמיד:", error);
    res.status(500).json({ success: false, error });
  }
});



export default router;