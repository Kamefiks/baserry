import { Mic, Pen } from "lucide-react";
import ActivityLabel from "./ActivityLabel";
import Statistic from "./Statistic";

const TraderStats = () => {
  return (
    <div className="w-[25%] rounded-[12px] flex-col flex h-[400px] border-[1px] border-[#C8C8C8]">
      <div className="w-full items-center justify-between pl-[4%] pr-[2%] flex  h-[15%]">
        <div className="flex w-full gap-[4%] items-center">
          <Pen size={20}></Pen>
          <input
            type="text"
            className="font-secondary text-[20px] w-[40%] outline-0"
            value={"John"}
          />
        </div>

        <ActivityLabel></ActivityLabel>
      </div>
      <div className="w-full h-[1px] linear-stroke-gray"></div>
      <div className="flex flex-col w-full h-full pt-[10%] gap-[2%]">
        <Statistic type="Risk tolerance" percent={40} />
        <Statistic type="Aggression" percent={60} />
        <Statistic type="Patience" percent={83} />
        <Statistic type="TradeOn" tradeOn={"USD/JPY"} />
      </div>
      <div className="w-full h-[1px] linear-stroke-gray"></div>
      <div className="flex w-full mt-[4%] pb-[4%] justify-end pr-[2%] gap-[2%] items-center">
        <button className="border-black border-[2px] w-[30%] h-[45px] rounded-[13px]">
          <p className="font-primary font-medium">Edit</p>
        </button>
        <button className="bg-[#000000] gap-[10px] flex justify-center items-center text-white w-[50%] h-[45px] rounded-[13px]">
          <Mic size={21} className="text-white"></Mic>
          <p className="font-primary font-medium">Talk to bot</p>
        </button>
      </div>
    </div>
  );
};

export default TraderStats;
