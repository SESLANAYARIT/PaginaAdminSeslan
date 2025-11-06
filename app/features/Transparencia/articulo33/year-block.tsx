import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Calendar, Trash2 } from "lucide-react";
import type {
  DataPoint,
  FileData,
  Section,
} from "~/interfaces/Article33/types/article33.types";
import { toast } from "sonner";
import { FileManager } from "./File-manager";
import { DeleteYearDialog } from "./Delete-year-dialog";
import {
  deleteDataPoint,
  patchDataPoint,
} from "~/api/Article33/datapoints.api";
import { deleteFile } from "~/api/Article33/files.api";
import { getUrlS3 } from "~/api/files";

interface YearBlockProps {
  year: number;
  dataPoints: DataPoint[];
  sectionId: string;
  currentSection: Section | undefined;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  sections: Section[];
  selectedSection: string | undefined;
  setSelectedDataPoint: React.Dispatch<
    React.SetStateAction<{
      sectionId: string;
      year: number;
      period: string;
    } | null>
  >;
  setIsUploadFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function YearBlock({
  year,
  dataPoints,
  sectionId,
  currentSection,
  setSections,
  sections,
  selectedSection,
  setSelectedDataPoint,
  setIsUploadFileOpen,
}: YearBlockProps) {
  const [showDeleteYearDialog, setShowDeleteYearDialog] = useState(false);

  const sortedDataPoints = dataPoints.sort((a, b) => {
    const periodOrder = [
      "ANUAL",
      "S1",
      "S2",
      "Q1",
      "Q2",
      "Q3",
      "Q4",
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
      "B6",
    ];
    return periodOrder.indexOf(a.period) - periodOrder.indexOf(b.period);
  });
  const isYearActive =
    dataPoints.length > 0 ? dataPoints[0].active !== false : true;

  const handleYearDelete = () => {
    deleteYear(year);
    setShowDeleteYearDialog(false);
  };

  const handleYearToggle = (checked: boolean) => {
    if (!selectedSection) return;
    patchDataPoint(selectedSection, { active: checked, year });
    toggleYear(year, checked);
  };

  const deleteYear = (year: number) => {
    if (!currentSection) return;
    deleteDataPoint({ sectionId, year });
    const updatedSections = sections.map((section) => {
      if (section.id === selectedSection) {
        return {
          ...section,
          data: section.data.filter((d) => d.year !== year),
        };
      }
      return section;
    });
    setSections(updatedSections);
    toast.success("El año ha sido eliminado correctamente.");
  };

  const openFileUpload = (sectionId: string, year: number, period: string) => {
    setSelectedDataPoint({
      sectionId,
      year,
      period,
    });
    setIsUploadFileOpen(true);
  };
  const downloadFile = async(file: FileData) => {
    if (!file.url) {
      toast("No se encontró la URL del archivo.");
      return;
    }
    toast("Descargando archivo...");
    // Crear un enlace temporal
    const link = document.createElement("a");
    link.href = await getUrlS3(file.url);
    link.download = file.name; // nombre con el que se guardará
    link.target = "_blank"; // opcional, para abrir en nueva pestaña si el navegador bloquea la descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //Not used
  const deletePeriod = (year: number, period: string) => {
    if (!currentSection) return;
    const updatedSections = sections.map((section) => {
      if (section.id === selectedSection) {
        return {
          ...section,
          data: section.data.filter(
            (d) => !(d.year === year && d.period === period)
          ),
        };
      }
      return section;
    });
    setSections(updatedSections);
    toast.success("El periodo ha sido eliminado correctamente.");
  };

  const toggleYear = (year: number, isActive: boolean) => {
    if (!currentSection) return;
    const updatedSections = sections.map((section) => {
      const updateSectionData = (sec: Section): Section => {
        if (sec.id === selectedSection) {
          return {
            ...sec,
            data: sec.data.map((dataPoint) => {
              if (dataPoint.year === year) {
                return { ...dataPoint, active: isActive };
              }
              return dataPoint;
            }),
          };
        }
        if (sec.subsections) {
          return {
            ...sec,
            subsections: sec.subsections.map(updateSectionData),
          };
        }
        return sec;
      };
      return updateSectionData(section);
    });

    setSections(updatedSections);
    toast.info("El estado del año ha sido actualizado.");
  };

  const removeFile = async (sectionId: string, fileId: string) => {
    await deleteFile(fileId);
    const updatedSections = sections.map((section) => {
      const updateSectionData = (sec: Section): Section => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            data: sec.data.map((dataPoint) => {
              if (dataPoint.file?.id === fileId) {
                const { file, ...rest } = dataPoint;
                return rest;
              }
              return dataPoint;
            }),
          };
        }
        if (sec.subsections) {
          return {
            ...sec,
            subsections: sec.subsections.map(updateSectionData),
          };
        }
        return sec;
      };
      return updateSectionData(section);
    });
    setSections(updatedSections);
    toast("El archivo ha sido eliminado correctamente.");
  };

  return (
    <>
      <Card
        className={`${!isYearActive ? "opacity-60 pointer-events-none" : ""}`}
      >
        <CardHeader className="pointer-events-auto">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Año {year}
              {!isYearActive && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  Inactivo
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
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
                disabled={!isYearActive}
                onClick={() => setShowDeleteYearDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDataPoints.map((dataPoint) => (
              <FileManager
                key={`${dataPoint.year}-${dataPoint.period}`}
                dataPoint={dataPoint}
                sectionId={sectionId}
                onFileUpload={openFileUpload}
                onFileDownload={downloadFile}
                onPeriodDelete={deletePeriod}
                onFileRemove={removeFile}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <DeleteYearDialog
        open={showDeleteYearDialog}
        onOpenChange={setShowDeleteYearDialog}
        year={year}
        periodsCount={dataPoints.length}
        onConfirm={handleYearDelete}
      />
    </>
  );
}
