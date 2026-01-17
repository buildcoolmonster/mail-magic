import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { EmailTemplate, TemplateType } from "@/types";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

const defaultTemplates: EmailTemplate[] = [
  {
    id: "default-cold",
    name: "Cold Application - Frontend Developer",
    subject: "Application for {{job_role}} Position at {{company_name}}",
    body: `Hi {{hr_name}},

I hope this email finds you well. I'm {{your_name}}, a passionate {{your_role}} with expertise in building modern web applications.

I'm writing to express my strong interest in the {{job_role}} position at {{company_name}}. Your company's work on innovative solutions has truly impressed me.

I bring experience in:
• React, TypeScript, and modern frontend frameworks
• Building scalable and performant applications
• Collaborating with cross-functional teams

I've attached my resume for your review. I would love the opportunity to discuss how my skills align with your team's needs.

Thank you for considering my application.

Best regards,
{{your_name}}
{{your_phone}}
{{linkedin}}`,
    type: "cold-application",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "default-followup",
    name: "Follow-Up Email",
    subject: "Following Up - {{job_role}} Application at {{company_name}}",
    body: `Hi {{hr_name}},

I hope you're doing well. I wanted to follow up on my application for the {{job_role}} position that I submitted last week.

I remain very interested in joining {{company_name}} and contributing to your team. Please let me know if you need any additional information from my end.

Looking forward to hearing from you.

Best regards,
{{your_name}}`,
    type: "follow-up",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage<EmailTemplate[]>(
    "email-templates",
    defaultTemplates
  );

  const addTemplate = useCallback((
    template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">
  ) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success("Template created successfully");
    return newTemplate;
  }, [setTemplates]);

  const updateTemplate = useCallback((
    id: string,
    updates: Partial<Omit<EmailTemplate, "id" | "createdAt">>
  ) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      )
    );
    toast.success("Template updated successfully");
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success("Template deleted");
  }, [setTemplates]);

  const getTemplateById = useCallback((id: string) => {
    return templates.find(t => t.id === id);
  }, [templates]);

  const getTemplatesByType = useCallback((type: TemplateType) => {
    return templates.filter(t => t.type === type);
  }, [templates]);

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    getTemplatesByType,
  };
}
