import type { SevacDataPoint } from "~/interfaces/Sevac/sevac.type";
import { FileText, Calendar, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface DataSummaryProps {
  dataPoints: SevacDataPoint[];
  years: number[];
}

export const DataSummary = ({ dataPoints, years }: DataSummaryProps) => {
  const getStats = () => {
    const totalFiles = dataPoints.length;

    const filesByYear = years.map((year) => ({
      year,
      files: dataPoints.filter((d) => d.year === year).length,
    }));

    return {
      totalYears: years.length,
      totalFiles,
      filesByYear,
    };
  };

  const stats = getStats();

  if (stats.totalYears === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Archive className="w-5 h-5" />
          Resumen de Datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <div className="text-sm text-green-600">Archivos Totales</div>
          </div>
        </div>

        {stats.filesByYear.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 text-slate-800">
              Archivos por Año
            </h4>
            <div className="space-y-2">
              {stats.filesByYear.map(({ year, files }) => (
                <div
                  key={year}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="font-medium text-slate-800">Año {year}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">
                      {files} archivo{files !== 1 ? "s" : ""}
                    </span>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {files}
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
};
