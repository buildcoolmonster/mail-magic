import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailLogs } from "@/hooks/useEmailLogs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Mail } from "lucide-react";

export default function Logs() {
  const { logs, getStats } = useEmailLogs();
  const stats = getStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <CheckCircle className="h-4 w-4 text-success" />;
      case "opened": return <Mail className="h-4 w-4 text-primary" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Email Logs</h1>
        <p className="text-muted-foreground">Track your sent applications</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-success">{stats.sent}</p><p className="text-xs text-muted-foreground">Sent</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-primary">{stats.opened}</p><p className="text-xs text-muted-foreground">Opened</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-destructive">{stats.failed}</p><p className="text-xs text-muted-foreground">Failed</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No emails sent yet</p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 20).map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="font-medium text-sm">{log.recipientEmail}</p>
                      <p className="text-xs text-muted-foreground">{log.company} • {log.templateName}</p>
                    </div>
                  </div>
                  <Badge variant={log.status === "sent" ? "success" : log.status === "failed" ? "destructive" : "secondary"}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
