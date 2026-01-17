import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Attachment, AttachmentType } from "@/types";
import { generateId, formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export function useAttachments() {
  const [attachments, setAttachments] = useLocalStorage<Attachment[]>("attachments", []);
  const [isUploading, setIsUploading] = useState(false);

  const addAttachment = useCallback(async (
    file: File,
    type: AttachmentType
  ): Promise<Attachment | null> => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return null;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload PDF, DOC, DOCX, PNG, or JPG files.");
      return null;
    }

    setIsUploading(true);

    try {
      // Create a data URL for local storage (in production, upload to cloud storage)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const newAttachment: Attachment = {
        id: generateId(),
        name: file.name,
        type,
        size: file.size,
        url: dataUrl,
        createdAt: new Date(),
      };

      setAttachments(prev => [...prev, newAttachment]);
      toast.success(`${file.name} uploaded successfully`);
      return newAttachment;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [setAttachments]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    toast.success("Attachment removed");
  }, [setAttachments]);

  const getAttachmentsByType = useCallback((type: AttachmentType) => {
    return attachments.filter(a => a.type === type);
  }, [attachments]);

  const getAttachmentById = useCallback((id: string) => {
    return attachments.find(a => a.id === id);
  }, [attachments]);

  return {
    attachments,
    isUploading,
    addAttachment,
    removeAttachment,
    getAttachmentsByType,
    getAttachmentById,
  };
}
