import { ArrowLeft, Camera, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userSettingsService } from "@/services/userSettingsService";

const translations = {
  en: {
    back: "Back",
    settings: "Settings",
    profileSettings: "Profile Settings",
    fullName: "Full Name",
    email: "Email",
    systemPreferences: "System Preferences",
    notifications: "Notifications",
    language: "Language",
    home: "Home",
    profilePicture: "Profile Picture",
    changePhoto: "Change Photo",
    save: "Save Changes",
    settingsSaved: "Settings Saved",
    settingsSavedDesc: "Your settings have been saved successfully",
    selectLanguage: "Select Language",
    hebrew: "Hebrew",
    english: "English"
  },
  he: {
    back: "חזור",
    settings: "הגדרות",
    profileSettings: "הגדרות פרופיל",
    fullName: "שם מלא",
    email: "אימייל",
    systemPreferences: "העדפות מערכת",
    notifications: "התראות",
    language: "שפה",
    home: "דף הבית",
    profilePicture: "תמונת פרופיל",
    changePhoto: "שנה תמונה",
    save: "שמור שינויים",
    settingsSaved: "הגדרות נשמרו",
    settingsSavedDesc: "ההגדרות שלך נשמרו בהצלחה",
    selectLanguage: "בחר שפה",
    hebrew: "עברית",
    english: "אנגלית"
  }
};

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState(document.documentElement.dir === "rtl" ? "he" : "en");
  const [profileImage, setProfileImage] = useState<string>("");
const [formData, setFormData] = useState<{
  fullName: string;
  email: string;
  notifications: boolean;
  selectedLanguage: "he" | "en";
}>({
  fullName: "",
  email: "",
  notifications: true,
  selectedLanguage: "he"
});


  const t = translations[language];

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: userSettingsService.getCurrentUserProfile,
  });
  console.log("🔍 user data", user);

 useEffect(() => {
  if (user) {
    setFormData({
      fullName: user.name || "",
      email: user.email || "",
      notifications: user.notifications ?? true,
      selectedLanguage: user.language || "he",
    });
    setProfileImage(user.avatar || "");
  }
}, [user]);


 const { mutate: saveProfile, isPending: saving } = useMutation({
  mutationFn: userSettingsService.updateCurrentUserProfile,
    onSuccess: () => {
      toast({
        title: t.settingsSaved,
        description: t.settingsSavedDesc,
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "שמירת ההגדרות נכשלה",
        variant: "destructive",
      });
    },
  });

const { mutate: uploadImage } = useMutation({
  mutationFn: userSettingsService.uploadProfileImage,
  onSuccess: (data) => {
    // הפוך לכתובת מלאה
    setProfileImage(`http://localhost:5000${data.imageUrl}`);
    toast({
      title: "תמונה עודכנה",
      description: "תמונת הפרופיל נשמרה בהצלחה",
    });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  },
  onError: () => {
    toast({
      title: "שגיאה",
      description: "העלאת התמונה נכשלה",
      variant: "destructive",
    });
  },
});


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);
      uploadImage(formDataUpload);
    }
  };

  const handleSave = () => {
    saveProfile({
      fullName: formData.fullName,
      email: formData.email,
      language: formData.selectedLanguage,
      notifications: formData.notifications,
    });

    if (formData.selectedLanguage !== language) {
      setLanguage(formData.selectedLanguage);
      document.documentElement.dir = formData.selectedLanguage === "he" ? "rtl" : "ltr";
      document.documentElement.lang = formData.selectedLanguage;
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <p className="p-4">טוען נתונים...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: t.home, href: "/" },
            { label: t.settings }
          ]}
        />
      </div>

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.settings}</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.profileSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
           <div className="relative">
  <Avatar className="w-24 h-24">
    <AvatarImage
      src={
        profileImage.startsWith("http")
          ? profileImage
          : `http://localhost:5000${profileImage}`
      }
      alt="Profile"
    />
    <AvatarFallback>
      <User className="w-12 h-12" />
    </AvatarFallback>
  </Avatar>
  <Button
    size="sm"
    variant="outline"
    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
    onClick={() => fileInputRef.current?.click()}
  >
    <Camera className="w-4 h-4" />
  </Button>
</div>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t.changePhoto}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{t.fullName}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.systemPreferences}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">{t.notifications}</Label>
                <Switch
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.language}</Label>
                <Select
                  value={formData.selectedLanguage}
                  onValueChange={(value) => handleInputChange('selectedLanguage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="he">{t.hebrew}</SelectItem>
                    <SelectItem value="en">{t.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? "..." : (
                <>
                  <Save className="w-4 h-4" />
                  {t.save}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
