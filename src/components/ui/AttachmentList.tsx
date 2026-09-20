import { FileText, FileImage, FileSpreadsheet, File as FileGeneric, Download, Eye } from "lucide-react";

export type AttachmentItem = {
  name: string;
  type?: "PDF" | "Image" | "Document" | "Spreadsheet" | "Other";
  size?: string;
};

function iconFor(type?: AttachmentItem["type"]) {
  switch (type) {
    case "PDF":
      return FileText;
    case "Image":
      return FileImage;
    case "Spreadsheet":
      return FileSpreadsheet;
    default:
      return FileGeneric;
  }
}

type AttachmentListProps = {
  attachments: AttachmentItem[];
  onOpen?: (attachment: AttachmentItem) => void;
  className?: string;
};

export function AttachmentList({ attachments, onOpen, className = "" }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {attachments.map((att, i) => {
        const Icon = iconFor(att.type);
        return (
          <button
            key={`${att.name}-${i}`}
            type="button"
            onClick={() => onOpen?.(att)}
            className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left transition hover:border-zinc-300 hover:bg-white"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-500">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-800">{att.name}</p>
              {att.size && <p className="text-[11px] text-zinc-400">{att.size}</p>}
            </div>
            {onOpen ? (
              <Eye size={15} className="shrink-0 text-zinc-400" />
            ) : (
              <Download size={15} className="shrink-0 text-zinc-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
