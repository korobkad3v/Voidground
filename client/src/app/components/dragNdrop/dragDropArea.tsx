"use client";

import { useCallback, useState } from "react";

export default function DragDropArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      // можно передать файл в родительский компонент или API
      console.log("Dropped file:", file);
    }
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all
        ${isDragging ? "bg-blue-100 border-blue-400" : "bg-gray-100 border-gray-400"}
      `}
    >
      <p className="text-gray-700">
        {fileName ? `📄 ${fileName}` : "📂 Drag & drop a file here or click to upload"}
      </p>
    </div>
  );
}