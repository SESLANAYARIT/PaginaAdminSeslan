import { useEffect, useRef } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Upload,
  type File,
  X,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type {
  DataPointCP,
  FileDataCP,
} from "~/interfaces/PublicAccount/publicAccount";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteFilePA, uploadFilePA } from "~/api/PublicAccount/files";
import { getUrlS3 } from "~/api/files";

interface PeriodFileUploadProps {
  year: number;
  period: DataPointCP["period"];
  fileData?: FileDataCP;
  onFileChange: (fileData?: FileDataCP) => void;
}

export function PeriodFileUpload({
  year,
  period,
  fileData,
  onFileChange,
}: PeriodFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
        toast.error(
          `El archivo ${selectedFile.name} (${sizeInMB} MB) supera el límite de 20 MB. Por favor, selecciona un archivo más pequeño.`
        );
        return;
      }

      const allowedTypes = [".pdf", ".xls", ".xlsx", ".csv"];
      const fileExtension =
        "." + selectedFile.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`El archivo ${selectedFile.name} no es compatible.`);
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const newFileData: FileDataCP = await uploadFilePA(
        { period, year },
        formData
      );

      onFileChange(newFileData);

      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      toast.success(
        `${selectedFile.name} (${sizeInMB} MB) se ha asociado correctamente al período ${period} del año ${year}. El archivo está listo para su uso.`
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = async () => {
    if (fileData) {
      await deleteFilePA(fileData.id);
      onFileChange(undefined);
      toast.info(
        `${fileData.name} ha sido removido del período ${period} del año ${year}. El período ahora está disponible para un nuevo archivo.`
      );
    }
  };

  const handleDownloadFile = async() => {
    if (fileData?.url) {
      const a = document.createElement("a");
      a.href = await getUrlS3(fileData.url);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      const sizeInMB = (fileData.size / (1024 * 1024)).toFixed(2);
      toast.success(
        `Descargando ${fileData.name} (${sizeInMB} MB) del período ${period} ${year}. El archivo se guardará en tu carpeta de descargas.`
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getPeriodLabel = (period: DataPointCP["period"]) => {
    switch (period) {
      case "ANUAL":
        return "Anual";
      case "Q1":
        return "Q1";
      case "Q2":
        return "Q2";
      case "Q3":
        return "Q3";
      case "Q4":
        return "Q4";
      default:
        return period;
    }
  };

  const getPeriodColor = (period: DataPointCP["period"]) => {
    switch (period) {
      case "ANUAL":
        return "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100";
      case "Q1":
        return "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100";
      case "Q2":
        return "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100";
      case "Q3":
        return "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100";
      case "Q4":
        return "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100";
      default:
        return "border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100";
    }
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

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "xls":
      case "xlsx":
        return "📊";
      case "csv":
        return "📈";
      default:
        return "📁";
    }
  };

  return (
    <Card
      className={`${getPeriodColor(period)} transition-all hover:shadow-lg hover:scale-105 border-2`}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-800">
              {getPeriodLabel(period)}
            </span>
            {fileData ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>

          {fileData ? (
            <div className="space-y-3">
              <div className="bg-white rounded-lg border-2 border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">
                    {getFileTypeIcon(fileData.name)}
                  </span>
                  <span
                    className="text-sm font-medium truncate max-w-24"
                    title={fileData.name}
                  >
                    {fileData.name}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Tamaño: {formatFileSize(fileData.size)}</div>
                  <div>
                    Subido:{" "}
                    {new Date(fileData.uploadDate).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadFile}
                  className="flex-1 text-xs bg-white hover:bg-slate-50"
                  title={`Descargar ${fileData.name}`}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Descargar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveFile}
                  className="px-2"
                  title={`Eliminar ${fileData.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-6 hover:border-slate-400 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Sin archivo</p>
                <p className="text-xs text-slate-400 mt-1">Máximo 10 MB</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleUploadClick}
                className="w-full text-xs bg-white hover:bg-slate-50 border-2"
                title="Subir archivo para este período"
              >
                <Upload className="w-3 h-3 mr-1" />
                Subir Archivo
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.xls,.xlsx,.csv,"
          />
        </div>
      </CardContent>
    </Card>
  );
}
