import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { EmailLog, EmailStatus } from "@/types";
import { generateId } from "@/lib/utils";

export function useEmailLogs() {
  const [logs, setLogs] = useLocalStorage<EmailLog[]>("email-logs", []);

  const addLog = useCallback((
    log: Omit<EmailLog, "id" | "sentAt">
  ) => {
    const newLog: EmailLog = {
      ...log,
      id: generateId(),
      sentAt: new Date(),
    };
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  }, [setLogs]);

  const updateLogStatus = useCallback((
    id: string,
    status: EmailStatus,
    error?: string
  ) => {
    setLogs(prev =>
      prev.map(log =>
        log.id === id
          ? {
              ...log,
              status,
              error,
              ...(status === "opened" ? { openedAt: new Date() } : {}),
            }
          : log
      )
    );
  }, [setLogs]);

  const getLogsByStatus = useCallback((status: EmailStatus) => {
    return logs.filter(log => log.status === status);
  }, [logs]);

  const getStats = useCallback(() => {
    return {
      total: logs.length,
      sent: logs.filter(l => l.status === "sent").length,
      opened: logs.filter(l => l.status === "opened").length,
      failed: logs.filter(l => l.status === "failed").length,
      pending: logs.filter(l => l.status === "pending").length,
    };
  }, [logs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  return {
    logs,
    addLog,
    updateLogStatus,
    getLogsByStatus,
    getStats,
    clearLogs,
  };
}
