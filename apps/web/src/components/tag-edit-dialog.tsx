import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@quanta/ui/dialog';
import { Input } from '@quanta/ui/input';
import { Badge } from '@quanta/ui/badge';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';

interface TagEditDialogProps {
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TagEditDialog({ name, open, setOpen }: TagEditDialogProps) {
  const {
    useTagLive,
    useTagChildrenLive,
    updateTag,
    addChildTag,
    removeChildTag,
  } = useTagModelLocal();
  const tag = useTagLive(name);
  const children = useTagChildrenLive(name);
  const [tagName, setTagName] = useState('');
  const [isSavingTagName, setIsSavingTagName] = useState(false);
  const [newChildTagName, setNewChildTagName] = useState('');
  const [isAddingChildTag, setIsAddingChildTag] = useState(false);

  const handleSaveTagName = () => {
    try {
      setIsSavingTagName(true);
      updateTag(tag?.name, { name: tagName });
    } finally {
      setIsSavingTagName(false);
      setTagName('');
    }
  };

  const handleAddChildTag = async () => {
    try {
      setIsAddingChildTag(true);
      addChildTag(tag?.name, newChildTagName);
    } finally {
      setIsAddingChildTag(false);
      setNewChildTagName('');
    }
  };

  const handleRemoveChildTag = (name: string) => {
    removeChildTag(tag?.name, name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>Edit Tag: #{tag?.name}</DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label htmlFor="tagName" className="text-sm font-medium">
              Tag Name
            </label>

            <div className="flex items-center gap-2">
              <Input
                id="tagName"
                value={tagName}
                onChange={(event) => setTagName(event.target.value)}
                placeholder="Enter tag name"
                className="flex-1"
              />

              <Button
                onClick={handleSaveTagName}
                size="icon"
                disabled={isSavingTagName || !tagName.trim()}
              >
                <Save />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="childTag" className="text-sm font-medium">
              Add Child Tag
            </label>

            <div className="flex items-center gap-2">
              <Input
                id="childTag"
                value={newChildTagName}
                onChange={(e) => setNewChildTagName(e.target.value)}
                placeholder="Enter child tag name"
                className="flex-1"
              />
              <Button
                onClick={handleAddChildTag}
                size="icon"
                disabled={isAddingChildTag || !newChildTagName.trim()}
              >
                <Plus />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Child Tags</label>
            <div className="flex flex-wrap gap-2">
              {children.length === 0 ? (
                <p className="text-muted-foreground text-sm">No child tags</p>
              ) : (
                children.map((child) => (
                  <div key={child.id} className="group relative">
                    <Badge variant="outline" className="pr-6">
                      #{child.name}
                    </Badge>
                    <button
                      onClick={() => handleRemoveChildTag(child.name)}
                      className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Remove ${child.name}`}
                    >
                      <X className="text-muted-foreground hover:text-destructive h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
