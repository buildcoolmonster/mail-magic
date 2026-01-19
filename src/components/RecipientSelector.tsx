import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import { Recipient } from "@/types";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface RecipientSelectorProps {
  recipients: Recipient[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function RecipientSelector({
  recipients,
  selectedIds,
  onSelectionChange,
}: RecipientSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    recipients.forEach((r) => r.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [recipients]);

  const filteredRecipients = useMemo(() => {
    return recipients.filter((r) => {
      const matchesSearch =
        !search ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.company?.toLowerCase().includes(search.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => r.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [recipients, search, selectedTags]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredRecipients.map((r) => r.id);
    const allSelected = allFilteredIds.every((id) => selectedIds.includes(id));
    
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !allFilteredIds.includes(id)));
    } else {
      onSelectionChange([...new Set([...selectedIds, ...allFilteredIds])]);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (recipients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No recipients added yet.</p>
        <p className="text-sm mt-1">Go to the Recipients page to add contacts first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {selectedIds.length} of {recipients.length} selected
        </span>
        <button
          onClick={handleSelectAll}
          className="text-primary hover:underline"
        >
          {filteredRecipients.every((r) => selectedIds.includes(r.id))
            ? "Deselect filtered"
            : "Select all filtered"}
        </button>
      </div>

      <div className="grid gap-2 max-h-[400px] overflow-y-auto">
        {filteredRecipients.map((recipient) => (
          <Card
            key={recipient.id}
            className={cn(
              "p-3 cursor-pointer transition-all hover:bg-accent",
              selectedIds.includes(recipient.id) && "ring-2 ring-primary bg-accent"
            )}
            onClick={() => handleToggle(recipient.id)}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedIds.includes(recipient.id)}
                onCheckedChange={() => handleToggle(recipient.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {recipient.name || recipient.email}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{recipient.email}</span>
                  {recipient.company && (
                    <>
                      <span>•</span>
                      <span className="truncate">{recipient.company}</span>
                    </>
                  )}
                </div>
              </div>
              {recipient.tags && recipient.tags.length > 0 && (
                <div className="flex gap-1">
                  {recipient.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
