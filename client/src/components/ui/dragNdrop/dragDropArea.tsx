"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { uploadToBackend } from "@/lib/upload";
import { DRAGNDROP_CONST } from "@/constants/DRAGNDROP_CONST";
import Button from "../Button";
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
  previewUrl?: string;
  originalFile: File;
}

interface DropZoneProps {
  onFilesAdded?: (files: FileList) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function DragDropArea({
  onFilesAdded,
  maxFiles = DRAGNDROP_CONST.maxFiles,
  acceptedTypes = DRAGNDROP_CONST.acceptedTypes,
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
    setFiles((prev) => {
      const newFiles: FileItem[] = [];

      Array.from(fileList).forEach((file) => {
        const isAccepted =
          acceptedTypes.length === 0 ||
          acceptedTypes.some((type) => {
            if (type.endsWith("/*")) {
              const baseType = type.split("/")[0];
              return file.type.startsWith(baseType + "/");
            }
            return file.type === type;
          });

        if (isAccepted) {
          newFiles.push({
            id: uuidv4(),
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading",
            progress: 0,
            previewUrl: URL.createObjectURL(file),
            originalFile: file,
          });
        }
      });

      const combined = [...prev, ...newFiles];

      const updatedFiles = combined.slice(-maxFiles);

      newFiles.forEach((fileItem) =>
        uploadToBackend(fileItem.originalFile).then((url) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? {
                    ...f,
                    status: "completed",
                    progress: 100,
                    previewUrl: url,
                  }
                : f
            )
          );
        })
      );

      if (onFilesAdded) {
        onFilesAdded(fileList);
      }

      return updatedFiles;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => inputRef.current?.click();

  return (
    <div className={cn("space-y-4 flex flex-col items-center", className)}>
      <input
        type="file"
        ref={inputRef}
        multiple={maxFiles > 1}
        hidden
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
      />

      {files.length === 0 ? (
        <div
          ref={dropZoneRef}
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "w-48 h-48 rounded-full border-4 border-dashed flex items-center justify-center text-center cursor-pointer transition-colors duration-300",
            isDragging ? "bg-background-primary" : "border-gray-300"
          )}>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}>
            <Upload className="w-8 h-8 mb-2 mx-auto" />
            <p className="text-sm px-2">Click or drag files here</p>
          </motion.div>
        </div>
      ) : (
        <>
          <div
            className="max-w-lg max-h-[512px] rounded overflow-hidden cursor-pointer border"
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            {files[0].status === "uploading" && (
              <div className="size-full bg-gray-200 animate-pulse rounded" />
            )}
            <img
              src={files[0].previewUrl!}
              alt={files[0].name}
              className="w-full h-full object-cover"
            />
          </div>
          {files[0].status === "completed" && (
            <a href={files[0].previewUrl!} download="processed-image.png">
              <Button>Download Image</Button>
            </a>
          )}
        </>
      )}
    </div>
  );
}
