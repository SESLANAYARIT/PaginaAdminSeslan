import { Card, CardContent } from "~/components/ui/card";
import { BarChart3, Calendar, TrendingUp, File } from "lucide-react";

interface StatsCardsProps {
  totalSections: number;
  totalYears: number;
  totalPeriods: number;
  totalFiles: number;
}

export function StatsCards({
  totalSections,
  totalYears,
  totalPeriods,
  totalFiles,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Secciones</p>
              <p className="text-2xl font-bold">{totalSections}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Años</p>
              <p className="text-2xl font-bold">{totalYears}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Períodos</p>
              <p className="text-2xl font-bold">{totalPeriods}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <File className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Archivos</p>
              <p className="text-2xl font-bold">{totalFiles}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
