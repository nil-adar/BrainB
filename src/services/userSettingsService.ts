import api from "@/services/api";


export const userSettingsService = {
  /**
   * Get current user profile
   */
  getCurrentUserProfile: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },

  /**
   * Update current user profile
   */
  updateCurrentUserProfile: async (data: {
    fullName?: string;
    email?: string;
    language?: "he" | "en";
    notifications?: boolean;
  }) => {
    const res = await api.put("/users/me", data);
    return res.data;
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (formData: FormData): Promise<{ imageUrl: string }> => {
    const res = await api.put("/users/me/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
