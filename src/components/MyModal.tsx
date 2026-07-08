import { ReactElement } from "react";

const MyModal = ({
  children,
  modalOpen,
}: {
  children: ReactElement;
  modalOpen: boolean;
}) => {
  return (
    <div
      className={`${
        modalOpen ? "flex" : "invisible pointer-events-none"
      } z-50 w-[100%] justify-center items-center top-0 absolute h-full bg-[#30303038]`}
    >
      <div className="flex shadow-2xl border-[#c3c3c3] w-[33%] h-[55%] py-1 flex-col px-1 bg-[#fefefe] border-[1px] rounded-2xl">
        {children}
      </div>
    </div>
  );
};

export default MyModal;
