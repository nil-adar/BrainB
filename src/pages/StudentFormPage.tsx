import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
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
import { translations } from "@/utils/studentDashboardData";

interface ChildFormValues {
  name: string;
  date: string;
  focusInClass: string;
  feelingLessTired: string;
  seatHelpsWithFocus: string;
  feelingAboutFood: string;
  physicalActivityHelps: string;
}

const StudentFormPage = () => {
  const { studentId } = useParams();
  const language = localStorage.getItem("language") || "he";
  const t = translations[language];
  const isRTL = language === "he";

  const form = useForm<ChildFormValues>({ //Answers in the form
    defaultValues: {
      name: "",
      date: "",
      focusInClass: "", //empty for answer
      feelingLessTired: "",
      seatHelpsWithFocus: "",
      feelingAboutFood: "",
      physicalActivityHelps: "",
    },
  });

  const onSubmit = async (data: ChildFormValues) => {
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          role: "student",
          formType: "pre-diagnosis",
          answers: data,
        }),
      });

      if (res.ok) {
        toast.success(isRTL ? "השאלון נשלח בהצלחה" : "Form submitted successfully");
      } else {
        toast.error(isRTL ? "שגיאה בשליחת הטופס" : "Failed to submit form");
      }
    } catch (err) {
      toast.error(isRTL ? "שגיאה בשרת" : "Server error");
    }
  };

  const renderQuestion = (
    name: keyof ChildFormValues,
    label: string,
    options: string[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className={isRTL ? "text-right w-full" : "text-left"}>{label}</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center ${isRTL ? "justify-end space-x-reverse space-x-2" : "justify-start space-x-2"}`}
                >
                  <FormLabel htmlFor={`${name}-${idx}`} className={`font-normal cursor-pointer ${isRTL ? "order-1" : "order-2"}`}>
                    {opt}
                  </FormLabel>
                  <RadioGroupItem value={(idx + 1).toString()} id={`${name}-${idx}`} className={isRTL ? "order-2" : "order-1"} />
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className={`min-h-screen bg-background p-4 md:p-8 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t.child?.title || "שאלון לתלמיד"}</h1>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isRTL ? "text-right w-full" : "text-left"}>{t["name"]}</FormLabel>
                        <FormControl>
                          <Input {...field} className={isRTL ? "text-right" : "text-left"} />
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
                        <FormLabel className={isRTL ? "text-right w-full" : "text-left"}>{t["date"]}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className={isRTL ? "text-right" : "text-left"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

               {renderQuestion("focusInClass", t.child?.focus || "כמה אתה מצליח להתרכז בכיתה?", [t.none, t.little, t.sometimes, t.most, t.always])}
{renderQuestion("feelingLessTired", t.child?.tired || "כמה אתה מרגיש עייף במהלך היום?", [t.none, t.little, t.sometimes, t.most, t.always])}
{renderQuestion("seatHelpsWithFocus", t.child?.seat || "האם המקום שבו אתה יושב עוזר לך להתרכז?", [t.moreDistracted, t.noDifference, t.helpsLittle, t.helpsMuch])}
{renderQuestion("feelingAboutFood", t.child?.food || "מה התחושה שלך לגבי האוכל בבית הספר?", [t.dislikeAll, t.likeSome, t.likeMost, t.enjoyAll])}
{renderQuestion("physicalActivityHelps", t.child?.physicalActivity || "עד כמה פעילות גופנית עוזרת לך להרגיש טוב יותר?", [t.none, t.little, t.sometimes, t.most, t.always])}
                    

                <div className="pt-6">
                  <Button type="submit" className="w-full">{t["submit"]}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentFormPage;
