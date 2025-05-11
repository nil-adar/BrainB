
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  dir?: "rtl" | "ltr";
  required?: boolean;
}

export const FormField = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  className = "w-full px-4 py-2 bg-gray-50 border rounded-lg text-right",
  dir,
  required = true,
}: FormFieldProps) => {
  return (
    <div className="relative">
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        dir={dir}
        required={required}
      />
    </div>
  );
};
