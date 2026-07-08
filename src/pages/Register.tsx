import ButtonEditNote from "@/components/ButtonCustom";
import Input from "@/components/Input";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  function generateRecoveryCode() {
    const randomPart = () => Math.floor(1000 + Math.random() * 9000);
    return `${randomPart()}_${randomPart()}`;
  }

  const recoveryCode = generateRecoveryCode();

  const handleRegister = async () => {
    console.log("clicked");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name,
          recovery_code: recoveryCode,
        },
      },
    });

    if (error) {
      const response = error.status;
      if (response == 422)
        setMsg("Hasło powinno składać się z przynajmniej 6 znaków.");
      else if (response == 400) setMsg("Email jest nieprawidłowy.");
      console.log(error.message);
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="w-full h-full flex-col flex  ">
      <div className="w-full flex h-full">
        <div className="flex sm:w-[65%] w-[100%] h-full flex-col">
          <Nav withLogin={false}></Nav>
          <div className="pl-[7%] pt-[5%] h-full flex-col flex w-full">
            <p className="font-primary text-[53px] font-bold">
              Witaj w Baserry,
            </p>
            <p className="font-secondary pt-[1%] text-[17px] font-regular text-[#5D5D5D]">
              Masz już konto?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-[#141414] cursor-pointer"
              >
                Zaloguj się
              </span>
            </p>
            <div className="pt-[9%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Nazwa</p>
              <Input
                type="Nazwa"
                action="register"
                val={name}
                onChange={setName}
              ></Input>
            </div>
            <div className="pt-[2%] flex flex-col">
              <p className="text-[16px] pb-[5px]">Email</p>
              <Input
                type="Email"
                action="register"
                val={email}
                onChange={setEmail}
              ></Input>
            </div>
            <div className="flex sm:w-[55%] w-[100%] gap-[3%]">
              <div className="pt-[2%] w-full flex flex-col">
                <p className="text-[16px] pb-[5px]">Hasło</p>
                <Input
                  type="Hasło"
                  action="register"
                  onChange={setPassword}
                  val={password}
                ></Input>
              </div>
              <div className="pt-[2%] w-full flex flex-col">
                <p className="text-[16px] pb-[5px]">Powtórz hasło</p>
                <Input
                  type="Hasło"
                  action="register"
                  onChange={setPassword2}
                  val={password2}
                ></Input>
              </div>
            </div>

            <div className="pt-[7%] flex flex-col">
              <ButtonEditNote
                height="45px"
                width="55%"
                content={"Zajerestruj się"}
                action={handleRegister}
              ></ButtonEditNote>
            </div>
            <div className="flex w-[55%] pt-3 justify-center">
              <p
                className={`${msg == "Hasło powinno składać się z przynajmniej 6 znaków." || msg == "Email jest nieprawidłowy." ? "text-[#611414]" : "text-[#222222]"}`}
              >
                {msg}
              </p>
            </div>
          </div>
        </div>

        <div className="w-[45%] sm:visible invisible hidden max-h-screen min-h-screen sm:flex flex-col">
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

export default Register;
