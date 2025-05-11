
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BellDot } from "lucide-react";
import { string } from "zod";
import { ParentNotification } from "@/hooks/useParentNotifications";

interface NotificationsDropdownProps {
  notifications: ParentNotification[];
  translations: {
    notifications: string;
    noNotifications: string;
    viewConversation: string;
    viewAssessment: string;
  };
  onNotificationClick: (parentId: string, studentId: string, studentName: string) => void;
  onNotificationCheckboxChange: (notificationId: string) => void;
  onColorSelection: (notificationId: string, color: string) => void;
}


export const NotificationsDropdown = ({
  notifications,
  translations: t,
  onNotificationClick,
  onNotificationCheckboxChange,
  onColorSelection,
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
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-4 ${notification.color ? `bg-${notification.color}-100` : notification.read ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{notification.studentName}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onNotificationClick(notification.parentId, notification.studentId, notification.studentName)
                          }
                        >
                          {t.viewConversation}

                        </Button>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notification.isChecked}
                            onCheckedChange={() => onNotificationCheckboxChange(String(notification.id))}

                         
                          />
                          {notification.isChecked && (
                            <div className="flex gap-1">
                              {['purple', 'green', 'blue', 'yellow'].map((color) => (
                                <button
                                  key={color}
                                  className={`w-4 h-4 rounded-full bg-${color}-400 hover:bg-${color}-500`}
                                  onClick={() => onColorSelection(String(notification.id), color)}

                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
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
