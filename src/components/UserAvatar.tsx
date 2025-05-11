
import { UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { userProfileService } from "@/services/userProfileService";

interface UserAvatarProps {
  className?: string;
  onClick?: () => void;
  userId?: string;  // Optional userId for future MongoDB integration
}

export const UserAvatar = ({ className, onClick, userId }: UserAvatarProps) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Currently using localStorage, but prepared for future MongoDB integration
    const storedPicture = localStorage.getItem("profilePicture");
    setProfilePicture(storedPicture);
    
    // Listen for profile picture changes in localStorage
    const handleStorageChange = () => {
      setProfilePicture(localStorage.getItem("profilePicture"));
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId]);

  // This function will be used in the future to load from MongoDB
  const loadProfileFromServer = async (id: string) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const profile = await userProfileService.getUserProfile(id);
      if (profile && profile.profilePicture) {
        setProfilePicture(profile.profilePicture);
        // Also update localStorage for offline access
        localStorage.setItem("profilePicture", profile.profilePicture);
      }
    } catch (error) {
      console.error("Error loading profile picture from server:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Avatar className={className} onClick={onClick}>
      {isLoading ? (
        <AvatarFallback>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
        </AvatarFallback>
      ) : profilePicture ? (
        <AvatarImage src={profilePicture} alt="User profile" />
      ) : (
        <AvatarFallback>
          <UserRound className="h-5 w-5 text-gray-400" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
