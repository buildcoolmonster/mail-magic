import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { useAttachments } from "@/hooks/useAttachments";
import { formatFileSize } from "@/lib/utils";
import { Trash2, FileText, Image, File, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttachmentType } from "@/types";

export default function Attachments() {
  const { attachments, addAttachment, removeAttachment, isUploading } = useAttachments();
  const [activeTab, setActiveTab] = useState<AttachmentType>("resume");

  const getIcon = (type: AttachmentType) => {
    if (type === "resume" || type === "cover-letter") return FileText;
    if (type === "portfolio") return Image;
    return File;
  };

  const filterByType = (type: AttachmentType) => attachments.filter(a => a.type === type);

  const handleFileSelect = async (file: File, type: AttachmentType) => {
    await addAttachment(file, type);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Attachments</h1>
        <p className="text-muted-foreground">Manage your resume, portfolio, and cover letters</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AttachmentType)}>
        <TabsList>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {(["resume", "portfolio", "cover-letter", "other"] as AttachmentType[]).map(type => (
          <TabsContent key={type} value={type} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload {type.replace("-", " ")}</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  type={type}
                  onFileSelect={handleFileSelect}
                  accept={type === "portfolio" ? ".pdf,.png,.jpg,.jpeg" : ".pdf,.doc,.docx"}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Files ({filterByType(type).length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filterByType(type).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No files uploaded yet</p>
                ) : (
                  <div className="space-y-2">
                    {filterByType(type).map(attachment => {
                      const Icon = getIcon(attachment.type);
                      return (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(attachment.size)} • Uploaded {new Date(attachment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{attachment.type}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAttachment(attachment.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
