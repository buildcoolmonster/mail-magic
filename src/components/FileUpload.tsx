import { useCallback, useState } from "react";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AttachmentType } from "@/types";

interface FileUploadProps {
  onFileSelect: (file: File, type: AttachmentType) => void;
  type: AttachmentType;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  type,
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  maxSize = 10 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ name: string; size: number } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleFile = (file: File) => {
    if (file.size > maxSize) {
      alert(`File too large. Max size: ${formatFileSize(maxSize)}`);
      return;
    }
    setPreviewFile({ name: file.name, size: file.size });
    onFileSelect(file, type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => setPreviewFile(null);

  const getIcon = () => {
    if (type === "resume" || type === "cover-letter") return FileText;
    if (type === "portfolio") return Image;
    return File;
  };
  const Icon = getIcon();

  const getLabel = () => {
    switch (type) {
      case "resume": return "Resume (PDF)";
      case "portfolio": return "Portfolio";
      case "cover-letter": return "Cover Letter";
      default: return "File";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {getLabel()}
        {type === "resume" && <span className="text-destructive">*</span>}
      </label>
      
      {previewFile ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">{previewFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(previewFile.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            id={`file-${type}`}
          />
          <label htmlFor={`file-${type}`} className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {formatFileSize(maxSize)}
            </p>
          </label>
        </div>
      )}
    </div>
  );
}
