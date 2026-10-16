import { useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  Image,
  File,
  X,
} from "lucide-react";
import { Button } from "./ui/Button";
import "./workspace-files.css";

type WorkspaceFile = { id: string; file: File };
function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024)
    return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(bytes / 1024)} KB`;
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))} MB`;
}

export function WorkspaceFiles() {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  function addFiles(incoming: File[]) {
    if (!incoming.length) {
      setNotice("Välj en eller flera filer från datorn.");
      return;
    }
    setFiles((previous) => {
      const unique = new Map(previous.map((item) => [item.id, item]));
      incoming.forEach((file) => {
        const id = JSON.stringify([file.name, file.size, file.lastModified]);
        if (!unique.has(id)) unique.set(id, { id, file });
      });
      return [...unique.values()];
    });
    setNotice("Urvalet är klart. Varje fil visas bara en gång i listan.");
  }

  return (
    <section className="workspace-files" aria-label="Filer i workspace">
        <input
          ref={input}
          type="file"
          multiple
          hidden
          aria-label="Lägg till filer i workspace"
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <Button
          className={`workspace-dropzone ${dragging ? "is-dragging" : ""}`}
          aria-label="Välj filer till workspace"
          onClick={() => input.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            if (event.dataTransfer.types.includes("Files")) {
              dragDepth.current += 1;
              setDragging(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (!dragDepth.current) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDragging(false);
            addFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <span className="workspace-dropzone-icon">
            <CloudUpload size={25} />
          </span>
          <span className="workspace-dropzone-title">
            {dragging ? "Släpp här" : "Lägg till filer"}
          </span>
        </Button>
        {files.length > 0 && (
          <ul className="workspace-file-list" aria-label="Tillagda filer">
            {files.map(({ id, file }) => {
              const Icon = file.type.startsWith("image/")
                ? Image
                : file.type.startsWith("text/") ||
                    file.type === "application/pdf"
                  ? FileText
                  : File;
              return (
                <li key={id}>
                  <span className="workspace-file-icon">
                    <Icon size={18} />
                  </span>
                  <div className="workspace-file-info">
                    <strong title={file.name}>{file.name}</strong>
                    <span>{fileSize(file.size)}</span>
                  </div>
                  <Button
                    shape="icon"
                    size="sm"
                    aria-label={`Ta bort ${file.name}`}
                    onClick={() => {
                      setFiles((previous) =>
                        previous.filter((item) => item.id !== id),
                      );
                      setNotice(`${file.name} är borttagen från arbetsytan.`);
                    }}
                  >
                    <X size={15} />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      <p className="workspace-file-notice" role="status" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}
