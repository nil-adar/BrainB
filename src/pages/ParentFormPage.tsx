
import React from 'react';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface ParentFormValues {
  childName: string;
  date: string;
  morningRoutine: string;
  dietPlanAdherence: string;
  activityParticipation: string;
  physicalActivityLevel: string;
  focusAfterActivity: string;
  mealScheduleAdherence: string;
  eatingHabits: string;
  homeworkCompletion: string;
  sleepSchedule: string;
  energyLevels: string;
}

const ParentAssessment = () => {
const { studentId } = useParams<{ studentId: string }>();

  const form = useForm<ParentFormValues>({
    defaultValues: {
      childName: "",
      date: "",
      morningRoutine: "",
      dietPlanAdherence: "",
      activityParticipation: "",
      physicalActivityLevel: "",
      focusAfterActivity: "",
      mealScheduleAdherence: "",
      eatingHabits: "",
      homeworkCompletion: "",
      sleepSchedule: "",
      energyLevels: "",
    },
  });

  const onSubmit = async (data: ParentFormValues) => {
  if (!studentId) {
    toast.error("לא נמצא מזהה תלמיד. לא ניתן לשמור את הטופס.");
    return;
  }

  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId, // ← חובה
        role: "parent",
        formType: "parent-assessment",
        answers: data,
      }),
    });

    if (res.ok) {
      toast.success("שאלון נשלח בהצלחה!");
    } else {
      toast.error("שליחה נכשלה");
    }
  } catch (err) {
    toast.error("שגיאה בשרת");
  }
};


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/recommendations" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            חזרה להמלצות
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">שאלון הורים למעקב התקדמות</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם הילד/ה:</FormLabel>
                        <FormControl>
                          <Input placeholder="שם הילד/ה" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תאריך:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h2 className="text-xl font-semibold pt-4">תצפיות על שגרה יומית</h2>
                
                {/* Morning Routine */}
                <FormField
                  control={form.control}
                  name="morningRoutine"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>השלמת שגרת הבוקר:</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="morningRoutine-1" />
                            <FormLabel htmlFor="morningRoutine-1" className="font-normal cursor-pointer">זקוק/ה לתזכורות קבועות</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="morningRoutine-2" />
                            <FormLabel htmlFor="morningRoutine-2" className="font-normal cursor-pointer">זקוק/ה למספר תזכורות</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="morningRoutine-3" />
                            <FormLabel htmlFor="morningRoutine-3" className="font-normal cursor-pointer">זקוק/ה לתזכורות מדי פעם</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="morningRoutine-4" />
                            <FormLabel htmlFor="morningRoutine-4" className="font-normal cursor-pointer">זקוק/ה לתזכורות מינימליות</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="morningRoutine-5" />
                            <FormLabel htmlFor="morningRoutine-5" className="font-normal cursor-pointer">עצמאי/ת</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Diet Plan Adherence */}
                <FormField
                  control={form.control}
                  name="dietPlanAdherence"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>דבקות בתוכנית תזונה מומלצת:</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="dietPlanAdherence-1" />
                            <FormLabel htmlFor="dietPlanAdherence-1" className="font-normal cursor-pointer">לעולם לא מקפיד/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="dietPlanAdherence-2" />
                            <FormLabel htmlFor="dietPlanAdherence-2" className="font-normal cursor-pointer">לעתים רחוקות מקפיד/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="dietPlanAdherence-3" />
                            <FormLabel htmlFor="dietPlanAdherence-3" className="font-normal cursor-pointer">לפעמים מקפיד/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="dietPlanAdherence-4" />
                            <FormLabel htmlFor="dietPlanAdherence-4" className="font-normal cursor-pointer">בדרך כלל מקפיד/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="dietPlanAdherence-5" />
                            <FormLabel htmlFor="dietPlanAdherence-5" className="font-normal cursor-pointer">תמיד מקפיד/ה</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className="text-xl font-semibold pt-4">מעורבות בפעילות גופנית</h2>
                
                {/* Activity Participation */}
                <FormField
                  control={form.control}
                  name="activityParticipation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>השתתפות בפעילויות מומלצות:</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="activityParticipation-1" />
                            <FormLabel htmlFor="activityParticipation-1" className="font-normal cursor-pointer">מסרב/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="activityParticipation-2" />
                            <FormLabel htmlFor="activityParticipation-2" className="font-normal cursor-pointer">לא מעוניין/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="activityParticipation-3" />
                            <FormLabel htmlFor="activityParticipation-3" className="font-normal cursor-pointer">ניטרלי/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="activityParticipation-4" />
                            <FormLabel htmlFor="activityParticipation-4" className="font-normal cursor-pointer">מוכן/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="activityParticipation-5" />
                            <FormLabel htmlFor="activityParticipation-5" className="font-normal cursor-pointer">נלהב/ת</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Physical Activity Level */}
                <FormField
                  control={form.control}
                  name="physicalActivityLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>כיצד היית מתאר/ת את רמת הפעילות הגופנית הנוכחית של ילדך?</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="physicalActivityLevel-1" />
                            <FormLabel htmlFor="physicalActivityLevel-1" className="font-normal cursor-pointer">ישבני/ת (ללא פעילות)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="physicalActivityLevel-2" />
                            <FormLabel htmlFor="physicalActivityLevel-2" className="font-normal cursor-pointer">נמוכה (תנועה מינימלית)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="physicalActivityLevel-3" />
                            <FormLabel htmlFor="physicalActivityLevel-3" className="font-normal cursor-pointer">בינונית (פעילות מובנית חלקית)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="physicalActivityLevel-4" />
                            <FormLabel htmlFor="physicalActivityLevel-4" className="font-normal cursor-pointer">גבוהה (פעילות גופנית קבועה)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="physicalActivityLevel-5" />
                            <FormLabel htmlFor="physicalActivityLevel-5" className="font-normal cursor-pointer">גבוהה מאוד (פעילות מובנית יומית)</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Focus After Activity */}
                <FormField
                  control={form.control}
                  name="focusAfterActivity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>האם הבחנת בשיפור ביכולת הריכוז של ילדך לאחר פעילות גופנית?</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="focusAfterActivity-1" />
                            <FormLabel htmlFor="focusAfterActivity-1" className="font-normal cursor-pointer">אין שיפור</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="focusAfterActivity-2" />
                            <FormLabel htmlFor="focusAfterActivity-2" className="font-normal cursor-pointer">שיפור קל</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="focusAfterActivity-3" />
                            <FormLabel htmlFor="focusAfterActivity-3" className="font-normal cursor-pointer">שיפור בינוני</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="focusAfterActivity-4" />
                            <FormLabel htmlFor="focusAfterActivity-4" className="font-normal cursor-pointer">שיפור משמעותי</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className="text-xl font-semibold pt-4">דבקות בתוכנית תזונה</h2>

                {/* Meal Schedule Adherence */}
                <FormField
                  control={form.control}
                  name="mealScheduleAdherence"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>מעקב אחר לוח זמני ארוחות מומלץ:</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="mealScheduleAdherence-1" />
                            <FormLabel htmlFor="mealScheduleAdherence-1" className="font-normal cursor-pointer">לעולם לא עוקב/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="mealScheduleAdherence-2" />
                            <FormLabel htmlFor="mealScheduleAdherence-2" className="font-normal cursor-pointer">לעתים רחוקות עוקב/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="mealScheduleAdherence-3" />
                            <FormLabel htmlFor="mealScheduleAdherence-3" className="font-normal cursor-pointer">לפעמים עוקב/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="mealScheduleAdherence-4" />
                            <FormLabel htmlFor="mealScheduleAdherence-4" className="font-normal cursor-pointer">בדרך כלל עוקב/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="mealScheduleAdherence-5" />
                            <FormLabel htmlFor="mealScheduleAdherence-5" className="font-normal cursor-pointer">תמיד עוקב/ת</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Eating Habits */}
                <FormField
                  control={form.control}
                  name="eatingHabits"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>הרגלי האכילה של ילדי השתפרו:</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="eatingHabits-1" />
                            <FormLabel htmlFor="eatingHabits-1" className="font-normal cursor-pointer">הרעה משמעותית</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="eatingHabits-2" />
                            <FormLabel htmlFor="eatingHabits-2" className="font-normal cursor-pointer">הרעה קלה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="eatingHabits-3" />
                            <FormLabel htmlFor="eatingHabits-3" className="font-normal cursor-pointer">ללא שינוי</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="eatingHabits-4" />
                            <FormLabel htmlFor="eatingHabits-4" className="font-normal cursor-pointer">שיפור קל</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="eatingHabits-5" />
                            <FormLabel htmlFor="eatingHabits-5" className="font-normal cursor-pointer">שיפור משמעותי</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className="text-xl font-semibold pt-4">התנהגות בבית</h2>

                {/* Homework Completion */}
                <FormField
                  control={form.control}
                  name="homeworkCompletion"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>באיזו תדירות הילד/ה מסיים/ת שיעורי בית ללא תזכורות מתמידות?</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="homeworkCompletion-1" />
                            <FormLabel htmlFor="homeworkCompletion-1" className="font-normal cursor-pointer">אף פעם</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="homeworkCompletion-2" />
                            <FormLabel htmlFor="homeworkCompletion-2" className="font-normal cursor-pointer">לעתים רחוקות</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="homeworkCompletion-3" />
                            <FormLabel htmlFor="homeworkCompletion-3" className="font-normal cursor-pointer">לפעמים</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="homeworkCompletion-4" />
                            <FormLabel htmlFor="homeworkCompletion-4" className="font-normal cursor-pointer">לעתים קרובות</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="homeworkCompletion-5" />
                            <FormLabel htmlFor="homeworkCompletion-5" className="font-normal cursor-pointer">תמיד</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sleep Schedule */}
                <FormField
                  control={form.control}
                  name="sleepSchedule"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>לוח הזמנים של השינה של ילדי השתפר:</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="sleepSchedule-1" />
                            <FormLabel htmlFor="sleepSchedule-1" className="font-normal cursor-pointer">מאוד לא מסכים/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="sleepSchedule-2" />
                            <FormLabel htmlFor="sleepSchedule-2" className="font-normal cursor-pointer">לא מסכים/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="sleepSchedule-3" />
                            <FormLabel htmlFor="sleepSchedule-3" className="font-normal cursor-pointer">ניטרלי/ת</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="sleepSchedule-4" />
                            <FormLabel htmlFor="sleepSchedule-4" className="font-normal cursor-pointer">מסכים/ה</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="sleepSchedule-5" />
                            <FormLabel htmlFor="sleepSchedule-5" className="font-normal cursor-pointer">מסכים/ה מאוד</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Energy Levels */}
                <FormField
                  control={form.control}
                  name="energyLevels"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>כיצד היית מדרג/ת את רמות האנרגיה הכלליות של ילדך במהלך היום?</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="1" id="energyLevels-1" />
                            <FormLabel htmlFor="energyLevels-1" className="font-normal cursor-pointer">נמוכה מאוד (עייף/ה תמיד)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="2" id="energyLevels-2" />
                            <FormLabel htmlFor="energyLevels-2" className="font-normal cursor-pointer">נמוכה (לעתים קרובות חסר/ת מרץ)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="3" id="energyLevels-3" />
                            <FormLabel htmlFor="energyLevels-3" className="font-normal cursor-pointer">בינונית (ערני/ת במידת מה)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="4" id="energyLevels-4" />
                            <FormLabel htmlFor="energyLevels-4" className="font-normal cursor-pointer">גבוהה (ערני/ת רוב הזמן)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="5" id="energyLevels-5" />
                            <FormLabel htmlFor="energyLevels-5" className="font-normal cursor-pointer">גבוהה מאוד (אנרגטי/ת ומעורב/ת)</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button type="submit" className="w-full">שלח שאלון</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentAssessment;