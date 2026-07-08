import { useApp } from "@/contexts/AppContext";

import InteractionMenuBtn from "./InteractionMenuBtn";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useCustomTablesData from "@/hooks/useCustomTableData";
import { ValEdit } from "./PageDatabase";
interface InteractionMenuProps {
  valEdit: ValEdit[];
  mode?: string;
  refreshTables?: () => Promise<{ id: string; name: string }[] | null>;
  generateSystemPrompt?: ({
    tablesID,
    tablesNames,
    datasColumn,
  }: {
    tablesID: string[];
    tablesNames: string[];
    datasColumn: any;
  }) => string;
  colored: string[];
  setColored: (value: string[] | ((prev: string[]) => string[])) => void;
}
const InteractionMenu = ({
  valEdit,
  mode,
  refreshTables,
  colored,
  setColored,
}: InteractionMenuProps) => {
  const { setSelected, selected, user } = useApp();
  const [tableID, setTableID] = useState<string[]>([""]);

  useEffect(() => {
    const fetchTables = async () => {
      const { data: tablesData, error: _tablesErr } = await supabase
        .from("custom_tables")
        .select("id")
        .eq("user_id", user?.id);

      tablesData?.map((data) => {
        if (data) {
          // setNodes((nds: TableNode[]) =>
          //   nds.map((node) => {
          //     return {
          //       ...node,
          //       data: { TableName: name },
          //     };
          //   })
          // );
          setTableID((prev) => [...prev, data.id]);
        }
      });
    };
    fetchTables();
  }, [user?.id]);

  const { tablesData } = useCustomTablesData(tableID, 100000);

  return (
    <div className="w-[20%] border-t-[1px] border-b-[1px] border-[#E5E5E5] flex h-full">
      <div className="w-full items-center flex h-[40px]">
        {selected === null ? (
          <p className="text-[16px] pl-[10px] text-[#C5C5C5]">
            Nic nie zaznaczono
          </p>
        ) : (
          <div className="flex w-full h-full pt-[10px] pl-[10px] flex-col">
            <div className="flex w-full gap-[10px]">
              <p className="text-[16px]  text-[#000000]">Wybrano: </p>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="border-[1px] pr-[10px] border-[#e5e5e5] rounded-[5px]"
              >
                {[...new Set(tablesData.map((t) => t.name))].map((name) => (
                  <option>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex w-full pt-[24px] pb-[10px] gap-[10px]">
              <p className="text-[14px] font-medium font-secondary">
                Liczba danych:{" "}
              </p>
              <p className="text-[14px] font-bold font-secondary">
                {tablesData.find((t) => t.name === selected)?.rows.length ?? 0}
              </p>
            </div>
            {/* <div className="w-[84%] rounded-[17px] py-[3px] pl-[5px] flex border-[1px] border-[#e5e5e5]">
              <Search color="#B2B2B2" size={24}></Search>
              <input
                type="text"
                placeholder={`Wpisz aby wyszukać`}
                className="w-[100%]  outline-none pl-[5px] text-[14px]  flex "
              />
            </div> */}
            <div className="w-[87%] flex-col gap-[6px]  flex pt-[20%]">
              {mode === "noaction" && (
                <>
                  {" "}
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="eye"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="captions"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="pen"
                  ></InteractionMenuBtn>
                  {/* <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="structure"
                  ></InteractionMenuBtn> */}
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="bin"
                  ></InteractionMenuBtn>
                </>
              )}
              {mode === "edit" && (
                <>
                  {" "}
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="save"
                    setColored={setColored}
                    colored={colored}
                    valEdit={valEdit}
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="eye"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="captions"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="pen"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="bin"
                  ></InteractionMenuBtn>
                </>
              )}
              {mode === "view" && (
                <>
                  {" "}
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="eye"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="captions"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="pen"
                  ></InteractionMenuBtn>
                  <InteractionMenuBtn
                    refreshTables={refreshTables}
                    selectedIcon="bin"
                  ></InteractionMenuBtn>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionMenu;
