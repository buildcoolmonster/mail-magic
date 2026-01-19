import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/components/WizardStepper";
import { TemplateSelector } from "@/components/TemplateSelector";
import { RecipientSelector } from "@/components/RecipientSelector";
import { AttachmentSelector } from "@/components/AttachmentSelector";
import { EmailPreview } from "@/components/EmailPreview";
import { useTemplates } from "@/hooks/useTemplates";
import { useRecipients } from "@/hooks/useRecipients";
import { useAttachments } from "@/hooks/useAttachments";
import { ArrowLeft, ArrowRight, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Template" },
  { id: 2, title: "Recipients" },
  { id: 3, title: "Attachments" },
  { id: 4, title: "Preview" },
  { id: 5, title: "Send" },
];

export default function SendEmails() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const { templates } = useTemplates();
  const { recipients } = useRecipients();
  const { attachments } = useAttachments();

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || null,
    [templates, selectedTemplateId]
  );

  const selectedRecipients = useMemo(
    () => recipients.filter((r) => selectedRecipientIds.includes(r.id)),
    [recipients, selectedRecipientIds]
  );

  const selectedAttachments = useMemo(
    () => attachments.filter((a) => selectedAttachmentIds.includes(a.id)),
    [attachments, selectedAttachmentIds]
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplateId !== null;
      case 2:
        return selectedRecipientIds.length > 0;
      case 3:
        return true; // Attachments are optional
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // TODO: Implement actual email sending via Gmail API
    // For now, simulate sending
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success(`Successfully queued ${selectedRecipientIds.length} emails for sending!`);
    
    // Reset wizard
    setCurrentStep(1);
    setSelectedTemplateId(null);
    setSelectedRecipientIds([]);
    setSelectedAttachmentIds([]);
    setIsSending(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Email Template</h3>
            <TemplateSelector
              templates={templates}
              selectedId={selectedTemplateId}
              onSelect={setSelectedTemplateId}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Recipients</h3>
            <RecipientSelector
              recipients={recipients}
              selectedIds={selectedRecipientIds}
              onSelectionChange={setSelectedRecipientIds}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Attachments (Optional)</h3>
            <AttachmentSelector
              attachments={attachments}
              selectedIds={selectedAttachmentIds}
              onSelectionChange={setSelectedAttachmentIds}
            />
          </div>
        );

      case 4:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Preview Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Showing preview for the first recipient. Variables will be replaced for each recipient.
              </p>
              <EmailPreview
                template={selectedTemplate}
                recipient={selectedRecipients[0] || null}
                attachments={selectedAttachments}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Template</p>
                    <p className="font-medium">{selectedTemplate?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recipients</p>
                    <p className="font-medium">{selectedRecipientIds.length} recipient(s)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attachments</p>
                    <p className="font-medium">
                      {selectedAttachmentIds.length > 0
                        ? `${selectedAttachmentIds.length} file(s)`
                        : "None"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Send className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Send</h3>
              <p className="text-muted-foreground mb-6">
                You're about to send {selectedRecipientIds.length} personalized email(s) using
                the "{selectedTemplate?.name}" template
                {selectedAttachmentIds.length > 0 &&
                  ` with ${selectedAttachmentIds.length} attachment(s)`}
                .
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-left text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      Gmail API Integration Required
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 mt-1">
                      To send real emails, you need to sign in with Google and grant Gmail access.
                      This feature will be enabled once OAuth is configured.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleSend}
                disabled={isSending}
                className="gap-2"
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send {selectedRecipientIds.length} Email(s)
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Send Emails</h1>
        <p className="text-muted-foreground">
          Compose and send personalized job applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <WizardStepper steps={STEPS} currentStep={currentStep} />
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < 5 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
