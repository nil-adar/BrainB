
export interface SchoolEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'holiday' | 'meeting' | 'report' | 'general';
  studentId?: string;
  description?: string;
}

export const mockSchoolEvents: SchoolEvent[] = [
  {
    id: '1',
    title: 'פתיחת שנת הלימודים',
    date: new Date('2024-09-01'),
    type: 'general',
    description: 'תחילת שנת הלימודים תשפ״ה'
  },
  {
    id: '2',
    title: 'ראש השנה',
    date: new Date('2024-09-15'),
    type: 'holiday',
    description: 'חופשת ראש השנה'
  },
  {
    id: '3',
    title: 'יום הורים - סמסטר א',
    date: new Date('2024-11-15'),
    type: 'meeting',
    description: 'פגישות אישיות עם המורים'
  },
  {
    id: '4',
    title: 'חלוקת תעודות סמסטר א',
    date: new Date('2024-01-31'),
    type: 'report',
    description: 'חלוקת תעודות מחצית ראשונה'
  },
  {
    id: '5',
    title: 'מבחן במתמטיקה',
    date: new Date('2024-10-20'),
    type: 'exam',
    studentId: '1',
    description: 'מבחן בנושא אלגברה'
  }
];
