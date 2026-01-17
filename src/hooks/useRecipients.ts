import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Recipient } from "@/types";
import { generateId, isValidEmail, parseCSV } from "@/lib/utils";
import { toast } from "sonner";

export function useRecipients() {
  const [recipients, setRecipients] = useLocalStorage<Recipient[]>("recipients", []);

  const addRecipient = useCallback((
    recipient: Omit<Recipient, "id" | "createdAt">
  ) => {
    if (!isValidEmail(recipient.email)) {
      toast.error("Invalid email address");
      return null;
    }

    // Check for duplicates
    const exists = recipients.find(
      r => r.email.toLowerCase() === recipient.email.toLowerCase()
    );
    if (exists) {
      toast.error("This email already exists in your recipients");
      return null;
    }

    const newRecipient: Recipient = {
      ...recipient,
      id: generateId(),
      createdAt: new Date(),
    };
    setRecipients(prev => [...prev, newRecipient]);
    toast.success("Recipient added successfully");
    return newRecipient;
  }, [recipients, setRecipients]);

  const addRecipientsFromCSV = useCallback((csvText: string) => {
    const data = parseCSV(csvText);
    if (data.length === 0) {
      toast.error("No valid data found in CSV");
      return 0;
    }

    let added = 0;
    let skipped = 0;

    data.forEach(row => {
      const email = row.email || row.e_mail || row["e-mail"];
      if (!email || !isValidEmail(email)) {
        skipped++;
        return;
      }

      const exists = recipients.find(
        r => r.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        skipped++;
        return;
      }

      const newRecipient: Recipient = {
        id: generateId(),
        email,
        name: row.name || row.hr_name || "",
        company: row.company || row.company_name || "",
        role: row.role || row.position || "HR",
        tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()) : [],
        createdAt: new Date(),
      };

      setRecipients(prev => [...prev, newRecipient]);
      added++;
    });

    if (added > 0) {
      toast.success(`Added ${added} recipients${skipped > 0 ? `, ${skipped} skipped` : ""}`);
    } else {
      toast.error("No new recipients added");
    }

    return added;
  }, [recipients, setRecipients]);

  const updateRecipient = useCallback((
    id: string,
    updates: Partial<Omit<Recipient, "id" | "createdAt">>
  ) => {
    setRecipients(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
    toast.success("Recipient updated");
  }, [setRecipients]);

  const deleteRecipient = useCallback((id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    toast.success("Recipient deleted");
  }, [setRecipients]);

  const getRecipientsByTags = useCallback((tags: string[]) => {
    if (tags.length === 0) return recipients;
    return recipients.filter(r =>
      tags.some(tag => r.tags.includes(tag))
    );
  }, [recipients]);

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    recipients.forEach(r => r.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [recipients]);

  return {
    recipients,
    addRecipient,
    addRecipientsFromCSV,
    updateRecipient,
    deleteRecipient,
    getRecipientsByTags,
    getAllTags,
  };
}
