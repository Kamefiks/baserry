import ButtonEditNote from "@/components/ButtonCustom";
import Input from "@/components/Input";
import Nav from "@/components/Nav";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import { User } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | undefined>();
  const { setUser } = useApp();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const response = error.status;
      if (response == 400)
        setMsg("Wprowadzone hasło/email jest nieprawidłowe.");
      console.log("Kod błędu:", error.status);
      console.log("Treść błędu:", error.message);
    } else {
      setMsg("Zalogowano!");
      console.log("Użytkownik:", data.user);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user?.user_metadata.username);
      const account: User = {
        id: user?.id,
        email: user?.email,
        name: user?.user_metadata.username,
      };
      setUser(account);

      navigate("/dashboard");
    }
  };
  return (
    <div className="w-full h-full flex-col flex  ">
      <div className="w-full flex h-full">
        <div className="flex w-[65%]  h-full flex-col">
          <Nav withLogin={false}></Nav>
          <div className="pl-[7%] pt-[5%] h-full flex-col flex w-full">
            <p className="font-primary text-[53px] font-bold">
              Witaj z powrotem,
            </p>
            <p className="font-secondary pt-[1%] text-[17px] font-regular text-[#5D5D5D]">
              Nie posiadasz konta?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-medium text-[#141414] cursor-pointer"
              >
                Zajerestruj się
              </span>
            </p>
            <div className="pt-[9%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Email</p>
              <Input
                type="Email"
                action="login"
                val={email}
                onChange={setEmail}
              ></Input>
            </div>
            <div className="pt-[2%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Hasło</p>
              <Input
                type="Hasło"
                action="login"
                val={password}
                onChange={setPassword}
              ></Input>
              {/* <div className="w-[55%] flex justify-end">
                <p
                  onClick={() => navigate("/forgot-password")}
                  className="text-[15px] cursor-pointer text-[#1627C0] underline pt-[8px]"
                >
                  Zapomniałeś hasła?
                </p>
              </div> */}
            </div>
            <div className="pt-[7%] flex flex-col">
              <ButtonEditNote
                height="45px"
                width="55%"
                content={"Zaloguj się"}
                action={handleLogin}
              ></ButtonEditNote>
            </div>
            <div className="flex w-[55%] pt-3 justify-center">
              <p
                className={`${msg == "Wprowadzone hasło/email jest nieprawidłowe." ? "text-[#611414]" : "text-[#222222]"}`}
              >
                {msg}
              </p>
            </div>
          </div>
        </div>

        <div className="w-[45%] max-h-screen min-h-screen flex flex-col">
          <img
            src="Gradient2.webp"
            className=" w-full h-full object-cover"
            alt="image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
