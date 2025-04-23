
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BellDot } from "lucide-react";

interface Notification {
  id: number;
  teacherId: string;
  message: string;
  timestamp: string;
  read: boolean;
  isChecked: boolean;
  color: string;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onNotificationCheckboxChange: (id: number) => void;
  onColorSelection: (id: number, color: string) => void;
  translations: {
    notifications: string;
    noNotifications: string;
  };
}

export const NotificationsDropdown = ({
  notifications,
  onNotificationCheckboxChange,
  onColorSelection,
  translations: t,
}: NotificationsDropdownProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellDot className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {notifications.length > 0 ? (
              notifications.map(n => (
                <DropdownMenuItem key={n.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{n.message}</span>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={n.isChecked}
                        onCheckedChange={() => onNotificationCheckboxChange(n.id)}
                      />
                      {n.isChecked && (
                        <div className="flex gap-1">
                          {['purple','green','blue','yellow'].map(col => (
                            <button
                              key={col}
                              className={`w-4 h-4 rounded-full bg-${col}-400`}
                              onClick={() => onColorSelection(n.id, col)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.timestamp).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                <span className="text-muted-foreground">{t.noNotifications}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
