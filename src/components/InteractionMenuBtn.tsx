import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import { Captions, Columns3Cog, Eye, Pen, Save, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ValEdit } from "./PageDatabase";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface InteractionMenuBtnProps {
  valEdit?: ValEdit[];
  refreshTables?: () => Promise<{ id: string; name: string }[] | null>;
  selectedIcon: string;
  colored?: string[];
  setColored?: (value: string[] | ((prev: string[]) => string[])) => void;
}

const InteractionMenuBtn = ({
  valEdit,
  refreshTables,
  selectedIcon,
  setColored,
}: InteractionMenuBtnProps) => {
  const navigate = useNavigate();
  const { selected, user } = useApp();
  const [saving, setSaving] = useState(false);

  const icons: Record<string, ReactNode> = {
    eye: <Eye color="#878787" size={21}></Eye>,
    captions: <Captions color="#878787" size={21}></Captions>,
    pen: <Pen color="#878787" size={21}></Pen>,
    structure: <Columns3Cog color="#878787" size={21}></Columns3Cog>,
    bin: <Trash2 color="#B45050" size={21}></Trash2>,
    save: (
      <Save
        className="group-hover:text-[#ffffff] duration-500 text-[#ffffff]"
        size={21}
      ></Save>
    ),
  };

  const names: Record<string, ReactNode> = {
    eye: "Podejrzyj dane",
    captions: "Zmień nazwę",
    pen: "Edytuj dane",
    structure: "Edytuj strukturę",
    bin: "Usuń tabelę",
    save: "Zapisz",
  };

  const handleSave = async () => {
    if (!valEdit || valEdit.length === 0) return;

    setSaving(true);

    const changesByRow = valEdit.reduce(
      (acc, edit) => {
        const rowId = edit.rowId?.toString() ?? "";
        if (!acc[rowId]) acc[rowId] = {};
        acc[rowId][edit.name] = edit.value;
        return acc;
      },
      {} as Record<string, Record<string, string>>,
    );

    try {
      for (const [rowId, changes] of Object.entries(changesByRow)) {
        const { data: currentTable } = await supabase
          .from("custom_tables")
          .select("id")
          .eq("name", selected)
          .eq("user_id", user?.id)
          .single();

        if (!currentTable) continue;

        const { data: existingRows } = await supabase
          .from("custom_rows")
          .select("id, data")
          .eq("table_id", currentTable.id);

        const targetRow = existingRows?.find((r) => r.id === rowId);
        if (!targetRow) continue;

        const mergedData = { ...targetRow.data, ...changes };

        await supabase
          .from("custom_rows")
          .update({ data: mergedData })
          .eq("id", targetRow.id);
      }

      if (refreshTables) await refreshTables();
      if (setColored) setColored([""]);
    } catch (error) {
      console.error("Błąd podczas zapisywania:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTable = async () => {
    if (!selected) return;
    if (
      !confirm(
        `Czy na pewno chcesz usunąć tabelę "${selected}"? Tej operacji nie można cofnąć.`,
      )
    ) {
      return;
    }

    try {
      const { data: currentTable } = await supabase
        .from("custom_tables")
        .select("id")
        .eq("name", selected)
        .eq("user_id", user?.id)
        .single();

      if (!currentTable) return;

      await supabase
        .from("custom_rows")
        .delete()
        .eq("table_id", currentTable.id);
      await supabase
        .from("custom_columns")
        .delete()
        .eq("table_id", currentTable.id);
      await supabase.from("custom_tables").delete().eq("id", currentTable.id);

      if (refreshTables) await refreshTables();
    } catch (error) {
      console.error("Błąd podczas usuwania tabeli:", error);
    }
  };

  return (
    <button
      style={{
        boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.507)",
      }}
      className={`${
        selectedIcon == "save" ? "w-[58%]" : "w-[100%]"
      }  py-[1px] px-[1px] ${
        selectedIcon == "save" &&
        "border-[#000000] bg-[#262626] border-[1px] mr-[15px] cursor-pointer gap-[15px] rounded-[7px] flex items-center h-[44px] "
      }   `}
    >
      <button
        onClick={async (e) => {
          e.stopPropagation();

          if (selectedIcon === "eye") {
            navigate(`/dashboard/view/${selected}`);
          }
          if (selectedIcon === "pen") {
            navigate(`/dashboard/edit/${selected}`);
          }

          if (selectedIcon === "save") {
            await handleSave();
          }

          if (selectedIcon === "bin") {
            await handleDeleteTable();
          }
          if (selectedIcon === "captions") {
            const newName = prompt(
              `Nowa nazwa dla tabeli "${selected}":`,
              selected ?? "",
            );
            if (newName && newName.trim() && newName !== selected) {
              const { data: currentTable } = await supabase
                .from("custom_tables")
                .select("id")
                .eq("name", selected)
                .eq("user_id", user?.id)
                .single();

              if (currentTable) {
                await supabase
                  .from("custom_tables")
                  .update({ name: newName.trim() })
                  .eq("id", currentTable.id);
                if (refreshTables) await refreshTables();
              }
            }
          }
        }}
        style={{
          boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.507)",
        }}
        className={`w-full ${
          selectedIcon !== "save" && "border-[1px]"
        } group duration-500 cursor-pointer flex gap-[10px] text-[15px]  h-[40px] items-center pl-[8px]  ${
          selectedIcon === "bin"
            ? "bg-[#F7E8E8] hover:bg-[#f2cfcf] text-[#b45050]"
            : selectedIcon === "save"
              ? "bg-[#060606] hover:bg-[#000000]  hover:text-[#ffffff] text-[#ffffff]"
              : "bg-[#f8f8f8]  hover:bg-[#f0f0f0] text-[#878787]"
        } rounded-[5px]`}
      >
        {selectedIcon === "save" && saving ? (
          <Loader2 size={21} className="animate-spin" />
        ) : (
          icons[selectedIcon]
        )}
        {selectedIcon === "save" && saving ? "Czekaj" : names[selectedIcon]}
      </button>
    </button>
  );
};

export default InteractionMenuBtn;
