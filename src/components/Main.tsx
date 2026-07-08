import { animate, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-col relative h-full flex">
      <div className="absolute z-10 w-full h-[98.5%] bg-[#ffffff0f] backdrop-blur-[50px]"></div>
      <div className="relative z-20 w-full flex-col text-center items-center flex mt-[12%]">
        <p className="text-[54px] font-primary font-bold">
          Zarządzanie danymi, bez chaosu.
        </p>
        <p className="text-[24px] leading-6 mt-[2%] font-secondary font-light">
          Działania na bazie danych za pomocą prostych poleceń.
        </p>
        <p className="text-[24px] font-secondary font-light">
          Z nami, wszystko jest dla Twojej wygody.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ width: "200px" }}
          onClick={() => navigate("/dashboard")}
          style={{
            boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.4)",
          }}
          className="w-[150px] rounded-[20px] cursor-pointer mt-[3%] justify-center items-center text-white font-secondary font-light flex h-[40px] bg-black"
        >
          Rozpocznij
        </motion.button>
      </div>
      <div className="w-screen h-[35px] mt-[15%] flex-1 flex">
        <img src="/Gradient.webp" className="h-[35px] w-full flex"></img>
      </div>
      <div className="flex w-full relative bg-[#000000]"></div>
    </div>
  );
};

export default Main;
