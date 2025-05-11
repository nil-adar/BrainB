import { Router, Request, Response } from 'express';


import { ScheduleModel } from '../models/Schedule';



const router = Router();

// ✅ שליפת כל האירועים של מורה לפי מזהה
router.get('/:teacherId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.params;
    const { date } = req.query;

    const filter: any = { teacherId };

if (date) {
  const dayStart = new Date(date as string);
  dayStart.setUTCHours(0, 0, 0, 0);

  const dayEnd = new Date(date as string);
  dayEnd.setUTCHours(23, 59, 59, 999);

  filter.date = { $gte: dayStart, $lte: dayEnd };
}

    const schedule = await ScheduleModel.find(filter);

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ הוספת אירוע אישי למורה
router.post('/', async (req: Request, res: Response): Promise<void> => {
  console.log("➡️ POST /api/schedule התחיל");

  try {
    const {
      teacherId,
      date,
      schedule,
      isPersonal,
      notes
    } = req.body;

    console.log("📦 Received data:", { teacherId, date, schedule });
    console.log("📘 Received schedule items:");
    (schedule as Array<any>).forEach((item: any, index: number) => {
      console.log(`Item ${index + 1}: time=${item.time}, subject=${item.subject}, topic=${item.topic}, room=${item.room}`);
    });
      


    if (!teacherId || !date || !schedule || !Array.isArray(schedule) || schedule.length === 0) {
      console.log("⛔ Missing or invalid fields!");
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // חישוב טווח היום
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);

    // עדכון או יצירה של האירוע
    const updatedDoc = await ScheduleModel.findOneAndUpdate(
      {
        teacherId,
        date: { $gte: dayStart, $lte: dayEnd }
      },
      {
        $push: { schedule: { $each: schedule } },
        $setOnInsert: {
          teacherId,
          date: new Date(date),
          isPersonal,
          notes,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Event added/updated:", updatedDoc);
    res.status(201).json({ message: 'Event added successfully', event: updatedDoc });

  } catch (error) {
    console.error("❌ Error during POST /api/schedule:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export { router };
