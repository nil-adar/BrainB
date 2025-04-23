
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface UserProfile {
  userId: string;
  profilePicture: string | null;
  language: 'en' | 'he';
  preferences: Record<string, any>;
  assignedClasses?: Array<{
    schoolId: string;
    schoolName: string;
    classId: string;
    className: string;
    isActive: boolean;
  }>;
}

export const userProfileService = {
  /**
   * Get user profile
   */
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return res.data.data; // 
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  
  
  

  /**
   * Update user profile picture
   */
  updateProfilePicture: async (userId: string, profilePicture: string | null): Promise<boolean> => {
    try {
      await axios.patch(`${API_BASE_URL}/profiles/${userId}`, { profilePicture });
      return true;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return false;
    }
  },

  /**
   * Update user language preference
   */
  updateLanguage: async (userId: string, language: 'en' | 'he'): Promise<boolean> => {
    try {
      await axios.patch(`${API_BASE_URL}/profiles/${userId}`, { language });
      return true;
    } catch (error) {
      console.error('Error updating language preference:', error);
      return false;
    }
  },

  /**
   * Update user preference
   */
  updatePreference: async (userId: string, key: string, value: any): Promise<boolean> => {
    try {
      await axios.patch(`${API_BASE_URL}/profiles/${userId}`, { 
        [`preferences.${key}`]: value 
      });
      return true;
    } catch (error) {
      console.error('Error updating user preference:', error);
      return false;
    }
  },

  /**
   * Get teacher's assigned classes
   */
  getTeacherClasses: async (teacherId: string): Promise<UserProfile['assignedClasses'] | []> => {
    try {
      const profile = await userProfileService.getUserProfile(teacherId);
      return profile?.assignedClasses || [];
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      return [];
    }
  },

  /**
   * Add a class to teacher's assigned classes
   */
  addTeacherClass: async (
    teacherId: string, 
    classData: Omit<NonNullable<UserProfile['assignedClasses']>[0], 'isActive'>
  ): Promise<boolean> => {
    try {
      const profile = await userProfileService.getUserProfile(teacherId);
      const currentClasses = profile?.assignedClasses || [];
      
      // Check if class already exists
      const classExists = currentClasses.some(
        cls => cls.classId === classData.classId && cls.schoolId === classData.schoolId
      );
      
      if (classExists) {
        return true; // Class already exists, no need to add
      }
      
      // Add new class
      const updatedClasses = [
        ...currentClasses,
        { ...classData, isActive: currentClasses.length === 0 } // Make active if it's the first class
      ];
      
      await axios.patch(`${API_BASE_URL}/profiles/${teacherId}`, { 
        assignedClasses: updatedClasses 
      });
      
      return true;
    } catch (error) {
      console.error('Error adding teacher class:', error);
      return false;
    }
  },
  
  /**
   * Set active class for teacher
   */
  setActiveClass: async (
    teacherId: string,
    schoolId: string,
    classId: string
  ): Promise<boolean> => {
    try {
      const profile = await userProfileService.getUserProfile(teacherId);
      if (!profile?.assignedClasses) return false;
      
      const updatedClasses = profile.assignedClasses.map(cls => ({
        ...cls,
        isActive: cls.schoolId === schoolId && cls.classId === classId
      }));
      
      await axios.patch(`${API_BASE_URL}/profiles/${teacherId}`, { 
        assignedClasses: updatedClasses 
      });
      
      return true;
    } catch (error) {
      console.error('Error setting active class:', error);
      return false;
    }
  },
  
  /**
   * Remove a class from teacher's assigned classes
   */
  removeTeacherClass: async (
    teacherId: string,
    schoolId: string,
    classId: string
  ): Promise<boolean> => {
    try {
      const profile = await userProfileService.getUserProfile(teacherId);
      if (!profile?.assignedClasses) return false;
      
      const updatedClasses = profile.assignedClasses.filter(
        cls => !(cls.schoolId === schoolId && cls.classId === classId)
      );
      
      // If we're removing the active class, make another one active if possible
      const wasActiveRemoved = !updatedClasses.some(cls => cls.isActive);
      if (wasActiveRemoved && updatedClasses.length > 0) {
        updatedClasses[0].isActive = true;
      }
      
      await axios.patch(`${API_BASE_URL}/profiles/${teacherId}`, { 
        assignedClasses: updatedClasses 
      });
      
      return true;
    } catch (error) {
      console.error('Error removing teacher class:', error);
      return false;
    }
  }
};
