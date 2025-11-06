import { Database, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { SevacDataPoint } from "~/interfaces/Sevac/sevac.type";
import { DataSummary } from "./Data-summary";
import { YearManager } from "./Year-manager";
import {
  createSevacDataPoint,
  deleteSevacFile,
  deleteSevacYear,
  getSevacDataPoints,
} from "~/api/Sevac/sevac.api";

export const Sevac = () => {
  const [years, setYears] = useState<number[]>([]);

  const [dataPoints, setDataPoints] = useState<SevacDataPoint[]>([]);

  const [newYear, setNewYear] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { datapoints, years } = await getSevacDataPoints();
      setDataPoints(datapoints);
      setYears(years);
    };

    fetchData();
  }, []);

  const addYear = async () => {
    const year = Number.parseInt(newYear);
    if (!year || year < 2000 || year > 2100) {
      toast.error("Por favor ingresa un año válido entre 1900 y 2100");
      return;
    }

    const existingYear = years.includes(year);
    if (existingYear) {
      toast.error(
        `El año ${year} ya existe en el sistema. Cada año debe ser único.`
      );
      return;
    }

    await createSevacDataPoint({ year });

    setYears((prev) => [...prev, year].sort((a, b) => b - a));
    setNewYear("");
    toast.success(
      `Se ha agregado el año ${year}. Ahora puedes subir cualquier cantidad de archivos para este año.`
    );
  };

  const deleteYear = async (year: number) => {
    await deleteSevacYear(year);

    const yearData = dataPoints.filter((d) => d.year === year);
    const filesCount = yearData.length;

    setYears((prev) => prev.filter((y) => y !== year));
    setDataPoints((prev) => prev.filter((d) => d.year !== year));

    toast.success(
      `El año ${year} ha sido eliminado completamente${filesCount > 0 ? ` junto con ${filesCount} archivo(s)` : ""}. Esta acción no se puede deshacer.`
    );
  };

  const addFile = (datapoint: SevacDataPoint) => {
    setDataPoints((prev) => [...prev, datapoint]);

    const sizeInMB = (datapoint.fileData.size / (1024 * 1024)).toFixed(2);
    toast.success(
      `El archivo ${datapoint.fileData.name} ha sido agregado con exito, el tamaño es de ${sizeInMB} MB`
    );
  };

  const removeFile = (fileId: string) => {
    deleteSevacFile(fileId);
    const fileToRemove = dataPoints.find((d) => d.fileData.id === fileId);
    setDataPoints((prev) => prev.filter((d) => d.fileData.id !== fileId));

    if (fileToRemove) {
      toast.success(
        `Se ha removido ${fileToRemove.fileData.name} del año ${fileToRemove.year}. Esta acción no se puede deshacer.`
      );
    }
  };

  const getYears = () => {
    return years.sort((a, b) => b - a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 text-balance">
            Sevac
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Gestiona los datos históricos organizados por año con cualquier
            cantidad de archivos
          </p>
        </div>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">
              Agregar Nuevo Año
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Año a agregar
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="2025"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="2010"
                    max="2100"
                  />
                  <Button
                    onClick={addYear}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Año
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Podrás agregar cualquier cantidad de archivos al año creado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <DataSummary dataPoints={dataPoints} years={getYears()} />{" "}
      </div>

      <div className="space-y-6">
        {getYears().length === 0 ? (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <Database className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No hay años configurados
                  </h3>
                  <p className="text-slate-600">
                    Agrega un año para comenzar a gestionar los datos históricos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          getYears().map((year) => (
            <YearManager
              key={year}
              year={year}
              dataPoints={dataPoints.filter((d) => d.year === year)}
              onAddFile={addFile}
              onRemoveFile={removeFile}
              onDeleteYear={deleteYear}
            />
          ))
        )}
      </div>
    </div>
  );
};
