"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Upload, X, File } from "lucide-react";
import type { FileData } from "~/interfaces/sessions.interfaces";

interface FileUploadProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  setDeletedFileIds: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  accept?: string;
}

export function FileUpload({
  files,
  onFilesChange,
  label,
  setDeletedFileIds,
  accept = "*/*",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileData[] = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      file: file, // Guardamos el archivo original para el envío
    }));

    onFilesChange([...files, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setDeletedFileIds((prev) => [...prev, fileId]);
    onFilesChange(files.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "📊";
    if (fileType.includes("image")) return "🖼️";
    return "📁";
  };

  const getAcceptedTypes = () => {
    if (accept === ".pdf,.doc,.docx") return "PDF, DOC, DOCX";
    if (accept === "*/*") return "Todos los tipos";
    return accept.toUpperCase();
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <Card
        className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50 border-solid shadow-md"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <CardContent className="p-6 text-center">
          <Upload
            className={`mx-auto h-8 w-8 mb-2 transition-colors ${
              isDragOver ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <p className="text-sm text-gray-600 mb-1">
            {isDragOver
              ? "Suelta los archivos aquí"
              : "Arrastra archivos aquí o haz clic para seleccionar"}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Tipos permitidos: {getAcceptedTypes()}
          </p>

          <input
            type="file"
            multiple
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id={`file-input-${label.replace(/\s+/g, "-").toLowerCase()}`}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              document
                .getElementById(
                  `file-input-${label.replace(/\s+/g, "-").toLowerCase()}`
                )
                ?.click()
            }
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar archivos
          </Button>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Archivos seleccionados ({files.length})
          </p>

          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-lg flex-shrink-0">
                  {getFileIcon(file.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.type || "Tipo desconocido"}</span>
                    <span>•</span>
                    <span>
                      {new Date(file.uploadDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id!);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                title="Eliminar archivo"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-2">
          <p className="text-xs text-gray-400">No hay archivos seleccionados</p>
        </div>
      )}
    </div>
  );
}
