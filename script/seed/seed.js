require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// סכימות
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String,
  schoolId: String,
  schoolName: String,
  classId: String,
  className: String,
  uniqueId: String,
  isActivated: Boolean,
  password: String,
  assignedClasses: Array,
  // תוספות להורים ולמורים
  parentOf: Array,     // רק להורים
  subjects: Array      // רק למורים
});

const schoolSchema = new mongoose.Schema({
  schoolId: String,
  schoolName: String
});

const classSchema = new mongoose.Schema({
  classId: String,
  className: String,
  schoolId: String,
  schoolName: String
});

const User = mongoose.model('User', userSchema);
const School = mongoose.model('School', schoolSchema);
const Class = mongoose.model('Class', classSchema);

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI, {
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  const dataPath = path.join(__dirname, 'synthetic_school_data_small.json');
  const rawData = fs.readFileSync(dataPath);
  const { users, schools, classes } = JSON.parse(rawData);

  // מחיקה לפני טעינה מחדש
  await User.deleteMany({});
  await School.deleteMany({});
  await Class.deleteMany({});

  // טעינה
  await User.insertMany(users);
  await School.insertMany(schools);
  await Class.insertMany(classes);

  console.log('✅ Data seeded successfully');
  process.exit();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
