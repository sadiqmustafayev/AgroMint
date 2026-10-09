import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  description?: string;
  acceptedTypes: string[];
  maxFiles?: number;
  initialFiles?: string[];
  onFilesSelected: (fileNames: string[]) => void;
  className?: string;
}

export function FileUploadZone({
  label,
  description,
  acceptedTypes,
  maxFiles = 5,
  initialFiles = [],
  onFilesSelected,
  className = '',
}: FileUploadZoneProps) {
  const [fileList, setFileList] = useState<string[]>(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatList = acceptedTypes.map((t) => t.toUpperCase()).join(', ');

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    const updated = Array.from(new Set([...fileList, ...names])).slice(0, maxFiles);
    setFileList(updated);
    onFilesSelected(updated);
  };

  const removeFile = (nameToRemove: string) => {
    const updated = fileList.filter((n) => n !== nameToRemove);
    setFileList(updated);
    onFilesSelected(updated);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
        <span className="text-[11px] text-slate-500">
          Max {maxFiles} files ({formatList})
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragOver
            ? 'border-mint-500 bg-mint-50/50'
            : 'border-slate-300 bg-slate-50/60 hover:border-mint-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          multiple
          className="sr-only"
          accept={acceptedTypes.map((t) => `.${t}`).join(',')}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="rounded-full bg-white p-3 shadow-sm border border-slate-200">
          <UploadCloud className="w-6 h-6 text-mint-600" />
        </div>

        <p className="mt-2 text-xs font-medium text-slate-800">
          Click to upload or drag & drop documents
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {description || `Supported formats: ${formatList}`}
        </p>
      </div>

      {fileList.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {fileList.map((fileName) => {
            const isImage = /\.(png|jpe?g|webp)$/i.test(fileName);
            return (
              <span
                key={fileName}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-sm"
              >
                {isImage ? (
                  <ImageIcon className="w-3.5 h-3.5 text-mint-600" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span className="max-w-[140px] truncate">{fileName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileName);
                  }}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label={`Remove ${fileName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
