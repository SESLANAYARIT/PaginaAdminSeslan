"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FileText, Calendar, Archive } from "lucide-react";
import type { DataPointCP } from "~/interfaces/PublicAccount/publicAccount";

interface DataSummaryProps {
  dataPoints: DataPointCP[];
}

export function DataSummary({ dataPoints }: DataSummaryProps) {
  const getStats = () => {
    const years = [...new Set(dataPoints.map((d) => d.year))];
    const totalFiles = dataPoints.filter((d) => d.fileData).length;
    const totalPeriods = dataPoints.length;

    const filesByYear = years.map((year) => ({
      year,
      files: dataPoints.filter((d) => d.year === year && d.fileData).length,
      total: 5, // Siempre 5 periodos por año
    }));

    return {
      totalYears: years.length,
      totalFiles,
      totalPeriods,
      filesByYear,
    };
  };

  const stats = getStats();

  if (stats.totalYears === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="w-5 h-5" />
          Resumen de Datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalYears}
            </div>
            <div className="text-sm text-blue-600">Años Configurados</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {stats.totalFiles}
            </div>
            <div className="text-sm text-green-600">Archivos Subidos</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Archive className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalFiles}/{stats.totalPeriods}
            </div>
            <div className="text-sm text-orange-600">Periodos Completados</div>
          </div>
        </div>

        {stats.filesByYear.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Archivos por Año</h4>
            <div className="space-y-2">
              {stats.filesByYear.map(({ year, files, total }) => (
                <div
                  key={year}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="font-medium">Año {year}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {files}/{total} archivos
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(files / total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
