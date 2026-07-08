import { KeyRound, KeySquare, Mail, UserRound } from "lucide-react";
import { ReactNode } from "react";

const Input = ({
  type,
  action,
  onChange,
  val,
}: {
  type: string;
  action: string;
  onChange: (string: string) => void;
  val: string;
}) => {
  const icons: Record<string, ReactNode> = {
    Nazwa: <UserRound color="#D5D5D5" size={23}></UserRound>,
    Hasło: <KeyRound color="#D5D5D5" size={23}></KeyRound>,
    "Kod dostępu": <KeySquare color="#D5D5D5" size={23}></KeySquare>,
    Email: <Mail color="#D5D5D5" size={23}></Mail>,
  };
  return (
    <div
      className={`bg-[#FBFBFB] w-[90%] border-[1px]  gap-[1.5%]  border-[#D3D3D3] rounded-[14px]  flex items-center pl-[1%] ${
        type === "Hasło" && action == "register" ? "sm:w-[100%]" : "sm:w-[55%]"
      }`}
    >
      {icons[type]}
      <input
        type={
          type === "Hasło" ? "password" : type === "Email" ? "email" : "text"
        }
        className="w-[90%] text-[16px] h-[37px] flex outline-0"
        onChange={(e) => onChange(e.target.value)}
        value={val}
        placeholder={type}
      />
    </div>
  );
};

export default Input;
