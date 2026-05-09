import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyInitial = {
  name: "",
  email: "",
  weight: "",
  height: "",
  age: "",
  profileImageUrl: "",
};

export function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  onChangePhoto,
}) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(() => ({ ...emptyInitial, ...initialData }));

  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...emptyInitial, ...initialData });
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    onChangePhoto?.(file);
    setForm((prev) => {
      if (prev.profileImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.profileImageUrl);
      }
      return { ...prev, profileImageUrl: URL.createObjectURL(file) };
    });
  };

  const handleSave = () => {
    onSave({ ...form });
    onClose();
  };

  const initials = form.name
    ? form.name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/75"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative z-[1] grid w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-xl dark:shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm p-1 text-foreground/70 opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-border px-6 pb-4 pt-6 pr-14">
          <div className="space-y-1.5 text-left">
            <h2 id="edit-profile-title" className="text-xl font-semibold tracking-tight">
              Edit profile
            </h2>
            <p className="text-sm text-muted-foreground">Update your photo and personal details.</p>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              {form.profileImageUrl ? (
                <img src={form.profileImageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-medium">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                Change photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">PNG or JPG, up to 5 MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-profile-name" className="text-xs text-muted-foreground">
              Name
            </Label>
            <Input
              id="edit-profile-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-profile-email" className="text-xs text-muted-foreground">
              Email
            </Label>
            <Input
              id="edit-profile-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-profile-weight" className="text-xs text-muted-foreground">
                Weight (kg)
              </Label>
              <Input
                id="edit-profile-weight"
                inputMode="decimal"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profile-height" className="text-xs text-muted-foreground">
                Height (cm)
              </Label>
              <Input
                id="edit-profile-height"
                inputMode="numeric"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profile-age" className="text-xs text-muted-foreground">
                Age
              </Label>
              <Input
                id="edit-profile-age"
                inputMode="numeric"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button type="button" variant="ghost" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="rounded-full px-6" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
