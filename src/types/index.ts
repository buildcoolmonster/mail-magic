export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: TemplateType;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 
  | "cold-application"
  | "referral"
  | "follow-up"
  | "internship"
  | "experienced";

export interface Recipient {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
  tags: string[];
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: number;
  url: string;
  file?: File;
  createdAt: Date;
}

export type AttachmentType = "resume" | "portfolio" | "cover-letter" | "other";

export interface EmailLog {
  id: string;
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  company: string;
  templateId: string;
  templateName: string;
  status: EmailStatus;
  sentAt: Date;
  openedAt?: Date;
  error?: string;
}

export type EmailStatus = "pending" | "sent" | "opened" | "failed";

export interface SendEmailPayload {
  templateId: string;
  recipientIds: string[];
  attachmentIds: string[];
  personalDetails: PersonalDetails;
  customNotes: Record<string, string>;
}

export interface PersonalDetails {
  yourName: string;
  yourEmail: string;
  yourPhone: string;
  yourRole: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}
