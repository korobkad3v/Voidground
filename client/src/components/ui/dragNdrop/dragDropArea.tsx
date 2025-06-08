"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Image,
  X,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
}

interface DropZoneProps {
  onFilesAdded?: (files: FileList) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function DragDropArea({
  onFilesAdded,
  maxFiles = 5,
  acceptedTypes = [],
  className,
}: DropZoneProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = [];
    const currentCount = files.length;

    Array.from(fileList).forEach((file, index) => {
      if (
        (acceptedTypes.length === 0 || acceptedTypes.includes(file.type)) &&
        currentCount + newFiles.length < maxFiles
      ) {
        newFiles.push({
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: "uploading",
          progress: 0,
        });
      }
    });

    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);

    // Simulate upload
    newFiles.forEach((file) => simulateUpload(file.id));

    if (onFilesAdded) {
      onFilesAdded(fileList);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: progress >= 100 ? 100 : progress,
                status: progress >= 100 ? "completed" : "uploading",
              }
            : f
        )
      );
      progress += 10;
      if (progress > 100) clearInterval(interval);
    }, 100);
  };

  const openFileDialog = () => inputRef.current?.click();

  return (
    <div className={cn("space-y-4 flex flex-col items-center", className)}>
      <div
        ref={dropZoneRef}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-48 h-48 grow rounded-full border-4 border-dashed flex items-center justify-center text-center cursor-pointer transition-colors duration-300`}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          hidden
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
        />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className="w-8 h-8 text-gray-500 mb-2 mx-auto" />
          <p className="text-sm text-gray-500 px-2">Click or drag files here</p>
        </motion.div>
      </div>

      <div className="w-64 space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md text-sm"
          >
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{file.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {file.status === "completed" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
              )}
              <X
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f.id !== file.id))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
