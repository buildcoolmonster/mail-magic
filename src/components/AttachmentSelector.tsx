import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { FileText, Image, File, Briefcase } from "lucide-react";
import { Attachment, AttachmentType } from "@/types";
import { cn } from "@/lib/utils";

interface AttachmentSelectorProps {
  attachments: Attachment[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const getIcon = (type: AttachmentType) => {
  switch (type) {
    case "resume":
      return FileText;
    case "portfolio":
      return Briefcase;
    case "cover-letter":
      return File;
    default:
      return Image;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function AttachmentSelector({
  attachments,
  selectedIds,
  onSelectionChange,
}: AttachmentSelectorProps) {
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const groupedAttachments = attachments.reduce((acc, attachment) => {
    if (!acc[attachment.type]) {
      acc[attachment.type] = [];
    }
    acc[attachment.type].push(attachment);
    return acc;
  }, {} as Record<AttachmentType, Attachment[]>);

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No attachments uploaded yet.</p>
        <p className="text-sm mt-1">Go to the Attachments page to upload files first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(["resume", "cover-letter", "portfolio", "other"] as AttachmentType[]).map((type) => {
        const typeAttachments = groupedAttachments[type];
        if (!typeAttachments?.length) return null;

        const Icon = getIcon(type);
        const typeLabel = type === "cover-letter" ? "Cover Letters" : 
                         type.charAt(0).toUpperCase() + type.slice(1) + "s";

        return (
          <div key={type}>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {typeLabel}
            </h4>
            <div className="grid gap-2">
              {typeAttachments.map((attachment) => (
                <Card
                  key={attachment.id}
                  className={cn(
                    "p-3 cursor-pointer transition-all hover:bg-accent",
                    selectedIds.includes(attachment.id) && "ring-2 ring-primary bg-accent"
                  )}
                  onClick={() => handleToggle(attachment.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedIds.includes(attachment.id)}
                      onCheckedChange={() => handleToggle(attachment.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
