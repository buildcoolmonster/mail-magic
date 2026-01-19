import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { EmailTemplate } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TemplateSelector({
  templates,
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No templates created yet.</p>
        <p className="text-sm mt-1">Go to the Templates page to create one first.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:bg-accent",
            selectedId === template.id && "ring-2 ring-primary bg-accent"
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{template.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {template.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {template.subject}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {template.body.substring(0, 100)}...
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
