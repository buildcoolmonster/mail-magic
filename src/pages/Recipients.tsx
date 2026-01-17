import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecipients } from "@/hooks/useRecipients";
import { Plus, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Recipients() {
  const { recipients, deleteRecipient } = useRecipients();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">HR Recipients</h1>
          <p className="text-muted-foreground">Manage your HR contacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Import CSV</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Recipient</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Recipients ({recipients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recipients added yet</p>
          ) : (
            <div className="space-y-2">
              {recipients.map(recipient => (
                <div key={recipient.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{recipient.name || recipient.email}</p>
                    <p className="text-sm text-muted-foreground">{recipient.email} • {recipient.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {recipient.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                    <Button variant="ghost" size="icon" onClick={() => deleteRecipient(recipient.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
