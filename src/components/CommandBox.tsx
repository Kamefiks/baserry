import { useApp } from "@/contexts/AppContext";
import useCustomTablesData, {
  dataColumnType,
} from "@/hooks/useCustomTableData";
import { supabase } from "@/lib/supabase";
import { Send, Loader2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useEdgesState, useNodesState } from "reactflow";
import { initialEdges, initialNodes, TableNode } from "./PageDatabase";
import { Tooltip } from "react-tooltip";

interface CommandBoxProps {
  refreshTables?: () => Promise<{ id: string; name: string }[] | null>;
  addViewNode?: (
    title: string,
    rows: { id: string; data: Record<string, any> }[],
  ) => void;
}

const ALLOWED_TYPES = ["text", "number", "boolean", "date"];

type PendingAction = {
  action: string;
  table_name?: string;
  table_id?: string;
  column_id?: string;
  references_table_id?: string;
  columns?: {
    name: string;
    type: string;
    references_table_id?: string | null;
  }[];
  column?: { name: string; type: string };
  rows?: Record<string, any>[];
  row_id?: string;
  data?: Record<string, any>;
  filter?: {
    column: string;
    value: string;
    operator: "eq" | "neq";
  };
};

const CommandBox = ({ refreshTables, addViewNode }: CommandBoxProps) => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const { user, setInputPrompt, inputPrompt } = useApp();
  const [tablesID, setTablesID] = useState<string[]>([]);
  const [tablesNames, setTablesNames] = useState<string[]>([]);
  const [datasColumn, setDatasColumn] = useState<dataColumnType[]>([]);
  const { tablesData } = useCustomTablesData(tablesID, 100000);
  const [originalPrompt, setOriginalPrompt] = useState("");

  const [, setNodes] = useNodesState(initialNodes);
  const [, setEdges] = useEdgesState(initialEdges);

  const fetchTables = async () => {
    const { data: tablesData, error: _tablesErr } = await supabase
      .from("custom_tables")
      .select("id, name")
      .eq("user_id", user?.id);

    if (tablesData) {
      setTablesID(tablesData.map((data) => data.id));
      setTablesNames(tablesData.map((data) => data.name));
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTables();
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchDataTables = async () => {
      if (tablesID.length === 0) return;

      setDatasColumn([]);

      const promises = tablesID.map((id) =>
        supabase
          .from("custom_rows")
          .select("id, data, table_id")
          .eq("table_id", id),
      );

      const results = await Promise.all(promises);

      results.forEach(({ data: rows, error }) => {
        if (error) {
          console.error("Błąd podczas pobierania danych:", error);
        } else {
          setDatasColumn((prev) => [...prev, ...rows]);
        }
      });
    };

    fetchDataTables();
  }, [tablesID]);

  const API_KEY = import.meta.env.VITE_GEMINI_KEY;

  const generateActionPrompt = () => `
Jesteś systemem zamieniającym krótkie polecenia użytkownika na strukturalne akcje bazodanowe.
Użytkownik pisze krótko, np. "Dodaj mi tabelę users z id i name" albo "Dodaj Darka do klientów".
Rozpoznaj intencję i zwróć WYŁĄCZNIE JSON, bez markdown, bez dodatkowego tekstu przed/po:


Wyświetlanie/wyszukiwanie danych:
{"action":"select_rows","table_id":"uuid_tabeli","filter":{"column":"nazwa_kolumny","value":"wartość","operator":"eq"}}

ZASADY WYŚWIETLANIA/WYSZUKIWANIA:
- Jeśli użytkownik pyta "pokaż mi", "znajdź", "wyszukaj", "ile jest" → action: "select_rows"
- "filter" jest opcjonalny - pomiń go całkowicie, jeśli user chce zobaczyć wszystkie wiersze bez warunku
- Pole "operator" MUSI być jednym z: "eq" (równy) albo "neq" (różny/nie równy)
- Słowa "inny niż X", "różny od X", "nie równy X", "z wyjątkiem X", "poza X" → operator: "neq"
- Słowa "z wartością X", "równy X", "wynoszący X", "taki jak X" → operator: "eq"
- Jeśli user filtruje po wartości z powiązanej tabeli (np. "aktorzy z filmu Matrix"), znajdź najpierw odpowiedni wiersz w powiązanej tabeli z listy DOSTĘPNYCH WIERSZY poniżej, weź jego prawdziwe "id" (pole wewnątrz "data"), i użyj tej wartości jako filtra na kolumnie referencyjnej (np. filter: {"id_filmu": "1"})

Przykład 1:
User: "pokaż aktorów z wiekiem 23"
{"action":"select_rows","table_id":"...","filter":{"column":"wiek","value":"23","operator":"eq"}}

Przykład 2:
User: "pokaż aktorów z innym wiekiem niż 23"
{"action":"select_rows","table_id":"...","filter":{"column":"wiek","value":"23","operator":"neq"}}

Przykład 3:
User: "pokaż wszystkich aktorów"
{"action":"select_rows","table_id":"..."}
______________________________________________________________________________________________________________

Tworzenie nowej tabeli z kolumnami:
{"action":"create_table","table_name":"users","columns":[{"name":"id","type":"text"},{"name":"name","type":"text"}]}

Dodawanie kolumny do istniejącej tabeli:
{"action":"add_column","table_id":"uuid_tabeli","column":{"name":"email","type":"text"}}

Dodawanie wierszy do istniejącej tabeli:
{"action":"insert_rows","table_id":"uuid_tabeli","rows":[{"kolumna1":"wartość1"}]}

Edycja wiersza:
{"action":"update_row","row_id":"uuid_wiersza","data":{"kolumna1":"nowa_wartość"}}

Usuwanie wiersza:
{"action":"delete_row","row_id":"uuid_wiersza"}

Usuwanie WSZYSTKICH wierszy z tabeli:
{"action":"delete_all_rows","table_id":"uuid_tabeli"}

Tworzenie tabeli z relacją do innej tabeli:
{"action":"create_table","table_name":"orders","columns":[
  {"name":"id","type":"text"},
  {"name":"user_id","type":"text","references_table_id":"uuid_tabeli_users"},
  {"name":"kwota","type":"number"}
]}

ZASADY RELACJI:
- Jeśli użytkownik mówi "tabela X powiązana z Y" albo kolumna nazywa się np. "user_id", "klient_id" (sugerując odniesienie do innej tabeli) → dodaj pole "references_table_id" wskazujące na odpowiednią tabelę z listy dostępnych tabel.
- Jeśli nie ma wyraźnego wskazania na relację, nie dodawaj "references_table_id".

Łączenie istniejącej kolumny z inną tabelą (tworzenie relacji):
{"action":"set_column_reference","column_id":"uuid_kolumny","references_table_id":"uuid_tabeli_docelowej"}

ZASADY RELACJI 2:
- Jeśli użytkownik chce "połączyć", "powiązać" istniejącą kolumnę z inną tabelą → action: "set_column_reference"
- Znajdź column_id na podstawie nazwy kolumny wymienionej w DOSTĘPNYCH KOLUMNACH poniżej
- Znajdź references_table_id na podstawie nazwy tabeli docelowej z DOSTĘPNYCH TABEL

ZASADY:
- Jeśli użytkownik wspomina tabelę spoza listy poniżej → action: "create_table"
- Jeśli wspomina istniejącą tabelę i chce dodać dane → action: "insert_rows"
- Jeśli chce dodać nową kolumnę do istniejącej tabeli → action: "add_column"
- Dozwolone typy kolumn: ${ALLOWED_TYPES.join(", ")}. Nigdy nie używaj innych typów.
- Nigdy nie wymyślaj kolumn, których użytkownik nie wspomniał.
- Zwracaj uwagę na polskie znaki (ę, ą, ż itd.) — dopasuj dokładnie do istniejących nazw kolumn.

DOSTĘPNE TABELE UŻYTKOWNIKA (nazwa : id):
${tablesID.map((id, i) => `${tablesNames[i]} : ${id}`).join(" | ") || "brak tabel"}

DOSTĘPNE KOLUMNY DLA KAŻDEJ TABELI:
${
  tablesData
    .map(
      (table) =>
        `${table.name} (${table.id}): [${table.columns
          .map((c) => c.name)
          .join(", ")}]`,
    )
    .join(" | ") || "brak"
}


DOSTĘPNE WIERSZE (z ich prawdziwymi ID) DLA KAŻDEJ TABELI:
${tablesID
  .map((id, i) => {
    const rows = datasColumn.filter((d) => d.table_id === id);
    return `${tablesNames[i]}: ${JSON.stringify(rows)}`;
  })
  .join(" | ")}
`;

  function restartNodes() {}

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
            id: `${table.id}-${col.references_table_id}`,
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
  }, [tablesData]);

  function describeAction(action: PendingAction): string {
    const tableName =
      tablesNames[tablesID.indexOf(action.table_id ?? "")] ?? "nieznana tabela";

    switch (action.action) {
      case "select_rows": {
        const tName =
          tablesNames[tablesID.indexOf(action.table_id ?? "")] ??
          "nieznana tabela";
        return `Pokaż dane z tabeli "${tName}"`;
      }
      case "create_table":
        return `Utwórz tabelę "${action.table_name}" z kolumnami: ${action.columns
          ?.map(
            (c) =>
              `${c.name} (${c.type}${c.references_table_id ? `, powiązana z ${tablesNames[tablesID.indexOf(c.references_table_id)]}` : ""})`,
          )
          .join(", ")}`;
      case "add_column":
        return `Dodaj kolumnę "${action.column?.name}" (${action.column?.type}) do tabeli "${tableName}"`;
      case "insert_rows":
        return `Dodaj ${action.rows?.length} wiersz(y) do tabeli "${tableName}": ${action.rows
          ?.map((r) => Object.values(r).join(" "))
          .join(", ")}`;
      case "update_row":
        return `Zaktualizuj wiersz: ${Object.entries(action.data ?? {})
          .map(([k, v]) => `${k} → ${v}`)
          .join(", ")}`;
      case "delete_row":
        return `Usuń wiersz z bazy danych`;
      case "delete_all_rows":
        return `Usuń WSZYSTKIE wiersze z tabeli "${tableName}"`;
      case "set_column_reference": {
        const targetTable =
          tablesNames[tablesID.indexOf(action.references_table_id ?? "")] ??
          "nieznana tabela";
        return `Połącz kolumnę z tabelą "${targetTable}"`;
      }
      default:
        return "Nieznana operacja";
    }
  }

  async function executeAction(action: PendingAction) {
    switch (action.action) {
      case "select_rows": {
        if (!action.table_id || !tablesID.includes(action.table_id)) {
          throw new Error("Ta tabela nie należy do Ciebie.");
        }

        const { data, error } = await supabase
          .from("custom_rows")
          .select("id, data")
          .eq("table_id", action.table_id);

        if (error) throw error;

        if (action.filter?.column) {
          const { column, value, operator } = action.filter;
          return data.filter((row) => {
            const rowValue = row.data[column]?.toString();
            if (operator === "neq") return rowValue !== value?.toString();
            return rowValue === value?.toString();
          });
        }

        return data;
      }
      case "create_table": {
        for (const col of action.columns ?? []) {
          if (!ALLOWED_TYPES.includes(col.type)) {
            throw new Error(`Nieprawidłowy typ kolumny: ${col.type}`);
          }
          if (
            col.references_table_id &&
            !tablesID.includes(col.references_table_id)
          ) {
            throw new Error("Nie można odwołać się do nieistniejącej tabeli.");
          }
        }

        const { data: newTable, error: tableError } = await supabase
          .from("custom_tables")
          .insert({ user_id: user?.id, name: action.table_name })
          .select()
          .single();
        if (tableError) throw tableError;

        const columnsToInsert = (action.columns ?? []).map((col) => ({
          table_id: newTable.id,
          name: col.name,
          type: col.type,
          references_table_id: col.references_table_id ?? null,
        }));

        const { error: columnsError } = await supabase
          .from("custom_columns")
          .insert(columnsToInsert);
        if (columnsError) throw columnsError;

        return newTable;
      }

      case "add_column": {
        if (!action.table_id || !tablesID.includes(action.table_id)) {
          throw new Error("Ta tabela nie należy do Ciebie.");
        }
        if (!action.column || !ALLOWED_TYPES.includes(action.column.type)) {
          throw new Error(`Nieprawidłowy typ kolumny.`);
        }
        return supabase.from("custom_columns").insert({
          table_id: action.table_id,
          name: action.column.name,
          type: action.column.type,
        });
      }

      case "insert_rows": {
        if (!action.table_id || !tablesID.includes(action.table_id)) {
          throw new Error("Ta tabela nie należy do Ciebie.");
        }
        const validColumns =
          tablesData
            .find((t) => t.id === action.table_id)
            ?.columns.map((c) => c.name) ?? [];

        const rowsToInsert = (action.rows ?? []).map((row) => {
          const filteredData: Record<string, any> = {};
          for (const key of Object.keys(row)) {
            if (validColumns.includes(key)) filteredData[key] = row[key];
          }
          return {
            table_id: action.table_id,
            user_id: user?.id,
            data: filteredData,
          };
        });

        return supabase.from("custom_rows").insert(rowsToInsert);
      }

      case "update_row": {
        console.log(
          "update_row - row_id:",
          action.row_id,
          "data:",
          action.data,
        );

        const { data: existingRow, error: fetchError } = await supabase
          .from("custom_rows")
          .select("id, user_id, data")
          .eq("id", action.row_id)
          .single();

        console.log("Znaleziony wiersz:", existingRow, "błąd:", fetchError);

        if (!existingRow || existingRow.user_id !== user?.id) {
          throw new Error("Brak dostępu do tego wiersza.");
        }

        const mergedData = { ...existingRow.data, ...action.data };
        console.log("Dane po merge:", mergedData);

        const { data: updateResult, error: updateError } = await supabase
          .from("custom_rows")
          .update({ data: mergedData })
          .eq("id", action.row_id)
          .select();

        console.log("Wynik update:", updateResult, "błąd:", updateError);

        return updateResult;
      }

      case "delete_row": {
        const { data: existingRow } = await supabase
          .from("custom_rows")
          .select("id, user_id")
          .eq("id", action.row_id)
          .single();
        if (!existingRow || existingRow.user_id !== user?.id) {
          throw new Error("Brak dostępu do tego wiersza.");
        }
        return supabase.from("custom_rows").delete().eq("id", action.row_id);
      }
      case "delete_all_rows": {
        if (!action.table_id || !tablesID.includes(action.table_id)) {
          throw new Error("Ta tabela nie należy do Ciebie.");
        }
        return supabase
          .from("custom_rows")
          .delete()
          .eq("table_id", action.table_id)
          .eq("user_id", user?.id);
      }
      case "set_column_reference": {
        if (
          !action.references_table_id ||
          !tablesID.includes(action.references_table_id)
        ) {
          throw new Error("Tabela docelowa nie należy do Ciebie.");
        }
        return supabase
          .from("custom_columns")
          .update({ references_table_id: action.references_table_id })
          .eq("id", action.column_id);
      }

      default:
        throw new Error("Nieznana akcja: " + action.action);
    }
  }

  const handleAskAI = async () => {
    if (!inputPrompt.trim()) return;

    const promptText = inputPrompt;
    setOriginalPrompt(promptText);
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: generateActionPrompt() }] },
              { role: "user", parts: [{ text: inputPrompt }] },
            ],
          }),
        },
      );

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setOutput("AI nie zwróciło poprawnego formatu.");
        return;
      }

      const action = JSON.parse(jsonMatch[0]);

      if (action.action === "select_rows") {
        try {
          const result = await executeAction(action);
          const tableName =
            tablesNames[tablesID.indexOf(action.table_id ?? "")] ?? "wynik";
          addViewNode?.(`Wynik: ${tableName}`, result as any);

          await supabase.from("command_history").insert({
            user_id: user?.id,
            prompt: promptText,
            interpretation: describeAction(action),
          });

          setInputPrompt("");
        } catch (err: any) {
          setOutput(`Błąd: ${err.message}`);
        }
        return;
      }

      setPendingAction(action);
      setModalOpen(true);
    } catch (error: any) {
      console.error(error);
      setOutput("Błąd podczas komunikacji z Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    setConfirming(true);

    try {
      await executeAction(pendingAction);
      window.dispatchEvent(new CustomEvent("tables-changed"));
      setOutput("Wykonano pomyślnie.");

      await supabase.from("command_history").insert({
        user_id: user?.id,
        prompt: originalPrompt,
        interpretation: describeAction(pendingAction),
      });

      setInputPrompt("");
      setPendingAction(null);
      setModalOpen(false);

      await new Promise((res) => setTimeout(res, 300));
      restartNodes();

      if (refreshTables) {
        const updatedTables = await refreshTables();
        if (updatedTables) {
          setTablesID(updatedTables.map((table) => table.id));
          setTablesNames(updatedTables.map((table) => table.name));
        }
      }
    } catch (error: any) {
      console.error(error);
      setOutput(`Błąd: ${error.message}`);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    setPendingAction(null);
    setModalOpen(false);
  };

  return (
    <>
      <div className="w-[45%] relative pl-[15px] pr-[3px] rounded-[12px] items-center flex h-[45px] border-[1px] border-[#000000]">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="w-[96%] pr-[10px] outline-0 text-[15px]"
          placeholder="Wydaj polecenie tekstowo botowi"
          disabled={loading}
        />

        <div
          style={{
            boxShadow: "inset 0 3px 8px rgba(255, 255, 255, 0.507)",
          }}
          className="w-[10%] py-[1px] px-[1px] justify-center border-[#000000] border-[1px] mr-[5px] cursor-pointer rounded-[14px] flex items-center h-[40px] bg-[#262626]"
        >
          <button
            data-tooltip-id="command-tooltip"
            data-tooltip-place="top"
            data-tooltip-content="Wykonaj"
            onClick={handleAskAI}
            disabled={loading}
            style={{
              boxShadow: "inset 0 5px 8px rgba(255, 255, 255, 0.356)",
            }}
            className="w-[100%] justify-center cursor-pointer gap-[15px] rounded-[14px] flex items-center h-[100%] bg-[#000000] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="text-white animate-spin" size={20} />
            ) : (
              <Send className="text-white" />
            )}
          </button>
        </div>

        <Tooltip
          className="!bg-[#ffffff4b] border-[1px] !text-[#222222] !text-[13px] !rounded-[10px] !px-2 !py-1 shadow-xl"
          id="my-tooltip"
        />

        {output && !modalOpen && (
          <p className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
            {output}
          </p>
        )}

        <Tooltip
          id="command-tooltip"
          className="!bg-[#ffffff4b] border-[1px] !text-[#222222] !text-[13px] !rounded-[10px] !px-2 !py-1 shadow-xl"
        ></Tooltip>
      </div>

      {modalOpen && pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />

          <div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#111111]">
              Potwierdź operację
            </h3>
            <p className="mt-1 text-sm text-[#666666]">
              Sprawdź co zostanie wykonane zanim zatwierdzisz.
            </p>

            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-700">
                {describeAction(pendingAction)}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancel}
                disabled={confirming}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e0e0e0] py-2.5 text-sm font-medium text-[#333333] hover:bg-[#f5f5f5] disabled:opacity-50"
              >
                <X size={16} />
                Anuluj
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white hover:bg-[#222222] disabled:opacity-50"
              >
                {confirming ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Zatwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommandBox;
