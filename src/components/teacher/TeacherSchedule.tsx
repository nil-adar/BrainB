import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { he } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import scheduleService from "@/services/scheduleService";
import { PersonalEventModal } from "@/components/teacher/PersonalEventModal";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";


import { useQuery } from "@tanstack/react-query";

interface TeacherScheduleProps {
  teacherId: string;
  translations: {
    schedule: string;
    time: string;
    subject: string;
    topic: string;
    room: string;
    digitalClock: string;
  };
  language: "en" | "he";
}

export const TeacherSchedule = ({ teacherId, translations: t, language }: TeacherScheduleProps) => {
  // Initialize with current date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const queryClient = useQueryClient();


  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };
  
  // Reset to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Format day of week and date based on selected language
  const dayOfWeek = format(selectedDate, 'EEEE', { locale: language === 'he' ? he : undefined });
  const formattedDate = format(selectedDate, 'dd/MM/yyyy');
  
  // Format digital time
  const formattedTime = new Date().toLocaleTimeString(language === "he" ? "he-IL" : "en-US", {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Fetch schedule data for the selected date
  const { data: scheduleData = [], isLoading } = useQuery({
    queryKey: ['schedule', teacherId, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => scheduleService.getTeacherScheduleForDay(teacherId, selectedDate),
  });
  console.log("📅 scheduleData (raw):", scheduleData);


  return (
    <>
      <Card className="shadow-md overflow-hidden border-2 border-secondary/40">
        <CardHeader className="bg-secondary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl font-semibold">
                {t.schedule} - {dayOfWeek} ({formattedDate})
              </CardTitle>
            </div>
  
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousDay}
                title={language === "he" ? "היום הקודם" : "Previous day"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
  
              <Button
                variant="secondary"
                size="sm"
                onClick={goToToday}
                className="px-3 text-sm"
              >
                {language === "he" ? "היום" : "Today"}
              </Button>
  
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextDay}
                title={language === "he" ? "היום הבא" : "Next day"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table className="table-fixed w-full">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[120px] font-bold text-right" dir="rtl">{language === "he" ? "שעה" : t.time}</TableHead>
                    <TableHead className="w-[25%] font-bold text-right" dir="rtl">{language === "he" ? "מקצוע" : t.subject}</TableHead>
                    <TableHead className="w-[30%] font-bold text-right" dir="rtl">{language === "he" ? "נושא" : t.topic || "Topic"}</TableHead>
                    <TableHead className="w-[15%] font-bold text-right" dir="rtl">{language === "he" ? "כיתה" : t.room}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleData.length > 0 ? (
                    scheduleData.flatMap((event, index) =>
                      event.schedule.map((slot, subIndex) => (
                        <TableRow key={`${index}-${subIndex}`} className={(index + subIndex) % 2 === 0 ? "bg-muted/10" : ""}>
                          <TableCell className="font-medium text-right" dir="rtl">{slot.time}</TableCell>
                          <TableCell className="text-right" dir="rtl">{slot.subject}</TableCell>
                          <TableCell className="text-right" dir="rtl">{slot.topic || "-"}</TableCell>
                          <TableCell className="text-right" dir="rtl">{slot.room}</TableCell>
                        </TableRow>
                      ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {language === "he" ? "אין שיעורים להיום" : "No classes scheduled for this day"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
  
              <Button
                onClick={() => setShowEventModal(true)}
                className="mt-6 bg-primary text-white"
              >
                {language === "he" ? "הוסף אירוע אישי" : "Add Personal Event"}
              </Button>
  
              <div className="mt-8 flex justify-center items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <Clock className="w-6 h-6 text-primary" />
                <div className="text-3xl font-mono font-semibold">
                  {formattedTime}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
  
      <PersonalEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={async (newEvent) => {
          console.log("✅ newEvent before submit:", newEvent);
          try {
            await axios.post("/api/schedule", {
              teacherId,
              date: format(selectedDate, "yyyy-MM-dd"),
              schedule: [
                {
                  time: newEvent.time,
                  subject: newEvent.subject,
                  topic: newEvent.topic,
                  room: newEvent.room,
                }
              ],
              isPersonal: true,
              notes: newEvent.notes,
            });

            setShowEventModal(false);
            await queryClient.invalidateQueries({
              queryKey: ['schedule', teacherId, format(selectedDate, 'yyyy-MM-dd')],
            });
          } catch (err) {
            console.error("❌ שגיאה בהוספת אירוע אישי", err);
          }
        }}
        language={language}
        existingEvents={scheduleData}
      />
    </>
  );
};