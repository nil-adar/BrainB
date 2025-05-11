import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScheduleItem } from '@/services/scheduleService';

interface PersonalEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: ScheduleItem) => void;
  language: "en" | "he";
  existingEvents: any[];
}

export const PersonalEventModal = ({
  isOpen,
  onClose,
  onSubmit,
  language,
  existingEvents
}: PersonalEventModalProps) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setStartTime('');
    setEndTime('');
    setSubject('');
    setTopic('');
    setRoom('');
    setNotes('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!startTime || !endTime) {
      setError(language === 'he' ? 'נא למלא שעת התחלה וסיום' : 'Please fill in start and end times');
      return;
    }
  
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      setError(language === 'he' ? 'פורמט זמן לא תקין (HH:MM)' : 'Invalid time format (HH:MM)');
      return;
    }
  
    if (startTime >= endTime) {
      setError(language === 'he' ? 'זמן הסיום חייב להיות אחרי זמן ההתחלה' : 'End time must be after start time');
      return;
    }
  
    const timeRange = `${startTime} - ${endTime}`;
  
    const flatEvents = existingEvents.flatMap(e => e.schedule || []);
  
    const isOverlap = flatEvents.some(existing => {
      if (!existing.time) return false;
  
      const [existingStart, existingEnd] = existing.time.split(' - ');
      return (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      );
    });
  
    if (isOverlap) {
      setError(language === 'he' ? 'קיים כבר אירוע בטווח זמן זה' : 'There is already an event in this time range');
      return;
    }
  
    const newEvent: ScheduleItem = {
      time: timeRange,
      subject: subject || (language === 'he' ? 'אירוע אישי' : 'Personal Event'),
      topic: topic || undefined,
      room: room || (language === 'he' ? 'אישי' : 'Personal'),
      isPersonal: true,
      notes: notes || undefined
    };
  
    onSubmit(newEvent);
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'he' ? 'הוספת אירוע אישי' : 'Add Personal Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>{language === 'he' ? 'טווח שעות' : 'Time Range'}</Label>
            <div className="flex items-center gap-2">
              <Input type="text" placeholder="08:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-1/2" />
              <span>-</span>
              <Input type="text" placeholder="09:00" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-1/2" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>{language === 'he' ? 'מקצוע' : 'Subject'}</Label>
            <Input
              type="text"
              placeholder={language === 'he' ? 'לדוגמה: מתמטיקה' : 'e.g., Math'}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'he' ? 'נושא' : 'Topic'}</Label>
            <Input
              type="text"
              placeholder={language === 'he' ? 'לדוגמה: פתרון תרגילים' : 'e.g., Practice'}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'he' ? 'מיקום' : 'Location'}</Label>
            <Input
              type="text"
              placeholder={language === 'he' ? 'חדר / מיקום' : 'Room / Location'}
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'he' ? 'הערות' : 'Notes'}</Label>
            <Textarea
              placeholder={language === 'he' ? 'הערות נוספות...' : 'Additional notes...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </Button>
            </DialogClose>
            <Button type="submit">
              {language === 'he' ? 'הוסף אירוע' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
