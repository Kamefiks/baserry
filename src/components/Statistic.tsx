const Statistic = ({
  type,
  percent,
  tradeOn,
}: {
  type: string;
  percent?: number;
  tradeOn?: string;
}) => {
  if (type === "TradeOn") {
    return (
      <div className="flex w-full mt-[2%] pl-[4%] flex-col">
        <p className="text-[15px] font-secondary font-light text-[#151515]">
          {type === "TradeOn" && "Trades on:"}
        </p>
        <div className="flex w-full mt-[2%] items-center gap-[5%]">
          <div className="flex w-[30%] justify-center rounded-full h-[20px] bg-[#DBDBDB]">
            <p className="text-[#797272] font-primary font-medium text-[14px]">
              {tradeOn}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full pl-[4%] flex-col">
      <p className="text-[15px] font-secondary font-light text-[#151515]">
        {type}
      </p>
      <div className="flex w-full items-center gap-[5%]">
        <div className="flex w-[80%]  rounded-full h-[8px] bg-[#DBDBDB]">
          <div
            style={{ width: `${percent}%` }}
            className={`flex rounded-full h-[8px] bg-[#262424]`}
          ></div>
        </div>
        <p className="text-[#797272] font-primary font-medium text-[14px]">
          {percent}
        </p>
      </div>
    </div>
  );
};

export default Statistic;
