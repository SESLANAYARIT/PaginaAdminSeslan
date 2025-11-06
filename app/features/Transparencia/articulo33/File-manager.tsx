import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FileText, File, Upload, Download, Trash2 } from "lucide-react";
import type {
  DataPoint,
  FileData,
} from "~/interfaces/Article33/types/article33.types";
import { DeleteFileDialog } from "./Delete-file-dialog";
import {  formattedDate } from "../../../api/utils/dateToLocal";
interface FileManagerProps {
  dataPoint: DataPoint;
  onFileUpload: (sectionId: string, year: number, period: string) => void;
  onFileDownload: (file: FileData) => void;
  onPeriodDelete: (year: number, period: string) => void;
  sectionId: string;
  onFileRemove: (sectionId: string, fileId: string) => void;
}

export function FileManager({
  dataPoint,
  onFileUpload,
  onFileDownload,
  onPeriodDelete,
  sectionId,
  onFileRemove,
}: FileManagerProps) {
  // const [showDeletePeriodDialog, setShowDeletePeriodDialog] = useState(false);
  const [showDeleteFileDialog, setShowDeleteFileDialog] = useState(false);

  // const handlePeriodDelete = () => {
  //   onPeriodDelete(dataPoint.year, dataPoint.period);
  //   setShowDeletePeriodDialog(false);
  // };

  const handleFileRemove = () => {
    onFileRemove(sectionId, dataPoint.file?.id!);
    setShowDeleteFileDialog(false);
  };

  return (
    <>
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{dataPoint.period}</Badge>
            </div>

            {dataPoint.file ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {dataPoint.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(dataPoint.file.size / 1024).toFixed(1)} KB •{" "}
                      {formattedDate(dataPoint.file.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onFileDownload(dataPoint.file!)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeleteFileDialog(true)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded">
                  <div className="text-center">
                    <File className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Sin archivo</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    onFileUpload(sectionId, dataPoint.year, dataPoint.period)
                  }
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Subir Archivo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* <DeletePeriodDialog
        open={showDeletePeriodDialog}
        onOpenChange={setShowDeletePeriodDialog}
        year={dataPoint.year}
        period={dataPoint.period}
        hasFile={!!dataPoint.file}
        onConfirm={handlePeriodDelete}
      /> */}
      <DeleteFileDialog
        open={showDeleteFileDialog}
        onOpenChange={setShowDeleteFileDialog}
        file={dataPoint.file!}
        period={dataPoint.period}
        year={dataPoint.year}
        onConfirm={handleFileRemove}
      />
    </>
  );
}
