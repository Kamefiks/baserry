
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login");
    } else {
      console.error("Błąd wylogowania:", error.message);
    }
  };

  return (
    <div className="flex flex-col absolute bottom-0 pb-[3%] w-full">
      <div className="w-full h-[1px] linear-stroke-gray"></div>
      <div className="  pl-[4%] pt-[7%] pb-[5%] w-full  flex">
        <div className="flex w-full gap-[5%]">
          <div className="flex items-center">
            <div
              style={{
                boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.579)",
              }}
              className="w-[35px]  py-[1px] px-[1px] justify-center border-[#000000] border-[1px]   cursor-pointer rounded-[50px] flex items-center h-[35px] bg-[#040404] "
            >
              <div
                style={{
                  boxShadow: "inset 0 5px 8px rgba(255, 255, 255, 0.356)",
                }}
                className="w-[31px]  cursor-pointer justify-center rounded-[50px] flex items-center h-[31px] bg-[#000000] "
              >
                <User size={18} color="#fefefe"></User>
              </div>
            </div>
          </div>
          <div className="flex leading-5 flex-col justify-center">
            <p className="text-[18px]">{user?.name}</p>
            <p
              title={user?.email}
              className="text-[#636363] font-light text-[14px]"
            >
              {user?.email?.slice(0, 18).padEnd(21, ".")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full pt-[2%] px-[4%]">
        <div className="flex group cursor-pointer gap-[8%]   justify-center items-center">
          <Settings className="group-hover:text-[#000000] duration-150  text-[#5d5d5d]"></Settings>
          <p className="text-[#5d5d5d] group-hover:text-[#000000] duration-150 text-[14px]">
            Opcje
          </p>
        </div>
        <div className="flex group cursor-pointer gap-[8%]  justify-center items-center">
          <LogOut className="group-hover:text-[#7b0a0a] duration-150  text-[#5d5d5d]"></LogOut>
          <p
            onClick={() => logout()}
            className="text-[#5d5d5d] group-hover:text-[#7b0a0a] duration-150 text-[14px]"
          >
            Wyloguj
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
