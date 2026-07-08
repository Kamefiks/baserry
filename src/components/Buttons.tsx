import { supabase } from "@/lib/supabase";
import {
  Eye,
  FileSpreadsheet,
  Import,
  Mic,
  Paperclip,
  Pen,
  Plus,
  Undo2,
} from "lucide-react";

export const ButtonEditTable = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-[140px] mt-[2%] ml-[15px] cursor-pointer gap-[10px] rounded-[21px] flex items-center pl-[2%] h-[40px] bg-[#F9F9F9] border-[1px] border-[#D8D8D8]"
    >
      <span>
        <Pen color="#C5C5C5"></Pen>
      </span>
      <p className="font-secondary font-normal text-[20px] text-[#C5C5C5]">
        Edytuj
      </p>
    </button>
  );
};

export const ButtonViewTable = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-[140px] mt-[2%] mr-[15px] cursor-pointer gap-[10px] rounded-[21px] flex items-center pl-[2%] h-[40px] bg-[#F9F9F9] border-[1px] border-[#D8D8D8]"
    >
      <span>
        <Eye color="#C5C5C5"></Eye>
      </span>
      <p className="font-secondary font-normal text-[20px] text-[#C5C5C5]">
        Podejrzyj
      </p>
    </button>
  );
};

interface ButtonAddProps {
  tableId: string;
  userId: string | undefined;
  addDataVal: Record<string, string | number>;
  refreshTables: () => Promise<{ id: string; name: string }[] | null>;
  onSuccess?: () => void;
}

export const ButtonAddRecord = ({
  tableId,
  userId,
  addDataVal,
  refreshTables,
  onSuccess,
}: ButtonAddProps) => {
  const handleAdd = async () => {
    if (!tableId || !userId) {
      console.warn("Brak tableId lub userId — nie można dodać rekordu.");
      return;
    }

    try {
      const { error } = await supabase.from("custom_rows").insert({
        table_id: tableId,
        user_id: userId,
        data: addDataVal,
      });

      if (error) {
        console.error("Błąd podczas dodawania rekordu:", error);
        return;
      }

      await refreshTables();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      title="Dodaj rekord"
      style={{
        boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.507)",
      }}
      className="  py-[1px] px-[1px] justify-center border-[#000000] border-[1px] cursor-pointer rounded-[5px] flex items-center h-[80%] bg-[#262626] "
    >
      <button
        data-tooltip-id="command-tooltip"
        data-tooltip-place="top"
        onClick={handleAdd}
        style={{
          boxShadow: "inset 0 5px 8px rgba(255, 255, 255, 0.356)",
        }}
        className="w-[100%] px-[4px] justify-center active:bg-[#fefefe] cursor-pointer gap-[15px] rounded-[5px] flex items-center h-[100%] duration-150 transition-all hover:bg-[#310138] bg-[#000000] "
      >
        <Plus size={14} className="text-white"></Plus>
      </button>
    </button>
  );
};

export const ButtonImportTable = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      title="Insert data to table"
      className="w-[30px] hover:rotate-3  group cursor-pointer hover:border-[#000000] hover:border-[1px] hover:scale-105 duration-100  rounded-[5px] justify-center flex items-center h-[70%] bg-[#F9F9F9] border-[1px] border-[#D8D8D8]"
    >
      <span title="Insert data to table">
        <Import
          className="pointer-events-none duration-100 text-[#C5C5C5] group-hover:text-[#000000]"
          size={18}
        ></Import>
      </span>
    </button>
  );
};

export const ButtonExportExcel = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      title="Eksport do arkusza"
      className="w-[30px] group hover:-rotate-12 cursor-pointer hover:border-[#1c821a] hover:border-[1px] hover:scale-105 duration-100  rounded-[5px] justify-center flex items-center h-[70%] bg-[#F9F9F9] border-[1px] border-[#D8D8D8]"
    >
      <span title="Eksport do arkusza">
        <FileSpreadsheet
          className="pointer-events-none duration-100 text-[#C5C5C5] group-hover:text-[#1c821a]"
          size={18}
        ></FileSpreadsheet>
      </span>
    </button>
  );
};

export const ButtonRevertChanges = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      title="Cofnij niezapisane zmiany"
      className="w-[30px] active:border-[#303030] group cursor-pointer hover:border-[#525252] hover:border-[1px] hover:scale-105 duration-100  rounded-[5px] justify-center flex items-center h-[70%] bg-[#F9F9F9] border-[1px] border-[#D8D8D8]"
    >
      <span title="Cofnij niezapisane zmiany">
        <Undo2
          className="pointer-events-none duration-100 text-[#C5C5C5] group-hover:text-[#424242] group-active:text-[#262626]"
          size={18}
        ></Undo2>
      </span>
    </button>
  );
};

export const ButtonShare = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      title="Share with others"
      className="w-[30px]  group cursor-pointer hover:rotate-12 hover:border-[#1568c6] hover:scale-105 duration-100  rounded-[5px] justify-center flex items-center h-[70%] bg-[#F9F9F9] border-[1px] border-[#D8D8D8]"
    >
      <span title="Share with others">
        <Paperclip
          className="pointer-events-none group-hover:text-[#1568c6] text-[#C5C5C5]"
          size={18}
        ></Paperclip>
      </span>
    </button>
  );
};

export const ButtonTalk = () => {
  return (
    <button
      style={{
        boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.507)",
      }}
      className="w-[20%]  py-[1px] px-[1px] border-[#000000] border-[1px]  mr-[15px] cursor-pointer gap-[15px] rounded-[12px] flex items-center h-[44px] bg-[#262626] "
    >
      <button
        style={{
          boxShadow: "inset 0 5px 8px rgba(255, 255, 255, 0.356)",
        }}
        className="w-[100%]   cursor-pointer gap-[15px] rounded-[12px] flex items-center pl-[10px] h-[100%] bg-[#000000] "
      >
        <span>
          <Mic color="#ffffff"></Mic>
        </span>
        <p className="font-secondary font-normal text-[15px] text-[#ffffff]">
          Rozmawiaj z botem
        </p>
      </button>
    </button>
  );
};
