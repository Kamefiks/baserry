import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Column = {
  id: string;
  name: string;
  type: string;
  references_table_id: string | null;
};

type Row = {
  id: string;
  data: Record<string, any>;
};

export type dataColumnType = {
  table_id: string;
  data: object;
};

type TableData = {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  __refreshToken: Date;
};

type UseCustomTablesReturn = {
  tablesData: TableData[];
  tablesID: string[];
  tablesNames: string[];
  setTablesNames: (str: string[]) => void;
  datasColumn: dataColumnType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const useCustomTablesData = (
  tableIds: string[],
  limit: number,
): UseCustomTablesReturn => {
  const [tablesData, setTablesData] = useState<TableData[]>([]);
  const [tablesID, setTablesID] = useState<string[]>([]);
  const [tablesNames, setTablesNames] = useState<string[]>([]);
  const [datasColumn, setDatasColumn] = useState<dataColumnType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTables = async () => {
    if (tableIds.length === 0) return;

    const validTableIds = tableIds.filter((id) => id && id.trim() !== "");
    if (validTableIds.length === 0) return;

    setLoading(true);
    setError(null);
    console.log(
      "REFETCH - tableIds:",
      tableIds,
      "validTableIds:",
      validTableIds,
    );

    try {
      const results: (TableData | null)[] = await Promise.all(
        validTableIds.map(async (tableId) => {
          const [columnsRes, rowsRes, tableInfoRes] = await Promise.all([
            supabase
              .from("custom_columns")
              .select("id, name, type, references_table_id")
              .eq("table_id", tableId),

            supabase
              .from("custom_rows")
              .select("id, data")
              .eq("table_id", tableId)
              .limit(limit),

            supabase
              .from("custom_tables")
              .select("name")
              .eq("id", tableId)
              .single(),
          ]);

          if (columnsRes.error || rowsRes.error || tableInfoRes.error) {
            console.warn(`Błąd danych tabeli ${tableId}`, {
              columnsErr: columnsRes.error,
              rowsErr: rowsRes.error,
              tableInfoErr: tableInfoRes.error,
            });
            return null;
          }

          if (!columnsRes.data || !rowsRes.data || !tableInfoRes.data) {
            return null;
          }

          const sortedRows = [...rowsRes.data].sort((a, b) => {
            const aId = Number(a.data.id);
            const bId = Number(b.data.id);

            if (!isNaN(aId) && !isNaN(bId)) {
              return aId - bId;
            }
            return a.id.localeCompare(b.id);
          });

          console.log("REFETCH POMYŚLNY dla tabeli:", tableId);

          return {
            id: tableId,
            name: tableInfoRes.data.name,
            columns: columnsRes.data,
            rows: sortedRows,
            __refreshToken: new Date(),
          };
        }),
      );

      const validResults = results.filter(Boolean) as TableData[];
      console.log("Wszystkie wyniki:", validResults);

      setTablesData(validResults);
      setTablesNames(validResults.map((table) => table.name));
      setTablesID(validResults.map((table) => table.id));

      setDatasColumn(
        validResults.map((table) => ({
          table_id: table.id,
          data: table.columns,
        })),
      );
    } catch (e) {
      console.error(e);
      setError("Wystąpił błąd podczas pobierania danych tabel");
    } finally {
      setLoading(false);
      console.log("REFETCH POMYŚLNIE ZAKONCZONO");
    }
  };

  useEffect(() => {
    fetchAllTables();
  }, [tableIds]);

  return {
    tablesData,
    tablesID,
    tablesNames,
    setTablesNames,
    datasColumn,
    loading,
    error,
    refetch: fetchAllTables,
  };
};

export default useCustomTablesData;
