import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/teacherService";
import { useSettings } from "@/components/SettingsContext";

// תרגומים מרכזיים
const translations = {
  he: {
    // Dialog
    title: "הוספת תלמיד חדש",

    // Form labels
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    uniqueId: "תעודת זהות",
    classId: "כיתה",
    extraTime: "תוספת זמן",

    // Placeholders
    firstNamePlaceholder: "הזן שם פרטי",
    lastNamePlaceholder: "הזן שם משפחה",
    uniqueIdPlaceholder: "הזן תעודת זהות",
    selectClass: "בחר כיתה",
    selectExtraTime: "בחר תוספת זמן",

    // Extra time options
    noExtraTime: "אין",
    extraTime25: "25%",
    extraTime50: "50%",

    // Buttons
    cancel: "ביטול",
    addStudent: "הוסף תלמיד",
    adding: "מוסיף...",

    // Messages
    successMessage: "התלמיד נוסף בהצלחה",
    errorMessage: "שגיאה בהוספת התלמיד",
    studentExistsError: "תלמיד עם תעודת זהות זו כבר קיים במערכת",

    // Validation messages
    firstNameError: "השם הפרטי חייב להכיל לפחות 2 תווים",
    lastNameError: "שם המשפחה חייב להכיל לפחות 2 תווים",
    uniqueIdError: "תעודת זהות חייבת להכיל לפחות 9 ספרות",
    classError: "יש לבחור כיתה",
  },
  en: {
    // Dialog
    title: "Add New Student",

    // Form labels
    firstName: "First Name",
    lastName: "Last Name",
    uniqueId: "ID Number",
    classId: "Class",
    extraTime: "Extra Time",

    // Placeholders
    firstNamePlaceholder: "Enter first name",
    lastNamePlaceholder: "Enter last name",
    uniqueIdPlaceholder: "Enter ID number",
    selectClass: "Select class",
    selectExtraTime: "Select extra time",

    // Extra time options
    noExtraTime: "None",
    extraTime25: "25%",
    extraTime50: "50%",

    // Buttons
    cancel: "Cancel",
    addStudent: "Add Student",
    adding: "Adding...",

    // Messages
    successMessage: "Student added successfully",
    errorMessage: "Error adding student",
    studentExistsError:
      "A student with this ID number already exists in the system",

    // Validation messages
    firstNameError: "First name must contain at least 2 characters",
    lastNameError: "Last name must contain at least 2 characters",
    uniqueIdError: "ID number must contain at least 9 digits",
    classError: "Please select a class",
  },
};

// סכמה לאימות נתוני התלמיד - כמו במקור
const studentSchema = z.object({
  firstName: z.string().min(2, "השם הפרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם המשפחה חייב להכיל לפחות 2 תווים"),
  uniqueId: z.string().min(9, "תעודת זהות חייבת להכיל לפחות 9 ספרות"),

  extraTime: z.enum(["none", "25", "50"]).optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  currentClass: {
    classId: string;
    className: string;
    schoolId?: string;
    schoolName?: string;
  };
  classes?: string[];
}

export function AddStudentModal({
  open,
  onOpenChange,
  teacherId,
  classes = [],
  currentClass,
}: AddStudentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { language } = useSettings();
  const t = translations[language];

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      uniqueId: "",
      
      extraTime: "none",
    },
  });

 const onSubmit = async (values: StudentFormValues) => {
  setIsSubmitting(true);
  try {
    const classId = currentClass?.classId || "";
    const classNameRaw = currentClass?.className || "";

    const normalizedClassName = classNameRaw
      .replace(/[\u200f\u200e\u00a0\u200b]/g, " ")
      .replace(/^כיתה[\s:\-]*/i, "")
      .trim();

    // ✅ ניקוי שם + יצירת אימייל חוקי באנגלית
    const sanitizedName = values.firstName
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const emailName = sanitizedName || `student${Date.now()}`;

   const newStudent = {
  firstName: values.firstName,
  lastName: values.lastName,
  // uniqueId: values.uniqueId, // ❌ אל תשלח לשרת
  classId: classId,
  class: normalizedClassName,
  name: `${values.firstName} ${values.lastName}`,
  teacherId: teacherId,
  userId: `${emailName}_${new Date().getFullYear()}`,
  email: `${emailName}@student.school.com`,
  phone: "050-" + Math.floor(1000000 + Math.random() * 9000000),
  role: "student" as const,
  password: "password123",
  dateOfBirth: new Date(new Date().getFullYear() - 10, 0, 1)
    .toISOString()
    .split("T")[0],
  parentIds: [],
  avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
  tasks: [],
  progressReports: [],
  extraTime:
    values.extraTime === "none" ? 1 : 1 + Number(values.extraTime) / 100,
};


    console.log("🧪 שליחה   לשרת:", newStudent);

    const result = await teacherService.addNewStudent(newStudent);

    if (result.success) {
      toast.success(t.successMessage);
      queryClient.invalidateQueries({ queryKey: ["allStudents"] });
      form.reset();
      onOpenChange(false);
    } else {
      toast.error(t.errorMessage);
    }
  } catch (error) {
    console.error("Error adding student:", error);
    toast.error(t.errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        dir={language === "he" ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{t.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.firstName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.firstNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.lastName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.lastNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uniqueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.uniqueId}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.uniqueIdPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            <FormField
              control={form.control}
              name="extraTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.extraTime}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectExtraTime} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="none">{t.noExtraTime}</SelectItem>
                      <SelectItem value="25">{t.extraTime25}</SelectItem>
                      <SelectItem value="50">{t.extraTime50}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t.adding : t.addStudent}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
