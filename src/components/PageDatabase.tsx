import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  Node as RFNode,
  Edge,
} from "reactflow";

import { useCallback, useEffect, useState } from "react";
import DataTable from "./DataTable";
import { useApp } from "@/contexts/AppContext";
import InteractionMenu from "./InteractionMenu";
import {
  ButtonAddRecord,
  ButtonExportExcel,
  ButtonRevertChanges,
} from "./Buttons";
import CommandBox from "./CommandBox";
import useCustomTableData from "@/hooks/useCustomTableData";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewNode from "./ViewNode";

interface TableData {
  TableName: string;
  columns: any[];
  rows: any[];
  __refreshToken: Date;
}
export interface ViewNodeData {
  title: string;
  rows: { id: string; data: Record<string, any> }[];
  columns?: any[];
  __refreshToken?: Date;
  onDelete: () => void;
}
export interface ValEdit {
  id: any;
  name: string;
  value: string;
  rowId?: string | number;
}

const nodeTypes = {
  custom: DataTable,
  view: ViewNode,
};
export type ViewNodeType = RFNode<ViewNodeData>;
export type TableNode = RFNode<TableData>;

export type NodeDataUnion = TableData | ViewNodeData;

export const initialNodes: RFNode<NodeDataUnion>[] = [
  {
    id: "1",
    position: { x: 100, y: -100 },
    type: "custom",
    data: { TableName: "", columns: [], rows: [], __refreshToken: new Date() },
  },
  {
    id: "2",
    position: { x: -100, y: 100 },
    type: "custom",
    data: { TableName: "", columns: [], rows: [], __refreshToken: new Date() },
  },
];

export interface CheckBoxes {
  id: number;
  value: boolean;
}

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    sourceHandle: "bottom",
    target: "2",
    targetHandle: "top",
  },
];
import * as XLSX from "xlsx";

const PageDatabase = ({ mode }: { mode: string }) => {
  const [tableID, setTableID] = useState<string[]>([]);

  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
  const [checkBoxes, setCheckBoxes] = useState<CheckBoxes[]>([]);
  const [addDataVal, setAddDataVal] = useState<Record<string, string | number>>(
    {},
  );

  const [nodes, setNodes, onNodesChange] =
    useNodesState<NodeDataUnion>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [filterVal, setFilterVal] = useState<string>("");
  const { setSelected, user, selected } = useApp();
  const [valEdit, setValEdit] = useState<ValEdit[]>([]);
  const [colored, setColored] = useState([""]);

  const [_, setLastSavedData] = useState<TableData[] | any>([]);

  const navigate = useNavigate();

  const addViewNode = (
    title: string,
    rows: { id: string; data: Record<string, any> }[],
  ) => {
    const nodeId = `view-${Date.now()}`;
    const newNode: ViewNodeType = {
      id: nodeId,
      type: "view",
      position: { x: 500, y: 400 },
      data: {
        title,
        rows,
        onDelete: () => setNodes((n) => n.filter((node) => node.id !== nodeId)),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };
  const refreshTables = async () => {
    const { data: tablesData, error: _ } = await supabase
      .from("custom_tables")
      .select("id, name")
      .eq("user_id", user?.id);

    if (tablesData) {
      const newTableIds = tablesData.map((data) => data.id);
      setTableID(newTableIds);
      setLastSavedData(tablesData);
    }

    return tablesData;
  };

  useEffect(() => {
    if (user?.id) {
      refreshTables();
    }
  }, [user?.id]);
  useEffect(() => {}, [tableID]);

  const createLinkShare = () => {
    if (selected) {
      console.log(tablesData);
    }
  };

  useEffect(() => {
    createLinkShare();
  }, [tableID]);

  const { tablesData, loading } = useCustomTableData(tableID, 10000);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (tablesData.length > 0) {
      const newNodes: TableNode[] = tablesData.map((table, idx) => ({
        id: table.id,
        position: { x: idx * 250, y: 100 },
        type: "custom",
        data: {
          TableName: table.name,
          columns: [...table.columns],
          rows: [...table.rows],
          __refreshToken: new Date(),
        },
      }));

      const newEdges = tablesData.flatMap((table) =>
        table.columns
          .filter((col: any) => col.references_table_id)
          .map((col: any) => ({
            id: `${table.id}-${col.id}-${col.references_table_id}`,
            source: table.id,
            target: col.references_table_id,
            label: col.name,
            animated: true,
          })),
      );

      setNodes([]);
      setNodes([...newNodes]);
      setEdges(newEdges);
    }
  }, [tablesData, loading, setNodes, filterVal]);

  useEffect(() => {
    setCheckBoxes((prev) =>
      tablesData.flatMap((table) =>
        table.rows.map((row, index) => {
          const existing = prev.find(
            (c) => c.id.toString() === (row.id?.toString() ?? index.toString()),
          );
          return {
            id: index,
            value: existing ? existing.value : false,
          };
        }),
      ),
    );
  }, [tablesData]);

  const handleExportToExcel = async () => {
    const currentTable = tablesData.find((t) => t.name === selected);
    if (!currentTable) return;

    const { data: rows, error } = await supabase
      .from("custom_rows")
      .select("data")
      .eq("table_id", currentTable.id);

    if (error || !rows || rows.length === 0) {
      alert("Brak danych do eksportu.");
      return;
    }

    const flatData = rows.map((row) => row.data);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentTable.name);

    XLSX.writeFile(workbook, `${currentTable.name}.xlsx`);
  };

  return (
    <div className="w-full rounded-[28px] bg-white flex flex-col">
      <p className="text-[32px] pl-[3%] pt-[2%] font-primary font-semibold">
        Oto Twoje dane, {user !== null && <span>{user.name}</span>}.
      </p>
      <p className="font-secondary pl-[3%] pt-[0.5%] text-[#444444] font-normal">
        Podejrzyj, zarządzaj i dodawaj, w parę kliknięć.
      </p>
      <div className="flex w-[100%] mt-[4%]">
        <div className="flex w-[80%] border-[1px] border-[#E5E5E5] h-[450px] overflow-hidden">
          {mode === "noaction" ? (
            <div className="flex h-[100%] w-[100%]">
              <ReactFlow
                key={
                  nodes.length +
                  JSON.stringify(nodes.map((n) => n.data.__refreshToken))
                }
                nodes={nodes}
                edges={edges}
                defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDrag={(_, node) => {
                  setSelected(node.data.TableName);
                }}
                fitView
                fitViewOptions={{ padding: 0.6 }}
                nodeTypes={nodeTypes}
              >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
              </ReactFlow>
            </div>
          ) : (
            <div className="max-w-[100%]  h-full overflow-x-auto overflow-y-auto block">
              <div className="w-full pt-[4px] items-center h-[2.8rem] pl-[0.2rem] flex ">
                <button
                  onClick={() => navigate(`/dashboard`)}
                  className="flex group hover:-translate-y-[1px] transition-all duration-200 hover:border-[#000000] cursor-pointer h-[70%] items-center pr-[5px] justify-center rounded-[5px] border-[1px] border-[#cccccc]"
                >
                  <ArrowLeft
                    className="text-[#a7a7a7] group-hover:text-[#000000] duration-500  cursor-pointer"
                    size={20}
                  ></ArrowLeft>
                  <p className="text-[12px] text-[#737373] group-hover:text-[#000000] duration-100 pl-[4px] font-medium cursor-pointer">
                    Powrót
                  </p>
                </button>

                <span className="pl-[1%] items-center h-full flex gap-[3px]">
                  <ButtonExportExcel
                    onClick={handleExportToExcel}
                  ></ButtonExportExcel>
                  <ButtonRevertChanges
                    onClick={() => {
                      setValEdit([]);
                      setColored([""]);
                    }}
                  ></ButtonRevertChanges>
                </span>

                <p className="text-[12px] text-[#5f5f5f] font-medium pl-[0.8rem]">
                  Tryb {mode === "edit" ? "edycji" : "podglądu"}:{" "}
                </p>
                <p className="text-[12px] text-[#000000] font-bold pl-[0.5rem]">
                  {selected}
                </p>

                <div className="w-[30%] min-w-[30%] rounded-[17px] py-[3px] ml-[1rem] pl-[5px] flex border-[1px] border-[#e5e5e5]">
                  <Search color="#B2B2B2" size={24}></Search>
                  <input
                    type="text"
                    value={filterVal}
                    onChange={(e) => setFilterVal(e.target.value)}
                    placeholder={`Wyszukaj...`}
                    className="w-[100%]  outline-none pl-[5px] text-[14px]  flex "
                  />
                </div>
              </div>
              <table className="border-collapse  overflow-x-auto min-w-full table-auto">
                <thead className="sticky top-0   bg-[#ebebeb62] backdrop-blur-[12px]">
                  <tr>
                    {tablesData.map(
                      (table, i) =>
                        table.name === selected &&
                        table.columns.map((col, ci) => (
                          <td
                            className={`pr-[5px] ${
                              ci === 0 && "pl-[7px]"
                            } text-[#818181]  uppercase py-[0.8%] border-b-[#c6c6c6] border-b-[1px] border-solid  text-[12px] font-bold text-left whitespace-nowrap`}
                            key={`${i}-${ci}`}
                          >
                            <div className="flex h-[100%] items-center">
                              <span className="pr-[5px] h-[100%]  flex items-center">
                                {ci === 0 && (
                                  <input
                                    disabled={mode === "view" && true}
                                    title={
                                      mode === "view"
                                        ? "Only possible in edit mode."
                                        : "Select all"
                                    }
                                    type="checkbox"
                                    className="pr-[5px]"
                                    checked={isCheckedAll}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setIsCheckedAll(checked);
                                      setCheckBoxes((prev) =>
                                        prev.map((checkbox) => ({
                                          ...checkbox,
                                          value: checked,
                                        })),
                                      );
                                    }}
                                  />
                                )}
                                {ci === 0 && (
                                  <div className="w-[1px] h-[100%] ml-[10px]  bg-[#dedede]"></div>
                                )}
                              </span>
                              {col.name}
                            </div>
                          </td>
                        )),
                    )}
                  </tr>
                </thead>

                {mode === "edit" ? (
                  <tbody>
                    {tablesData.map(
                      (table, i) =>
                        table.name === selected &&
                        table.rows
                          .filter(
                            (row) =>
                              filterVal === "" ||
                              table.columns.some((col) =>
                                row.data[col.name]
                                  ?.toString()
                                  .toLowerCase()
                                  .includes(filterVal.toLowerCase()),
                              ),
                          )
                          .map((row, ri) => (
                            <tr
                              className=" h-[100%] hover:bg-[#ffffff] transition-all duration-200"
                              key={`${i}-${ri}`}
                              style={{
                                boxShadow: "0 0 0 rgba(0,0,0,0)",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.boxShadow =
                                  "0 -4px 15px rgba(0, 0, 0, 0.065), 0 4px 15px rgba(0, 0, 0, 0.068)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.boxShadow =
                                  "0 0 0 rgba(0,0,0,0)")
                              }
                            >
                              {table.columns.map((col, ci) => (
                                <td
                                  className={`  h-[35px]  cursor-pointer ${
                                    colored.includes(`${row.id}-${col.name}`)
                                      ? "text-[#367cd7] "
                                      : "text-[#2b2b2b]"
                                  }   last:w-full text-[#2b2b2b] border-b-[#dedede] ${
                                    ci === 0 && "pl-[7px]"
                                  } hover:border-0 border-b-[1px] border-solid text-[14px] whitespace-nowrap`}
                                  key={`${i}-${ri}-${ci}`}
                                >
                                  <div className="flex h-[100%] items-center  ">
                                    <span className="pr-[2px] h-[100%]  flex items-center">
                                      {ci === 0 && (
                                        <input
                                          title={"Select row"}
                                          type="checkbox"
                                          onChange={() =>
                                            setCheckBoxes((prev) =>
                                              prev.map((checkbox) =>
                                                checkbox.id === ri
                                                  ? {
                                                      ...checkbox,
                                                      value: !checkbox.value,
                                                    }
                                                  : checkbox,
                                              ),
                                            )
                                          }
                                          checked={
                                            checkBoxes.find(
                                              (checkbox) => checkbox.id === ri,
                                            )?.value
                                          }
                                        />
                                      )}
                                      {ci === 0 && (
                                        <div className="w-[1px] ml-[10px] h-[100%]  bg-[#dedede]"></div>
                                      )}
                                    </span>
                                    <input
                                      type="text"
                                      className="flex outline-0 "
                                      style={{
                                        width: `${Math.max(
                                          valEdit.find(
                                            (v) =>
                                              v.name === col.name &&
                                              v.rowId === row.id,
                                          )?.value.length ||
                                            row.data[col.name]?.toString()
                                              .length ||
                                            1,
                                          1,
                                        )}ch`,
                                      }}
                                      value={
                                        valEdit.find(
                                          (v) =>
                                            v.name === col.name &&
                                            v.rowId === row.id,
                                        )?.value ?? row.data[col.name]
                                      }
                                      onChange={(e) =>
                                        setValEdit((prev) => {
                                          const existingIndex = prev.findIndex(
                                            (v) =>
                                              v.name === col.name &&
                                              v.rowId === row.id,
                                          );
                                          setColored((prev) => [
                                            ...prev,
                                            `${row.id}-${col.name}`,
                                          ]);

                                          if (existingIndex !== -1) {
                                            const updated = [...prev];
                                            updated[existingIndex] = {
                                              ...updated[existingIndex],
                                              value: e.target.value,
                                            };
                                            return updated;
                                          }

                                          return [
                                            ...prev,
                                            {
                                              id: `${row.id}-${col.name}`,
                                              name: col.name,
                                              value: e.target.value,
                                              rowId: row.id,
                                            },
                                          ];
                                        })
                                      }
                                    />
                                  </div>
                                </td>
                              ))}
                            </tr>
                          )),
                    )}
                    <tr className="h-[100%]">
                      <td className="h-[35px] gap-[7px] flex pl-[2px] cursor-pointer border-b-[1px] border-dashed items-center border-b-[#dedede]">
                        <ButtonAddRecord
                          tableId={
                            tablesData.find((t) => t.name === selected)?.id ??
                            ""
                          }
                          userId={user?.id}
                          addDataVal={addDataVal}
                          refreshTables={refreshTables}
                          onSuccess={() => setAddDataVal({})}
                        />

                        {tablesData.map(
                          (table) =>
                            table.name === selected &&
                            table.columns.map(
                              (col, cindex) =>
                                cindex == 0 && (
                                  <input
                                    key={col.id}
                                    className="text-[14px] outline-0"
                                    type="text"
                                    onChange={(e) =>
                                      setAddDataVal((prev) => ({
                                        ...prev,
                                        [col.name]: e.target.value,
                                      }))
                                    }
                                    placeholder={`${col.name}...`}
                                    style={{
                                      width: `${
                                        (
                                          addDataVal[col.name] ?? `${col.name}`
                                        ).toString().length ||
                                        `${col.name}`.length
                                      }ch`,
                                    }}
                                    value={addDataVal[col.name] ?? ""}
                                  />
                                ),
                            ),
                        )}
                      </td>
                      {tablesData.map(
                        (table) =>
                          table.name === selected &&
                          table.columns.map(
                            (col, cindex) =>
                              cindex != 0 && (
                                <td
                                  key={col.id}
                                  className="h-[35px] cursor-pointer last:w-full text-[#5d5d5d] border-b-[#dedede] pl-[5px] border-b-[1px] border-dashed text-[14px] whitespace-nowrap"
                                >
                                  <input
                                    className="text-[14px] outline-0"
                                    type="text"
                                    onChange={(e) =>
                                      setAddDataVal((prev) => ({
                                        ...prev,
                                        [col.name]: e.target.value,
                                      }))
                                    }
                                    placeholder={`${col.name}...`}
                                    style={{
                                      width: `${
                                        (
                                          addDataVal[col.name] ?? `${col.name}`
                                        ).toString().length ||
                                        `${col.name}`.length
                                      }ch`,
                                    }}
                                    value={addDataVal[col.name] ?? ""}
                                  />
                                </td>
                              ),
                          ),
                      )}
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {tablesData.map(
                      (table, i) =>
                        table.name === selected &&
                        table.rows
                          .filter(
                            (row) =>
                              filterVal === "" ||
                              table.columns.some((col) =>
                                row.data[col.name]
                                  ?.toString()
                                  .toLowerCase()
                                  .includes(filterVal.toLowerCase()),
                              ),
                          )
                          .map((row, ri) => (
                            <tr
                              className=" hover:bg-[#ffffff] transition-all duration-200 "
                              key={`${i}-${ri}`}
                              style={{
                                boxShadow: "0 0 0 rgba(0,0,0,0)",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.boxShadow =
                                  "0 -4px 15px rgba(0, 0, 0, 0.065), 0 4px 15px rgba(0, 0, 0, 0.068)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.boxShadow =
                                  "0 0 0 rgba(0,0,0,0)")
                              }
                            >
                              {table.columns.map((col, ci) => (
                                <td
                                  className="pr-[5px] cursor-pointer hover:text-[#000000] h-[35px] last:w-full text-[#2b2b2b] border-b-[#dedede] hover:border-0 border-b-[1px] border-solid  text-[14px]  pl-[5px] whitespace-nowrap"
                                  key={`${i}-${ri}-${ci}`}
                                >
                                  <div className="flex h-[100%] items-center  ">
                                    <span className="pr-[5px] h-[100%]  flex items-center">
                                      {ci === 0 && (
                                        <input
                                          disabled={true}
                                          title="Only possible in edit mode."
                                          type="checkbox"
                                          onChange={() =>
                                            setCheckBoxes((prev) =>
                                              prev.map((checkbox) =>
                                                checkbox.id === ri
                                                  ? {
                                                      ...checkbox,
                                                      value: !checkbox.value,
                                                    }
                                                  : checkbox,
                                              ),
                                            )
                                          }
                                          checked={
                                            checkBoxes.find(
                                              (checkbox) => checkbox.id === ri,
                                            )?.value
                                          }
                                        />
                                      )}
                                      {ci === 0 && (
                                        <div className="w-[1px] ml-[10px] h-[100%]  bg-[#dedede]"></div>
                                      )}
                                    </span>
                                    {row.data[col.name]}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          )),
                    )}
                  </tbody>
                )}
              </table>
            </div>
          )}
        </div>

        <InteractionMenu
          mode={mode}
          refreshTables={refreshTables}
          valEdit={valEdit}
          colored={colored}
          setColored={setColored}
        />
      </div>
      <div className="flex pl-[3%] pt-[2%] pb-[2%] items-center w-full h-full">
        <CommandBox refreshTables={refreshTables} addViewNode={addViewNode} />
      </div>
    </div>
  );
};

export default PageDatabase;
