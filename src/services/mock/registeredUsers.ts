
import { User } from "@/types/school";

// מאגר המשתמשים הרשומים במערכת - אלו שיכולים להתחבר
export const registeredUsers: User[] = [];

// פונקציות עזר לניהול המשתמשים הרשומים
export const registeredUsersService = {
  // הוספת משתמש חדש למערכת
  addUser: (user: User) => {
    registeredUsers.push(user);
    console.log('משתמש חדש נרשם:', user);
    console.log('כל המשתמשים הרשומים:', registeredUsers);
  },

  // בדיקה אם תעודת זהות כבר רשומה
  isUserRegistered: (uniqueId: string) => {
    return registeredUsers.some(user => user.uniqueId === uniqueId);
  },

  // קבלת משתמש לפי תעודת זהות
  getUserByUniqueId: (uniqueId: string) => {
    return registeredUsers.find(user => user.uniqueId === uniqueId);
  },

  // קבלת כל המשתמשים הרשומים
  getAllRegisteredUsers: () => {
    return registeredUsers;
  }
};
