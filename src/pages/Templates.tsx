import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/useTemplates";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Templates() {
  const { templates, deleteTemplate } = useTemplates();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground">Create and manage your email templates</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Template</Button>
      </div>

      <div className="grid gap-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{template.type}</Badge>
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteTemplate(template.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4 bg-muted p-3 rounded">
                {template.body}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
