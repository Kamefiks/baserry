import {
  Cuboid,
  List,
  Settings,
  Table,
  History,
  FileSpreadsheet,
  Paperclip,
  Eye,
  Edit2,
  X,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { useEffect, useState } from "react";
import useCustomTablesData from "@/hooks/useCustomTableData";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import UserPanel from "./UserPanel";
import * as XLSX from "xlsx";

interface visibilities {
  export: boolean;
  import: boolean;
  share: boolean;
}

interface HistoryItem {
  id: string;
  prompt: string;
  interpretation: string;
  created_at: string;
}

const SideBar = ({}) => {
  const { setSelected, user } = useApp();
  const navigate = useNavigate();

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const refreshTables = async () => {
    const { data: tablesData, error: _tablesErr } = await supabase
      .from("custom_tables")
      .select("id, name")
      .eq("user_id", user?.id);

    if (tablesData) {
      const newTableIds = tablesData.map((data) => data.id);
      setTableID(newTableIds);
    }

    return tablesData;
  };

  useEffect(() => {
    if (user?.id) {
      refreshTables();
    }
  }, [user?.id]);

  const [tableID, setTableID] = useState<string[]>([]);
  const { tablesData, refetch } = useCustomTablesData(tableID, 10000);
  const [visibilityChildren, setVisibilityChildren] = useState<visibilities>({
    export: false,
    import: false,
    share: false,
  });
  useEffect(() => {
    const handleTablesChanged = () => {
      refetch();
    };
    window.addEventListener("tables-changed", handleTablesChanged);
    return () =>
      window.removeEventListener("tables-changed", handleTablesChanged);
  }, [refetch]);

  const handleOpenHistory = async () => {
    setHistoryModalOpen(true);
    setHistoryLoading(true);

    const { data, error } = await supabase
      .from("command_history")
      .select("id, prompt, interpretation, created_at")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setHistoryItems(data);
    }
    setHistoryLoading(false);
  };

  const handleExportToExcel = async (tableName: string) => {
    const table = tablesData.find((t) => t.name === tableName);
    if (!table) return;

    const { data: rows, error } = await supabase
      .from("custom_rows")
      .select("data")
      .eq("table_id", table.id);

    if (error || !rows || rows.length === 0) {
      alert("Brak danych do eksportu.");
      return;
    }

    const flatData = rows.map((row) => row.data);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

    XLSX.writeFile(workbook, `${tableName}.xlsx`);
  };

  return (
    <div className="w-[22%]  relative mt-[3%]  items-center justify-center flex flex-col">
      <div className="w-full h-[1px] mt-[12%] linear-stroke-gray"></div>
      <div className="flex w-full gap-2 h-full mt-[5%] flex-col">
        <SidebarSection title="TWÓJ ZASÓB DANYCH" icon={<Cuboid size={20} />}>
          {[...new Set(tablesData.map((t) => t.name))].map((name) => (
            <div key={name} className="flex justify-between items-center">
              <SidebarItem
                icon={<Table strokeWidth={1.5} size={20} />}
                label={`Tabela ${name}`}
                href={``}
                onClick={() => setSelected(name)}
                isActive={location.pathname === "/tabela-zlecenia"}
              />
              <span className="flex relative items-center gap-2 border-[1px] px-[5px] py-[2px] rounded-[7px] border-[#e3e3e3] bg-[#ffffff] mr-2">
                <Edit2
                  size={18}
                  strokeWidth={1.5}
                  className="cursor-pointer "
                  color="#67696c"
                  onClick={() => {
                    setSelected(name);
                    navigate(`/dashboard/edit/${name}`);
                  }}
                ></Edit2>
                <div className="w-[1px] absolute flex left-[50%] right-[50%] h-full bg-[#e3e3e3]"></div>
                <Eye
                  size={18}
                  strokeWidth={1.5}
                  className="cursor-pointer"
                  color="#777a7c"
                  onClick={() => {
                    setSelected(name);
                    navigate(`/dashboard/view/${name}`);
                  }}
                ></Eye>
              </span>
            </div>
          ))}
        </SidebarSection>

        <SidebarSection title="OGÓLNE" icon={<List size={20} />}>
          <div
            onClick={handleOpenHistory}
            className="flex hover:bg-white justify-between pl-[5px] pr-1 items-center gap-[9px] text-[13px] font-normal transition-colors hover:text-gray-900 text-gray-700 cursor-pointer"
          >
            <div className="flex gap-2">
              <div className="text-gray-500">
                <History size={20} strokeWidth={1.5} />
              </div>
              <span>Historia poleceń</span>
            </div>
          </div>
        </SidebarSection>

        <SidebarSection title="ZARZĄDZANIE" icon={<Settings size={20} />}>
          <SidebarItem
            icon={<FileSpreadsheet size={20} strokeWidth={1.5} />}
            label="Eksportuj do arkusza"
            href=""
            onClick={() =>
              setVisibilityChildren((cur) => ({ ...cur, export: !cur.export }))
            }
            visibilityChildren={visibilityChildren.export}
            isActive={location.pathname === "/eksportuj"}
            type="list"
          >
            <div>
              {[...new Set(tablesData.map((t) => t.name))].map((name) => (
                <div
                  key={name}
                  onClick={() => handleExportToExcel(name)}
                  className="flex hover:bg-white gap-2 cursor-pointer items-center text-[#4a4a4a]"
                >
                  <span>
                    <Table strokeWidth={1.5} color="#535759" size={17} />
                  </span>
                  Tabela {name}
                </div>
              ))}
            </div>
          </SidebarItem>

          <div className="flex hover:bg-white justify-between pl-[5px] pr-1 items-center gap-[9px] text-[13px] font-normal text-gray-400 cursor-not-allowed opacity-60">
            <div className="flex gap-2">
              <div className="text-gray-400">
                <Paperclip size={20} strokeWidth={1.5} />
              </div>
              <span>Udostępnij dane</span>
            </div>
            <span className="text-[10px] italic">pełna wersja</span>
          </div>
        </SidebarSection>

        <UserPanel></UserPanel>
      </div>

      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setHistoryModalOpen(false)}
          />
          <div className="relative z-10 w-[90%] max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111111]">
                Historia poleceń
              </h3>
              <button onClick={() => setHistoryModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {historyLoading ? (
                <p className="text-sm text-gray-400">Ładowanie...</p>
              ) : historyItems.length === 0 ? (
                <p className="text-sm text-gray-400">Brak historii poleceń.</p>
              ) : (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 p-3 text-sm"
                  >
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">Prompt:</span>{" "}
                      {item.prompt}
                    </p>
                    <p className="mt-1 text-gray-500">
                      <span className="font-medium text-gray-700">
                        Interpretacja:
                      </span>{" "}
                      {item.interpretation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
