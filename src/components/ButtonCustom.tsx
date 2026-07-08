import { motion } from "framer-motion";

import { ReactElement } from "react";

const ButtonEditNote = ({
  content,
  action,
  width,
  height,
  children,
}: {
  content?: string | ReactElement;
  action: (hash?: string, newPassword?: string) => void;
  width: string;
  height: string;
  children?: ReactElement;
}) => {
  return (
    <motion.div
      onClick={() => action()}
      style={{ width: `${width}`, height: `${height}` }}
      className="bg-[#000000] border-[0.5px] cursor-pointer border-white rounded-[15px] relative items-end flex "
    >
      <motion.div
        animate={{ backgroundColor: ["#ff008c", "#0059ff", "#00aeff"] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="bg-[#E121FF] rounded-[50%] ml-[3px] mb-[10px] w-[20%] flex h-[20px]"
      ></motion.div>
      <motion.div
        className="bg-[#000000] absolute rounded-[50%] ml-[3px] w-[20%] flex h-[20px]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      <motion.div
        animate={{ backgroundColor: ["#ff008c", "#0059ff", "#00d9ff"] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
        className="bg-[#7A20A7] rounded-[50%] ml-[5%] w-[30%] flex h-[15px]"
      ></motion.div>
      <motion.div
        className="bg-[#000000] absolute rounded-[50%] ml-[25%] w-[30%] flex h-[35px]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      <motion.div
        animate={{ backgroundColor: ["#ff008c", "#0059ff", "#00e1ff"] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        className="bg-[#FF6BD0] rounded-[50%] ml-[2%] mb-[2%] w-[20%] flex h-[15px]"
      ></motion.div>
      <motion.div
        className="bg-[#000000] absolute rounded-[50%] ml-[45%] w-[20%] flex h-[35px]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      <motion.div
        animate={{ backgroundColor: ["#ff008c", "#0059ff", "#00e1ff"] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
        className="bg-[#BA6BFF] rounded-[50%] w-[20%] mb-[10px] flex h-[20px]"
      ></motion.div>
      <motion.div
        className="bg-[#000000] absolute rounded-[50%] ml-[65%] w-[20%] flex h-[35px]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      <div className="bg-[#01010100] justify-center  rounded-[15px] items-center absolute backdrop-blur-[20px] h-full flex w-full">
        <p className="text-white font-primary">
          {content ? content : children}
        </p>
      </div>
    </motion.div>
  );
};

export default ButtonEditNote;
