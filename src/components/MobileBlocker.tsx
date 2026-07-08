export default function MobileBlocker() {
  return (
    <div className="fixed  inset-0 flex flex-col items-center justify-center bg-white px-8 text-center">
      <div className="mb-1 text-xs font-bold text-[#0000005e]">
        {" "}
        UŻYJ WIĘKSZEGO EKRANU{" "}
      </div>
      <div className="border-t-1 px-3 py-3 border-[#0000001c] border-solid flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Baserry działa najlepiej na komputerze
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Zarządzanie tabelami i diagramami wymaga większego ekranu. Otwórz tę
          stronę na laptopie lub komputerze, aby korzystać z pełnej
          funkcjonalności. Przepraszamy za niedogodności.
        </p>
      </div>
    </div>
  );
}
