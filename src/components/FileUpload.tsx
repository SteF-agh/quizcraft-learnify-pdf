import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  accept: string;
}

export const FileUpload = ({ onUpload, isUploading, accept }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      await onUpload(files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      await onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-8 transition-colors
        ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
        ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={isUploading}
        className="hidden"
      />
      
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-medium">
            {isUploading ? "Uploading..." : "Drop your PDF here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>
        <Button variant="outline" disabled={isUploading}>
          Select PDF
        </Button>
      </div>
    </div>
  );
};