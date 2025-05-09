
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

export const KeyboardShortcutsHelp: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" title="Keyboard Shortcuts">
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate quickly
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Navigation</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Home Page</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + H</kbd>
              </li>
              <li className="flex justify-between">
                <span>Products Page</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + P</kbd>
              </li>
              <li className="flex justify-between">
                <span>VIP Page</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Alt + V</kbd>
              </li>
              <li className="flex justify-between">
                <span>Documentation Page</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + D</kbd>
              </li>
              <li className="flex justify-between">
                <span>Community Page</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + Shift + C</kbd>
              </li>
              <li className="flex justify-between">
                <span>Track Orders</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + T, then O</kbd>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Mode Toggles</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Toggle Admin Mode</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Alt + Shift + A</kbd>
              </li>
              <li className="flex justify-between">
                <span>Toggle Employee Mode</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Alt + Shift + E</kbd>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
