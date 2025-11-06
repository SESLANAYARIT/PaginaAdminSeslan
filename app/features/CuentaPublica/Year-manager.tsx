import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash2, Download, Calendar, FileText } from "lucide-react";
import type { DataPointCP } from "~/interfaces/PublicAccount/publicAccount";
import { toast } from "sonner";
import { PeriodFileUpload } from "./Period-file-upload";
import { useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  changeActivePublicAccountYear,
  deleteYearPublicAccount,
} from "~/api/PublicAccount/publicAccount";
import { DownloadUrlS3, getUrlS3 } from "~/api/files";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface YearManagerProps {
  year: number;
  dataPoints: DataPointCP[];
  onUpdateFile: (
    year: number,
    period: DataPointCP["period"],
    fileData?: any
  ) => void;
  onDeleteYear: (year: number) => void;
}

export function YearManager({
  year,
  dataPoints,
  onUpdateFile,
  onDeleteYear,
}: YearManagerProps) {
  const periods: DataPointCP["period"][] = ["ANUAL", "Q1", "Q2", "Q3", "Q4"];

  const [isYearActive, setIsYearActive] = useState(dataPoints[0].active);

  const handleDeleteYear = async () => {
    await deleteYearPublicAccount(year);
    onDeleteYear(year);
  };

  const downloadYearFiles = async () => {
    const filesWithData = dataPoints.filter((dp) => dp.fileData);
    if (filesWithData.length === 0) {
      toast.error("No hay archivos para descargar");
      return;
    }

    const zip = new JSZip();

    // Filtramos solo los elementos que tengan URL y preparamos promesas de descarga
    const downloadPromises = filesWithData
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
    saveAs(content, `CuentaPublica_${year}.zip`);

    toast.success(
      `Iniciando descarga de ${filesWithData.length} archivo(s) del año ${year}. Los archivos se guardarán en tu carpeta de descargas.`
    );
  };

  const getFilesCount = () => {
    return dataPoints.filter((dp) => dp.fileData).length;
  };

  const getProgress = () => {
    return (getFilesCount() / 5) * 100;
  };

  const handleYearToggle = async (checked: boolean): Promise<void> => {
    await changeActivePublicAccountYear(year, checked);
    dataPoints = dataPoints.map((dp) => {
      dp.active = checked;
      return dp;
    });
    setIsYearActive(checked);
    toast.success(
      `Se ha ${checked ? "activado" : "desactivado"} el año ${year}`
    );
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pointer-events-auto">
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
                  {getFilesCount()} de 5 períodos completados
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div
              className={`flex items-center space-x-2 ${!isYearActive && "opacity-100"}`}
            >
              <Switch
                id={`year-${year}-active`}
                checked={isYearActive}
                onCheckedChange={handleYearToggle}
              />
              <Label htmlFor={`year-${year}-active`} className="text-sm">
                {isYearActive ? "Activo" : "Inactivo"}
              </Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadYearFiles}
              disabled={getFilesCount() === 0}
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
      <CardContent
        className={`p-6 ${!isYearActive && "opacity-40 pointer-events-none"} `}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {periods.map((period) => {
            const dataPoint = dataPoints.find((dp) => dp.period === period);
            return (
              <PeriodFileUpload
                key={period}
                year={year}
                period={period}
                fileData={dataPoint?.fileData}
                onFileChange={(fileData) =>
                  onUpdateFile(year, period, fileData)
                }
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
