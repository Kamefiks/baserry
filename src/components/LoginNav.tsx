import { useNavigate } from "react-router-dom";

const LoginNav = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full items-center gap-[10px] mt-[2%] pr-[15%] w-full">
      <button
        onClick={() => navigate("login")}
        style={{
          boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.4)",
        }}
        className="bg-black text-white w-[100px] h-[80%] rounded-full text-[16px] font-medium hover:bg-gray-800 transition-colors"
      >
        Zaloguj
      </button>
      <button
        onClick={() => navigate("register")}
        className="bg-transparent text-black w-[100px] h-[80%] rounded-full text-[16px] font-medium hover:bg-gray-100 transition-colors"
      >
        Zajerestruj
      </button>
    </div>
  );
};

export default LoginNav;
