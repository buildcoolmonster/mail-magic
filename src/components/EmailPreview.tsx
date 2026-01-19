import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Paperclip, User, Mail } from "lucide-react";
import { EmailTemplate, Recipient, Attachment } from "@/types";

interface EmailPreviewProps {
  template: EmailTemplate | null;
  recipient: Recipient | null;
  attachments: Attachment[];
}

export function EmailPreview({ template, recipient, attachments }: EmailPreviewProps) {
  if (!template || !recipient) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground py-12">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select a template and recipient to preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{name\}\}/g, recipient.name || "")
      .replace(/\{\{email\}\}/g, recipient.email)
      .replace(/\{\{company\}\}/g, recipient.company || "")
      .replace(/\{\{position\}\}/g, recipient.position || "")
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
  };

  const previewSubject = replaceVariables(template.subject);
  const previewBody = replaceVariables(template.body);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Email Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">To:</span>
            <span className="font-medium">
              {recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{previewSubject}</span>
          </div>
        </div>

        <Separator />

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-sm">{previewBody}</div>
        </div>

        {attachments.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Paperclip className="h-4 w-4" />
                <span>Attachments ({attachments.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <Badge key={att.id} variant="secondary">
                    {att.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
