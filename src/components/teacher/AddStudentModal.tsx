    import { useState } from "react";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
    import { Button } from "@/components/ui/button";
    import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import * as z from "zod";
    import { toast } from "sonner";
    import { useQueryClient } from "@tanstack/react-query";
    import { teacherService } from "@/services/teacherService";

    // סכמה לאימות נתוני התלמיד
    const studentSchema = z.object({
    firstName: z.string().min(2, "השם הפרטי חייב להכיל לפחות 2 תווים"),
    lastName: z.string().min(2, "שם המשפחה חייב להכיל לפחות 2 תווים"),
    uniqueId: z.string().min(9, "תעודת זהות חייבת להכיל לפחות 9 ספרות"),
    classId: z.string().min(1, "יש לבחור כיתה")
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
    currentClass = ""
    }: AddStudentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
        firstName: "",
        lastName: "",
        uniqueId: "",
        classId: currentClass
        }
    });

    const onSubmit = async (values: StudentFormValues) => {
        setIsSubmitting(true);
        try {
            const classId = currentClass?.classId || "";
            const className = currentClass?.className || "";
            
        // שילוב נתוני התלמיד החדש
        const newStudent = {
            firstName: values.firstName,
            lastName: values.lastName,
            uniqueId: values.uniqueId,
            classId: classId,
            class: className,
            name: `${values.firstName} ${values.lastName}`,
            teacherId: teacherId,
            userId: values.firstName.toLowerCase() + new Date().getFullYear(),
            email: `${values.firstName.toLowerCase()}@student.school.com`,
            phone: "050-" + Math.floor(1000000 + Math.random() * 9000000),
            role: "student" as const,
            password: "password123",
            dateOfBirth: new Date(new Date().getFullYear() - 10, 0, 1).toISOString().split('T')[0],
            parentIds: [],
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            tasks: [],
            progressReports: []
          };
          

        const result = await teacherService.addNewStudent(newStudent);

        if (result.success) {
            toast.success("התלמיד נוסף בהצלחה");
            // רענון רשימת התלמידים
            queryClient.invalidateQueries({ queryKey: ['allStudents'] });
            form.reset();
            onOpenChange(false);
        } else {
            toast.error("שגיאה בהוספת התלמיד");
        }
        } catch (error) {
        console.error("Error adding student:", error);
        toast.error("שגיאה בהוספת התלמיד");
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
            <DialogHeader>
            <DialogTitle className="text-xl font-semibold">הוספת תלמיד חדש</DialogTitle>
            </DialogHeader>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>שם פרטי</FormLabel>
                    <FormControl>
                        <Input placeholder="הזן שם פרטי" {...field} />
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
                    <FormLabel>שם משפחה</FormLabel>
                    <FormControl>
                        <Input placeholder="הזן שם משפחה" {...field} />
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
                    <FormLabel>תעודת זהות</FormLabel>
                    <FormControl>
                        <Input placeholder="הזן תעודת זהות" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>כיתה</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="בחר כיתה" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {classes.length > 0 ? (
                            classes.map((cls) => (
                            <SelectItem key={cls} value={cls}>
                                {cls}
                            </SelectItem>
                            ))
                        ) : (
                            <>
                            <SelectItem value="א">א'</SelectItem>
                            <SelectItem value="ב">ב'</SelectItem>
                            <SelectItem value="ג">ג'</SelectItem>
                            <SelectItem value="ד">ד'</SelectItem>
                            <SelectItem value="ה">ה'</SelectItem>
                            <SelectItem value="ו">ו'</SelectItem>
                            </>
                        )}
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
                    ביטול
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "מוסיף..." : "הוסף תלמיד"}
                </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
        </Dialog>
    );
    }