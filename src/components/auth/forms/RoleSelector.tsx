
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface RoleSelectorProps {
  value: "student" | "parent" | "teacher" | "admin";
  onChange: (value: "student" | "parent" | "teacher" | "admin") => void;
  placeholder: string;
  options: {
    student: string;
    parent: string;
    teacher: string;
    admin: string;
  };
  isRTL: boolean;
}

export const RoleSelector = ({
  value,
  onChange,
  placeholder,
  options,
  isRTL,
}: RoleSelectorProps) => {
  return (
    <div className="relative">
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger 
          className={`w-full px-4 py-2 bg-gray-50 border rounded-lg ${isRTL ? "text-right" : "text-left"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          dir={isRTL ? "rtl" : "ltr"}
          className="bg-white border shadow-lg" 
          position="popper"
        >
          <SelectItem 
            value="student" 
            className={`font-medium ${value === "student" ? "bg-blue-50 text-blue-600" : ""}`}
          >
            {options.student}
          </SelectItem>
          <SelectItem 
            value="parent" 
            className={`font-medium ${value === "parent" ? "bg-blue-50 text-blue-600" : ""}`}
          >
            {options.parent}
          </SelectItem>
          <SelectItem 
            value="teacher" 
            className={`font-medium ${value === "teacher" ? "bg-blue-50 text-blue-600" : ""}`}
          >
            {options.teacher}
          </SelectItem>
          <SelectItem 
            value="admin" 
            className={`font-medium ${value === "admin" ? "bg-blue-50 text-blue-600" : ""}`}
          >
            {options.admin}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
