import { Link } from "react-router-dom";
import LoginNav from "./LoginNav";

const Nav = ({ withLogin }: { withLogin: boolean }) => {
  return (
    <nav className="flex pl-[1%] justify-between items-center w-full h-[50px]">
      <div className="flex ml-[1%] h-full items-center gap-[4px]">
        <p className="font-primary -mr-[4px] text-[27px] font-bold text-[#000000] ">
          <Link to={"/dashboard"}>baserry</Link>
        </p>
        <p className="font-primary  text-[18px] pt-[4px] font-extrabold text-linear-color-purple ">
          AI
        </p>
      </div>
      <div className="flex h-full items-center">
        {withLogin && <LoginNav></LoginNav>}
      </div>
    </nav>
  );
};

export default Nav;
