"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  maxFiles = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif"],
  className = "",
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    setIsActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setIsActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
      onFilesAdded?.(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
      onFilesAdded?.(selectedFiles);
    }
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = Array.from(fileList)
      .slice(0, maxFiles)
      .map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file, index) => {
      simulateUpload(file.id, index * 500);
    });
  };

  const simulateUpload = (fileId: string, delay: number) => {
    setTimeout(() => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((file) => {
            if (file.id === fileId) {
              const newProgress = Math.min(
                file.progress + Math.random() * 20,
                100
              );
              const newStatus = newProgress === 100 ? "completed" : "uploading";
              return { ...file, progress: newProgress, status: newStatus };
            }
            return file;
          })
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((file) =>
            file.id === fileId
              ? { ...file, progress: 100, status: "completed" }
              : file
          )
        );
      }, 3000);
    }, delay);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div
          ref={dropZoneRef}
          className={`
            relative w-full max-w-md aspect-square rounded-full border-2 border-dashed
            transition-all duration-500 cursor-pointer
            ${
              isDragOver
                ? "border-purple-400 bg-purple-500/10 scale-110"
                : "border-gray-600 hover:border-purple-500"
            }
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            animation: isActive
              ? "cosmicPulse 2s ease-in-out infinite"
              : "none",
          }}>
          {/* Black Hole Core */}
          <div className="absolute inset-8 rounded-full bg-gradient-radial from-black via-purple-900/50 to-transparent">
            <div
              className="w-full h-full rounded-full bg-gradient-conic from-purple-500 via-blue-500 to-emerald-500"
              style={{
                animation: isActive
                  ? "blackHoleRotate 3s linear infinite"
                  : "blackHoleRotate 10s linear infinite",
                mask: "radial-gradient(circle, transparent 60%, black 70%)",
                WebkitMask:
                  "radial-gradient(circle, transparent 60%, black 70%)",
              }}
            />

            {/* Event Horizon */}
            <div className="absolute inset-4 rounded-full bg-black border border-purple-500/30">
              <div className="absolute inset-2 rounded-full bg-gradient-radial from-purple-500/20 to-black">
                {/* Singularity */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Orbital Particles */}
          {isActive && (
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full"
                  style={
                    {
                      "--orbit-radius": `${80 + i * 10}px`,
                      animation: `particleOrbit ${
                        3 + i * 0.5
                      }s linear infinite`,
                      animationDelay: `${i * 0.2}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}

          {/* Upload Icon and Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <motion.div
              animate={{
                scale: isDragOver ? 1.2 : 1,
                rotate: isActive ? 360 : 0,
              }}
              transition={{ duration: 0.5 }}>
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2">
              {isDragOver
                ? "Release into the void"
                : "Drag files into the black hole"}
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              Or click to select files from your device
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept={acceptedTypes.join(",")}
          />
        </div>
      </div>
  );
}
