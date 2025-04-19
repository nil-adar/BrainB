
import { Student } from "@/types/school";

export const mockStudents: Student[] = [
  {
    id: "1",
    uniqueId: "234567891",
    userId: "mia2015",
    name: "מיה כהן",
    firstName: "מיה",
    lastName: "כהן",
    email: "mia@student.school.com",
    phone: "050-2345678",
    role: "student",
    password: "hashedPassword123",
    class: "ד",
    grade: "1",
    dateOfBirth: "2015-05-15",
    parentIds: ["1", "2"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=1",
    tasks: [
      {
        id: "t1",
        description: "קריאה - 20 דקות",
        completed: false,
        studentId: "1"
      },
      {
        id: "t2",
        description: "תרגול מתמטיקה - 10 תרגילים",
        completed: true,
        studentId: "1"
      }
    ],
    progressReports: [
      {
        id: "r1",
        studentId: "1",
        content: "מתקדמת יפה בקריאה, צריכה עוד עבודה על הבנת הנקרא",
        recommendations: ["קריאה יומית", "דיון על הטקסט"],
        completed: true
      }
    ]
  },
  {
    id: "2",
    uniqueId: "345678912",
    userId: "yuval2015",
    name: "יובל לוי",
    firstName: "יובל",
    lastName: "לוי",
    email: "yuval@student.school.com",
    phone: "050-3456789",
    role: "student",
    password: "hashedPassword456",
    class: "ד",
    grade: "2",
    dateOfBirth: "2015-03-20",
    parentIds: ["3", "4"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=2",
    tasks: [
      {
        id: "t3",
        description: "כתיבת סיפור קצר",
        completed: false,
        studentId: "2"
      }
    ],
    progressReports: [
      {
        id: "r2",
        studentId: "2",
        content: "יובל מתקשה בכתיבה אך מתקדם בקריאה",
        recommendations: ["תרגול כתיבה יומי", "עבודה עם מחברת מיוחדת"],
        completed: true
      }
    ]
  },
  {
    id: "3",
    uniqueId: "456789123",
    userId: "noa2014",
    name: "נועה פרץ",
    firstName: "נועה",
    lastName: "פרץ",
    email: "noa@student.school.com",
    phone: "050-4567891",
    role: "student",
    password: "hashedPassword789",
    class: "ד",
    grade: "1",
    dateOfBirth: "2014-08-10",
    parentIds: ["5", "6"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=3",
    tasks: [
      {
        id: "t4",
        description: "פעילות גופנית - 30 דקות",
        completed: true,
        studentId: "3"
      },
      {
        id: "t5",
        description: "תרגול אנגלית - מילים חדשות",
        completed: false,
        studentId: "3"
      }
    ],
    progressReports: [
      {
        id: "r3",
        studentId: "3",
        content: "נועה מתקדמת יפה באנגלית, צריכה תרגול נוסף במתמטיקה",
        recommendations: ["תרגול מתמטיקה יומי", "משחקי חשיבה"],
        completed: false
      }
    ]
  },
  {
    id: "4",
    uniqueId: "567891234",
    userId: "daniel2015",
    name: "ניל אדר",
    firstName: "ניל",
    lastName: "אדר",
    email: "neil@student.school.com",
    phone: "050-5678912",
    role: "student",
    password: "hashedPassword101",
    class: "ד",
    grade: "1",
    dateOfBirth: "2015-01-25",
    parentIds: ["7", "8"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=4",
    tasks: [
      {
        id: "t6",
        description: "קריאת ספר - פרק אחד",
        completed: true,
        studentId: "4"
      }
    ],
    progressReports: [
      {
        id: "r4",
        studentId: "4",
        content: "ניל מתקדם יפה בכל התחומים, במיוחד במדעים",
        recommendations: ["העשרה במדעים", "פרוייקטים יצירתיים"],
        completed: true
      }
    ]
  },
  {
    id: "5",
    uniqueId: "678912345",
    userId: "maya2015",
    name: "מאיה שלום",
    firstName: "מאיה",
    lastName: "שלום",
    email: "maya@student.school.com",
    phone: "050-6789123",
    role: "student",
    password: "hashedPassword202",
    class: "ד",
    grade: "2",
    dateOfBirth: "2015-06-30",
    parentIds: ["9", "10"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=5",
    tasks: [
      {
        id: "t7",
        description: "עבודה בחשבון - דף עבודה",
        completed: false,
        studentId: "5"
      },
      {
        id: "t8",
        description: "קריאה באנגלית - 15 דקות",
        completed: true,
        studentId: "5"
      }
    ],
    progressReports: [
      {
        id: "r5",
        studentId: "5",
        content: "מאיה מצטיינת באנגלית, צריכה עזרה בהבנת הנקרא בעברית",
        recommendations: ["קריאה מודרכת בעברית", "דיון בטקסט"],
        completed: false
      }
    ]
  },
  {
    id: "6",
    uniqueId: "789123456",
    userId: "itay2015",
    name: "איתי ישראלי",
    firstName: "איתי",
    lastName: "ישראלי",
    email: "itay@student.school.com",
    phone: "050-7891234",
    role: "student",
    password: "hashedPassword303",
    class: "ד",
    grade: "1",
    dateOfBirth: "2015-04-12",
    parentIds: ["11", "12"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=6",
    tasks: [
      {
        id: "t9",
        description: "תרגול הכתבה - 10 מילים",
        completed: false,
        studentId: "6"
      }
    ],
    progressReports: [
      {
        id: "r6",
        studentId: "6",
        content: "איתי מתקשה בקריאה ובכתיבה, מתקדם יפה במתמטיקה",
        recommendations: ["תרגול קריאה יומי", "עבודה עם קלינאית תקשורת"],
        completed: true
      }
    ]
  },
  {
    id: "7",
    uniqueId: "891234567",
    userId: "shira2015",
    name: "שירה דוד",
    firstName: "שירה",
    lastName: "דוד",
    email: "shira@student.school.com",
    phone: "050-8912345",
    role: "student",
    password: "hashedPassword404",
    class: "ד",
    grade: "2",
    dateOfBirth: "2015-09-05",
    parentIds: ["13", "14"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=7",
    tasks: [
      {
        id: "t10",
        description: "תרגול שירה - 20 דקות",
        completed: true,
        studentId: "7"
      },
      {
        id: "t11",
        description: "קריאת ספר - 2 פרקים",
        completed: false,
        studentId: "7"
      }
    ],
    progressReports: [
      {
        id: "r7",
        studentId: "7",
        content: "שירה מצטיינת באמנויות, צריכה עזרה במתמטיקה",
        recommendations: ["תרגול מתמטיקה בדרך חווייתית", "למידה בקבוצה קטנה"],
        completed: false
      }
    ]
  },
  {
    id: "8",
    uniqueId: "912345678",
    userId: "yoav2015",
    name: "יואב כץ",
    firstName: "יואב",
    lastName: "כץ",
    email: "yoav@student.school.com",
    phone: "050-9123456",
    role: "student",
    password: "hashedPassword505",
    class: "ד",
    grade: "1",
    dateOfBirth: "2015-11-15",
    parentIds: ["15", "16"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=8",
    tasks: [
      {
        id: "t12",
        description: "משימת כתיבה - תיאור אירוע",
        completed: false,
        studentId: "8"
      },
      {
        id: "t13",
        description: "קריאה שוטפת - 15 דקות",
        completed: true,
        studentId: "8"
      }
    ],
    progressReports: [
      {
        id: "r8",
        studentId: "8",
        content: "יואב מתקדם בקצב טוב בכל התחומים, במיוחד בקריאה",
        recommendations: ["העשרה בתחומי עניין", "קריאת ספרים מאתגרים"],
        completed: true
      }
    ]
  },
  {
    id: "9",
    uniqueId: "123456789",
    userId: "gal2015",
    name: "גל לביא",
    firstName: "גל",
    lastName: "לביא",
    email: "gal@student.school.com",
    phone: "050-1234567",
    role: "student",
    password: "hashedPassword606",
    class: "ד",
    grade: "2",
    dateOfBirth: "2015-07-22",
    parentIds: ["17", "18"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=9",
    tasks: [
      {
        id: "t14",
        description: "תרגול חשבון - דף עבודה",
        completed: true,
        studentId: "9"
      }
    ],
    progressReports: [
      {
        id: "r9",
        studentId: "9",
        content: "גל מתקדם יפה בכל התחומים, במיוחד במתמטיקה",
        recommendations: ["אתגרים נוספים במתמטיקה", "פיתוח חשיבה לוגית"],
        completed: true
      }
    ]
  },
  {
    id: "10",
    uniqueId: "234567890",
    userId: "dana2015",
    name: "דנה אבן",
    firstName: "דנה",
    lastName: "אבן",
    email: "dana@student.school.com",
    phone: "050-2345678",
    role: "student",
    password: "hashedPassword707",
    class: "ד",
    grade: "1",
    dateOfBirth: "2015-12-05",
    parentIds: ["19", "20"],
    teacherId: "t1",
    avatar: "https://i.pravatar.cc/150?img=10",
    tasks: [
      {
        id: "t15",
        description: "קריאה באנגלית - 20 דקות",
        completed: false,
        studentId: "10"
      },
      {
        id: "t16",
        description: "הכנת פרויקט במדעים",
        completed: true,
        studentId: "10"
      }
    ],
    progressReports: [
      {
        id: "r10",
        studentId: "10",
        content: "דנה מצטיינת במדעים, צריכה חיזוק בשפה",
        recommendations: ["קריאה יומית", "תרגול כתיבה יצירתית"],
        completed: false
      }
    ]
  }
];
