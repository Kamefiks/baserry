import ButtonEditNote from "@/components/ButtonCustom";
import Input from "@/components/Input";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

const ForgotPassword = () => {
  const handleReset = (hash?: string, newPassword?: string): void => {
    if (!hash || !newPassword) return;
    const fetchData = async () => {
      const { data, error } = await supabase.functions.invoke(
        "reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: "example@example.com",
            recovery_code: "123456",
            new_password: "newStrongPassword123",
          }),
        }
      );

      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    };

    fetchData();
  };

  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  return (
    <div className="w-full h-full flex-col flex  ">
      <div className="w-full flex h-full">
        <div className="flex w-[65%]  h-full flex-col">
          <Nav withLogin={false}></Nav>
          <div className="pl-[7%] pt-[5%] h-full flex-col flex w-full">
            <p className="font-primary text-[53px] font-bold">
              Zmień swoje hasło.
            </p>
            <p className="font-secondary pt-[1%] text-[17px] font-regular text-[#5D5D5D]">
              Szybko, intuicyjnie i wygodnie.{" "}
            </p>
            <div className="pt-[8%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Email</p>
              <Input
                type="Email"
                action="login"
                val={email}
                onChange={setEmail}
              ></Input>
            </div>
            <div className="pt-[2%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Nowe hasło</p>
              <Input
                type="Hasło"
                action="login"
                val={password}
                onChange={setPassword}
              ></Input>
            </div>
            <div className="pt-[2%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Twój kod</p>
              <Input
                type="Kod dostępu"
                action="login"
                val={code}
                onChange={setCode}
              ></Input>
            </div>
            <div className="pt-[7%] flex flex-col">
              <ButtonEditNote
                height="45px"
                width="55%"
                content={"Resetuj hasło"}
                action={() => handleReset(code, password)}
              ></ButtonEditNote>
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

export default ForgotPassword;
