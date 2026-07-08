import { useApp } from "@/contexts/AppContext";
import { ButtonEditTable, ButtonViewTable } from "./Buttons";
import { Handle, Position } from "reactflow";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DataTable = ({ data }: any) => {
  const { TableName, columns, rows } = data;
  const navigate = useNavigate();
  useEffect(() => {
    console.log("DataTable - data:", data);
  }, [data.__refreshToken]);
  const { setSelected, selected } = useApp();
  return (
    <div
      onClick={() => setSelected(TableName)}
      onDrag={() => setSelected(TableName)}
      className={`flex rounded-[13px] drop-shadow-md pb-[2%] text-[#444444]  bg-white  border-[1px]  flex-col ${
        selected !== TableName
          ? "border-[#DDDDDD] brightness-90 opacity-50"
          : "border-[#5821A1]"
      }`}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <div className="w-full h-[40px] items-center flex border-b-[#DDDDDD] border-b-[1px]">
        <p className="font-medium pl-[15px] text-[20px] font-secondary ">
          {TableName}
        </p>
      </div>
      <table className="w-full border-separate  pl-[15px] pr-[10px]   h-full">
        <thead>
          <tr>
            {columns?.map((col: any) => (
              <td
                key={col.id}
                className="pr-6 uppercase text-[#C4C4C4] font-secondary font-semibold"
              >
                {col.name}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row: any, index: any) => (
            <tr key={row.id}>
              {columns?.map(
                (col: any) =>
                  index < 5 && (
                    <td
                      key={col.id}
                      className="pr-6 pt-3 font-medium text-[#7B7B7B]"
                    >
                      {row.data[col.name] || ""}
                    </td>
                  ),
              )}
            </tr>
          ))}

          <tr>
            {columns?.map(() => (
              <td className="pt-3">
                <div className="bg-[#F2F2F2] w-[90%] flex h-[20px] rounded-full"></div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between w-full">
        <ButtonEditTable
          onClick={() => navigate(`edit/${selected}`)}
        ></ButtonEditTable>
        <ButtonViewTable
          onClick={() => navigate(`view/${selected}`)}
        ></ButtonViewTable>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
};

export default DataTable;
