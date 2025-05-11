
import { useNavigate } from "react-router-dom";

interface LoginLinkProps {
  text: string;
}

export const LoginLink = ({ text }: LoginLinkProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <button 
        onClick={() => navigate("/login")} 
        className="text-blue-600 hover:underline"
        type="button"
      >
        {text}
      </button>
    </div>
  );
};
