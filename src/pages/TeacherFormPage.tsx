/*import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
// import { useLanguage } from '@/contexts/LanguageContext'; // 
import { useSearchParams } from "react-router-dom";
interface TeacherFormValues {
  studentName: string;
  date: string;
  class: string;
  taskCompletion: string;
  focusImprovement: string;
  organizationImprovement: string;
  energyLevel: string;
  alertness: string;
  seatingResponse: string;
  physicalEngagement: string;
  concentrationAfterActivity: string;
}

const TeacherAssessment = () => {

  const form = useForm<TeacherFormValues>({
    defaultValues: {
      studentName: "",
      date: "",
      class: "",
      taskCompletion: "",
      focusImprovement: "",
      organizationImprovement: "",
      energyLevel: "",
      alertness: "",
      seatingResponse: "",
      physicalEngagement: "",
      concentrationAfterActivity: "",
    },
  });
const [searchParams] = useSearchParams();
const studentId = searchParams.get("studentId");
const onSubmit = async (data: TeacherFormValues) => {
  if (!studentId) {
    toast.error("לא נמצא מזהה תלמיד. לא ניתן לשמור את הטופס.");
    return;
  }

  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        role: "teacher", // ← שימו לב לשדה זה
        formType: "teacher-assessment",
        answers: data,
      }),
    });

    if (res.ok) {
      toast.success("השאלון נשלח בהצלחה!");
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
          <Link
            to="/recommendations"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {/* תמיד mr-2 */}
         {/*  Back to Recommendations {/* תמיד באנגלית */}
{/*</Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          Teacher Progress Assessment Form {/* תמיד באנגלית */}
        /*</h1>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                dir="ltr" // תמיד LTR
              >*/
                {/* Basic Information */}
                {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Name:</FormLabel>
                        <FormControl>
                          <Input placeholder="Student Name" {...field} />
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
                        <FormLabel>Date:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class:</FormLabel>
                        <FormControl>
                          <Input placeholder="Class" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h2 className="text-xl font-semibold pt-4">
                  Academic Performance
                </h2>

                {/* Task Completion */}
                {/*<FormField
                  control={form.control}
                  name="taskCompletion"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        How often does the student complete tasks on time?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="taskCompletion-1" />
                            <FormLabel
                              htmlFor="taskCompletion-1"
                              className="font-normal cursor-pointer"
                            >
                              Never
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="taskCompletion-2" />
                            <FormLabel
                              htmlFor="taskCompletion-2"
                              className="font-normal cursor-pointer"
                            >
                              Rarely
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="taskCompletion-3" />
                            <FormLabel
                              htmlFor="taskCompletion-3"
                              className="font-normal cursor-pointer"
                            >
                              Sometimes
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="taskCompletion-4" />
                            <FormLabel
                              htmlFor="taskCompletion-4"
                              className="font-normal cursor-pointer"
                            >
                              Often
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5" id="taskCompletion-5" />
                            <FormLabel
                              htmlFor="taskCompletion-5"
                              className="font-normal cursor-pointer"
                            >
                              Always
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Focus Improvement */}
                {/*<FormField
                  control={form.control}
                  name="focusImprovement"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        The student's ability to maintain focus during lessons
                        has improved:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="focusImprovement-1"
                            />
                            <FormLabel
                              htmlFor="focusImprovement-1"
                              className="font-normal cursor-pointer"
                            >
                              Strongly Disagree
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="2"
                              id="focusImprovement-2"
                            />
                            <FormLabel
                              htmlFor="focusImprovement-2"
                              className="font-normal cursor-pointer"
                            >
                              Disagree
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="3"
                              id="focusImprovement-3"
                            />
                            <FormLabel
                              htmlFor="focusImprovement-3"
                              className="font-normal cursor-pointer"
                            >
                              Neutral
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="4"
                              id="focusImprovement-4"
                            />
                            <FormLabel
                              htmlFor="focusImprovement-4"
                              className="font-normal cursor-pointer"
                            >
                              Agree
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="5"
                              id="focusImprovement-5"
                            />
                            <FormLabel
                              htmlFor="focusImprovement-5"
                              className="font-normal cursor-pointer"
                            >
                              Strongly Agree
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization Improvement */}
               {/*} <FormField
                  control={form.control}
                  name="organizationImprovement"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        The organization of study materials and the student's
                        work environment has improved:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="organizationImprovement-1"
                            />
                            <FormLabel
                              htmlFor="organizationImprovement-1"
                              className="font-normal cursor-pointer"
                            >
                              Strongly Disagree
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="2"
                              id="organizationImprovement-2"
                            />
                            <FormLabel
                              htmlFor="organizationImprovement-2"
                              className="font-normal cursor-pointer"
                            >
                              Disagree
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="3"
                              id="organizationImprovement-3"
                            />
                            <FormLabel
                              htmlFor="organizationImprovement-3"
                              className="font-normal cursor-pointer"
                            >
                              Neutral
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="4"
                              id="organizationImprovement-4"
                            />
                            <FormLabel
                              htmlFor="organizationImprovement-4"
                              className="font-normal cursor-pointer"
                            >
                              Agree
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="5"
                              id="organizationImprovement-5"
                            />
                            <FormLabel
                              htmlFor="organizationImprovement-5"
                              className="font-normal cursor-pointer"
                            >
                              Strongly Agree
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className="text-xl font-semibold pt-4">
                  Physical Observations
                </h2>

                {/* Energy Level */}
                {/*<FormField
                  control={form.control}
                  name="energyLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        The student's energy level is appropriate for learning
                        activities:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="energyLevel-1" />
                            <FormLabel
                              htmlFor="energyLevel-1"
                              className="font-normal cursor-pointer"
                            >
                              Never
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="energyLevel-2" />
                            <FormLabel
                              htmlFor="energyLevel-2"
                              className="font-normal cursor-pointer"
                            >
                              Rarely
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="energyLevel-3" />
                            <FormLabel
                              htmlFor="energyLevel-3"
                              className="font-normal cursor-pointer"
                            >
                              Sometimes
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="energyLevel-4" />
                            <FormLabel
                              htmlFor="energyLevel-4"
                              className="font-normal cursor-pointer"
                            >
                              Often
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5" id="energyLevel-5" />
                            <FormLabel
                              htmlFor="energyLevel-5"
                              className="font-normal cursor-pointer"
                            >
                              Always
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Alertness */}
               {/* <FormField
                  control={form.control}
                  name="alertness"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>The student appears alert and rested:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="alertness-1" />
                            <FormLabel
                              htmlFor="alertness-1"
                              className="font-normal cursor-pointer"
                            >
                              Never
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="alertness-2" />
                            <FormLabel
                              htmlFor="alertness-2"
                              className="font-normal cursor-pointer"
                            >
                              Rarely
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="alertness-3" />
                            <FormLabel
                              htmlFor="alertness-3"
                              className="font-normal cursor-pointer"
                            >
                              Sometimes
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="alertness-4" />
                            <FormLabel
                              htmlFor="alertness-4"
                              className="font-normal cursor-pointer"
                            >
                              Often
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5" id="alertness-5" />
                            <FormLabel
                              htmlFor="alertness-5"
                              className="font-normal cursor-pointer"
                            >
                              Always
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seating Response */}
               {/* <FormField
                  control={form.control}
                  name="seatingResponse"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        How did the student respond to the current seating
                        arrangement in class?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="seatingResponse-1"
                            />
                            <FormLabel
                              htmlFor="seatingResponse-1"
                              className="font-normal cursor-pointer"
                            >
                              Negatively affects concentration
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="2"
                              id="seatingResponse-2"
                            />
                            <FormLabel
                              htmlFor="seatingResponse-2"
                              className="font-normal cursor-pointer"
                            >
                              No noticeable effect
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="3"
                              id="seatingResponse-3"
                            />
                            <FormLabel
                              htmlFor="seatingResponse-3"
                              className="font-normal cursor-pointer"
                            >
                              Slightly improves concentration
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="4"
                              id="seatingResponse-4"
                            />
                            <FormLabel
                              htmlFor="seatingResponse-4"
                              className="font-normal cursor-pointer"
                            >
                              Significantly improves concentration
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className="text-xl font-semibold pt-4">
                  Physical Activity Response
                </h2>

                {/* Physical Engagement */}
               {/* <FormField
                  control={form.control}
                  name="physicalEngagement"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Engagement in assigned physical activities:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="physicalEngagement-1"
                            />
                            <FormLabel
                              htmlFor="physicalEngagement-1"
                              className="font-normal cursor-pointer"
                            >
                              Refuses to participate
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="2"
                              id="physicalEngagement-2"
                            />
                            <FormLabel
                              htmlFor="physicalEngagement-2"
                              className="font-normal cursor-pointer"
                            >
                              Minimal participation
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="3"
                              id="physicalEngagement-3"
                            />
                            <FormLabel
                              htmlFor="physicalEngagement-3"
                              className="font-normal cursor-pointer"
                            >
                              Moderate participation
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="4"
                              id="physicalEngagement-4"
                            />
                            <FormLabel
                              htmlFor="physicalEngagement-4"
                              className="font-normal cursor-pointer"
                            >
                              Good participation
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="5"
                              id="physicalEngagement-5"
                            />
                            <FormLabel
                              htmlFor="physicalEngagement-5"
                              className="font-normal cursor-pointer"
                            >
                              Excellent participation
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Concentration After Activity */}
               {/* <FormField
                  control={form.control}
                  name="concentrationAfterActivity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Did the student show improved concentration after
                        physical activity?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="concentrationAfterActivity-1"
                            />
                            <FormLabel
                              htmlFor="concentrationAfterActivity-1"
                              className="font-normal cursor-pointer"
                            >
                              No improvement
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="2"
                              id="concentrationAfterActivity-2"
                            />
                            <FormLabel
                              htmlFor="concentrationAfterActivity-2"
                              className="font-normal cursor-pointer"
                            >
                              Slight improvement
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="3"
                              id="concentrationAfterActivity-3"
                            />
                            <FormLabel
                              htmlFor="concentrationAfterActivity-3"
                              className="font-normal cursor-pointer"
                            >
                              Moderate improvement
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="4"
                              id="concentrationAfterActivity-4"
                            />
                            <FormLabel
                              htmlFor="concentrationAfterActivity-4"
                              className="font-normal cursor-pointer"
                            >
                              Significant improvement
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button type="submit" className="w-full">
                    Submit Assessment {/* תמיד באנגלית */}
                {/*  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAssessment;