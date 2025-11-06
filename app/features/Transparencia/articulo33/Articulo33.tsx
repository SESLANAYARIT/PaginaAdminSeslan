import { FolderOpen, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type {
  DataPoint,
  Section,
} from "../../../interfaces/Article33/types/article33.types";
import { StatsCards } from "./Stats-cards";
import { getAllSections as getAllSectionsApi } from "~/api/Article33/sections.api";
import { CreateSectionDialog } from "./CreateSectionDialog";
import { SectionTree } from "./Section-tree";
import { CreateYearDialog } from "./Create-year-dialog";
import { YearBlock } from "./year-block";
import { FileUploadDialog } from "./File-upload-dialog";

export const Article33 = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>();
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isCreateSubsectionOpen, setIsCreateSubsectionOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [isCreateYearOpen, setIsCreateYearOpen] = useState(false);
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<{
    sectionId: string;
    year: number;
    period: string;
  } | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      const respSection = await getAllSectionsApi();
      setSections(respSection);
    };
    fetchSections();
  }, []);

  const getAllSections = (): Section[] => {
    const allSections: Section[] = [];
    const addSectionsRecursively = (sectionList: Section[]) => {
      for (const section of sectionList) {
        allSections.push(section);
        if (section.subsections) {
          addSectionsRecursively(section.subsections);
        }
      }
    };
    addSectionsRecursively(sections);
    return allSections;
  };

  const currentSection = getAllSections().find((s) => s.id === selectedSection);

  const getSectionStats = () => {
    if (!currentSection)
      return { totalYears: 0, totalPeriods: 0, totalFiles: 0 };
    const totalYears = new Set(currentSection.data.map((d) => d.year)).size;
    const totalPeriods = currentSection.data.length;
    const totalFiles = currentSection.data.filter((d) => d.file).length;
    return { totalYears, totalPeriods, totalFiles };
  };

  const stats = getSectionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Panel Administrativo del Articulo 33
          </h1>
          <p className="text-gray-600">
            Gestión de archivos históricos por año y período
          </p>
        </div>

        <StatsCards
          totalSections={getAllSections().length}
          totalYears={stats.totalYears}
          totalPeriods={stats.totalPeriods}
          totalFiles={stats.totalFiles}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Secciones
              </CardTitle>
              <div className="flex gap-1">
                <CreateSectionDialog
                  isOpen={isCreateSectionOpen}
                  onOpenChange={setIsCreateSectionOpen}
                  sections={sections}
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  setSections={setSections}
                  setIsCreateSectionOpen={setIsCreateSectionOpen}
                  setIsCreateSubsectionOpen={setIsCreateSubsectionOpen}
                  isNew={true}
                />

                {currentSection && !currentSection.parentId && (
                  <CreateSectionDialog
                    isOpen={isCreateSubsectionOpen}
                    onOpenChange={setIsCreateSubsectionOpen}
                    sections={sections}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                    setSections={setSections}
                    setIsCreateSectionOpen={setIsCreateSectionOpen}
                    setIsCreateSubsectionOpen={setIsCreateSubsectionOpen}
                    isNew={false}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <SectionTree
                sections={sections}
                selectedSection={selectedSection}
                expandedSections={expandedSections}
                onSectionSelect={setSelectedSection}
                setExpandedSections={setExpandedSections}
                setSections={setSections}
                setSelectedSection={setSelectedSection}
              />
            </CardContent>
          </Card>
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentSection ? (
              <>
                {/* Section Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {currentSection.name}
                          {currentSection.parentId && (
                            <Badge variant="outline">Subsección</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {stats.totalYears} años • {stats.totalPeriods}{" "}
                          períodos • {stats.totalFiles} archivos
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <CreateYearDialog
                          isOpen={isCreateYearOpen}
                          onOpenChange={setIsCreateYearOpen}
                          sections={sections}
                          selectedSection={selectedSection}
                          setSections={setSections}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Years and Periods */}
                <div className="space-y-4">
                  {Object.entries(
                    currentSection.data.reduce(
                      (acc, dataPoint) => {
                        if (!acc[dataPoint.year]) {
                          acc[dataPoint.year] = [];
                        }
                        acc[dataPoint.year].push(dataPoint);
                        return acc;
                      },
                      {} as Record<number, DataPoint[]>
                    )
                  )
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, dataPoints]) => (
                      <YearBlock
                        key={year}
                        year={Number(year)}
                        dataPoints={dataPoints}
                        sectionId={currentSection.id}
                        currentSection={currentSection}
                        setSections={setSections}
                        sections={sections}
                        selectedSection={selectedSection}
                        setSelectedDataPoint={setSelectedDataPoint}
                        setIsUploadFileOpen={setIsUploadFileOpen}
                      />
                    ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay sección seleccionada
                  </h3>
                  <p className="text-gray-500">
                    Selecciona una sección del panel izquierdo para comenzar.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <FileUploadDialog
          isOpen={isUploadFileOpen}
          onOpenChange={setIsUploadFileOpen}
          selectedDataPoint={selectedDataPoint}
          setIsUploadFileOpen={setIsUploadFileOpen}
          setSelectedDataPoint={setSelectedDataPoint}
          sections={sections}
          setSections={setSections}
        />
      </div>
    </div>
  );
};
