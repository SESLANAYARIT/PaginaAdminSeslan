import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Trash2,
  Download,
  Calendar,
  FileText,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SevacDataPoint } from "~/interfaces/Sevac/sevac.type";
import { useState } from "react";
import { toast } from "sonner";
import type { FileData } from "~/interfaces/Article33/types/article33.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { createSevacFile } from "~/api/Sevac/sevac.api";
import { DownloadUrlS3, getUrlS3 } from "~/api/files";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { formattedDate } from "~/api/utils/dateToLocal";

interface YearManagerProps {
  year: number;
  dataPoints: SevacDataPoint[];
  onAddFile: (datapoint: SevacDataPoint) => void;
  onRemoveFile: (fileId: string) => void;
  onDeleteYear: (year: number) => void;
}

export const YearManager = ({
  year,
  dataPoints,
  onAddFile,
  onRemoveFile,
  onDeleteYear,
}: YearManagerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [expandedperiods, setExpandedPeriods] = useState<
    Record<string, boolean>
  >({
    Q1: true,
    Q2: true,
    Q3: true,
    Q4: true,
  });

  const periods: ("Q1" | "Q2" | "Q3" | "Q4")[] = ["Q1", "Q2", "Q3", "Q4"];

  const getperiodName = (period: "Q1" | "Q2" | "Q3" | "Q4") => {
    const names = {
      Q1: "Primer Trimestre",
      Q2: "Segundo Trimestre",
      Q3: "Tercer Trimestre",
      Q4: "Cuarto Trimestre",
    };
    return names[period];
  };

  const getperiodColor = (period: "Q1" | "Q2" | "Q3" | "Q4") => {
    const colors = {
      Q1: "bg-green-100 text-green-700",
      Q2: "bg-blue-100 text-blue-700",
      Q3: "bg-orange-100 text-orange-700",
      Q4: "bg-purple-100 text-purple-700",
    };
    return colors[period];
  };

  const toggleperiod = (period: "Q1" | "Q2" | "Q3" | "Q4") => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  const getperiodFiles = (period: "Q1" | "Q2" | "Q3" | "Q4") => {
    return dataPoints.filter((dp) => dp.period === period);
  };

  const handleDeleteYear = () => {
    onDeleteYear(year);
  };

  const downloadYearFiles = async () => {
    if (dataPoints.length === 0) {
      toast.error("No hay archivos para descargar");
      return;
    }

    const zip = new JSZip();

    // Filtramos solo los elementos que tengan URL y preparamos promesas de descarga
    const downloadPromises = dataPoints
      .filter((dp) => dp.fileData?.url)
      .map(async (dp) => {
        const blob = await DownloadUrlS3(dp.fileData!.url!);
        return { name: `${dp.period}_${dp.fileData!.name}`, blob };
      });

    // Esperamos todas las descargas en paralelo
    const results = await Promise.all(downloadPromises);

    // Agregamos cada archivo al ZIP
    results.forEach(({ name, blob }) => {
      zip.file(name, blob);
    });

    // Generamos y descargamos el ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `Sevac_${year}.zip`);

    toast.info(`Descargando ${dataPoints.length} archivos del año ${year}`);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    period: "Q1" | "Q2" | "Q3" | "Q4"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validaciones
        if (file.size > 20 * 1024 * 1024) {
          toast.error("El archivo supera el tamaño permitido (20MB)");
          return null;
        }

        const allowedTypes = [
          "application/pdf",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
        ];

        if (!allowedTypes.includes(file.type)) {
          toast.error("El archivo debe ser PDF, Excel o CSV");
          return null;
        }

        const formData = new FormData();
        formData.append("file", file);

        const fileData: FileData = await createSevacFile(
          { year, period },
          formData
        );
        return {
          year,
          fileData,
          active: true,
          period,
        };
      });

      const results = await Promise.all(uploadPromises);
      results.forEach((res) => res && onAddFile(res));
    } finally {
      event.target.value = "";
    }
  };

  const downloadFile = async (fileData: FileData) => {
    if (fileData.url) {
      const a = document.createElement("a");
      a.href = await getUrlS3(fileData.url);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    toast.info(`Descargando ${fileData.name} del año ${year}`);
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


  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Año {year}
                </CardTitle>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {dataPoints.length} archivo
                  {dataPoints.length !== 1 ? "s" : ""} en 4 trimestres
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-white hover:bg-slate-50"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Contraer
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Expandir
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadYearFiles}
              disabled={dataPoints.length === 0}
              className="bg-white hover:bg-slate-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Todo
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Año
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar año?</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro que desea eliminar este año? Esta acción no se
                    puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteYear();
                    }}
                    className="bg-red-600"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {periods.map((period) => {
              const periodFiles = getperiodFiles(period);
              const isperiodExpanded = expandedperiods[period];

              return (
                <Card
                  key={period}
                  className="border border-slate-200 bg-slate-50/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getperiodColor(period)}`}
                        >
                          {period}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">
                            {getperiodName(period)}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {periodFiles.length} archivo
                            {periodFiles.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleperiod(period)}
                        className="h-8 w-8 p-0"
                      >
                        {isperiodExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isperiodExpanded && (
                    <CardContent className="pt-0 space-y-4">
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-white">
                        <div className="text-center space-y-3">
                          <div className="flex items-center justify-center">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Plus className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 mb-3">
                              Agregar archivos al {getperiodName(period)}
                            </p>
                            <Input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload(e, period)}
                              accept=".pdf,.xlsx,.xls,.csv"
                              className="max-w-sm mx-auto"
                            />
                          </div>
                        </div>
                      </div>

                      {periodFiles.length > 0 ? (
                        <div className="space-y-2">
                          {periodFiles.map((dataPoint) => (
                            <Card
                              key={dataPoint.fileData.id}
                              className="border border-slate-200 bg-white"
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                      <FileText className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h5 className="font-medium text-slate-900 truncate">
                                        {dataPoint.fileData.name}
                                      </h5>
                                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                        <span>
                                          {formatFileSize(
                                            dataPoint.fileData.size
                                          )}
                                        </span>
                                        <span>
                                          {formattedDate(
                                            dataPoint.fileData.uploadDate
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        downloadFile(dataPoint.fileData)
                                      }
                                      className="h-8 px-3"
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            ¿Eliminar archivo?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            ¿Está seguro que desea eliminar este
                                            archivo? Esta acción no se puede
                                            deshacer.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => {
                                              onRemoveFile(
                                                dataPoint.fileData.id
                                              );
                                            }}
                                            className="bg-red-600"
                                          >
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-sm text-slate-600">
                            Sin archivos en este trimestre
                          </p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
