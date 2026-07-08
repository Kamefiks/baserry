import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  type?: string;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  visibilityChildren?: boolean;
}

export function SidebarItem({
  icon,
  type,
  label,
  href,
  isActive,
  onClick,
  children,
  visibilityChildren,
}: SidebarItemProps) {
  return (
    <>
      <Link
        to={href ?? "/"}
        onClick={onClick && onClick}
        className={`flex hover:bg-white justify-between pl-[5px] pr-1 items-center gap-[9px]  text-[13px] font-normal transition-colors hover:text-gray-900 ${
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
        }`}
      >
        <div className="flex gap-2">
          <div className=" text-gray-500">{icon}</div>
          <span>{label}</span>
        </div>
        {type === "list" && (
          <ChevronDown
            size={19}
            strokeWidth={1.2}
            className={`${visibilityChildren ? "rotate-180" : "rotate-0"}`}
          ></ChevronDown>
        )}
      </Link>
      <div
        className={`${
          visibilityChildren
            ? "flex flex-col pl-[12%] pb-[10px] pt-[3px] text-[13px]"
            : "hidden"
        }`}
      >
        {children}
      </div>
    </>
  );
}
