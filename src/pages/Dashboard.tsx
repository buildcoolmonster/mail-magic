import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTemplates } from "@/hooks/useTemplates";
import { useRecipients } from "@/hooks/useRecipients";
import { useAttachments } from "@/hooks/useAttachments";
import { useEmailLogs } from "@/hooks/useEmailLogs";
import { FileText, Users, Paperclip, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { templates } = useTemplates();
  const { recipients } = useRecipients();
  const { attachments } = useAttachments();
  const { getStats } = useEmailLogs();
  const stats = getStats();

  const cards = [
    { title: "Templates", value: templates.length, icon: FileText, color: "text-primary" },
    { title: "Recipients", value: recipients.length, icon: Users, color: "text-success" },
    { title: "Attachments", value: attachments.length, icon: Paperclip, color: "text-warning" },
    { title: "Emails Sent", value: stats.sent, icon: Send, color: "text-primary" },
    { title: "Opened", value: stats.opened, icon: CheckCircle, color: "text-success" },
    { title: "Failed", value: stats.failed, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your job application system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. <strong>Upload your Resume</strong> in the Attachments page</p>
          <p>2. <strong>Create email templates</strong> with placeholders like {"{{hr_name}}"}</p>
          <p>3. <strong>Add HR recipients</strong> manually or via CSV import</p>
          <p>4. <strong>Send personalized emails</strong> with attachments</p>
        </CardContent>
      </Card>
    </div>
  );
}
