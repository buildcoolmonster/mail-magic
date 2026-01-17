import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function SendEmails() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Send Emails</h1>
        <p className="text-muted-foreground">Compose and send personalized job applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Wizard</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Send wizard coming soon...</p>
          <p className="text-sm text-muted-foreground mt-2">Upload attachments first in the Attachments page</p>
        </CardContent>
      </Card>
    </div>
  );
}
