import { Handle, Position } from "reactflow";
import { X } from "lucide-react";

interface ViewNodeData {
  title: string;
  rows: { id: string; data: Record<string, any> }[];
  onDelete: () => void;
}

const ViewNode = ({ data }: { data: ViewNodeData }) => {
  const columns = data.rows.length > 0 ? Object.keys(data.rows[0].data) : [];

  return (
    <div className="rounded-xl border-2 border-dashed border-purple-400 bg-purple-50 min-w-[280px] max-w-[400px]">
      <div className="flex items-center justify-between border-b border-purple-200 px-3 py-2">
        <span className="text-sm font-semibold text-purple-700">
          🔍 {data.title}
        </span>
        <button
          onClick={data.onDelete}
          className="text-purple-400 hover:text-purple-700"
        >
          <X size={16} />
        </button>
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2">
        {data.rows.length === 0 ? (
          <p className="p-2 text-xs text-purple-400">Brak wyników</p>
        ) : (
          data.rows.map((row) => (
            <div key={row.id} className="mb-1 rounded bg-white p-2 text-xs">
              {columns.map((col) => (
                <div key={col} className="flex justify-between gap-2">
                  <span className="text-gray-400">{col}:</span>
                  <span className="font-medium text-gray-800">
                    {String(row.data[col])}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default ViewNode;
