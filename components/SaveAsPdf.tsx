"use client";

// Saves the page as a PDF through the browser's print window — the page's print
// styles strip the console chrome, leaving a clean document to share on
// WhatsApp or by email. No PDF library needed, and long reports paginate.
export function SaveAsPdf({
  fileName,
  className = "",
}: {
  fileName: string;
  className?: string;
}) {
  const save = () => {
    const previous = document.title;
    // Browsers name the saved PDF after the page title.
    document.title = fileName.replace(/[\\/:*?"<>|]+/g, "-");
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <div className={`print:hidden ${className}`}>
      <button
        type="button"
        onClick={save}
        className="rounded-lg bg-green-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-green-800"
      >
        Save as PDF
      </button>
      <p className="mt-1.5 text-xs text-slate-500">
        Choose &ldquo;Save as PDF&rdquo; as the printer.
      </p>
    </div>
  );
}
