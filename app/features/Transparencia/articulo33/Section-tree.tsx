import type React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import type { Section } from "~/interfaces/Article33/types/article33.types";
import { EditSectionDialog } from "./Edit-section-dialog";
import { DeleteSectionDialog } from "./Delete-section-dialog";
import { toast } from "sonner";
import { deleteSection as deleteSectionApi, updateSection } from "~/api/Article33/sections.api";

interface SectionTreeProps {
  sections: Section[];
  selectedSection: string | undefined;
  expandedSections: Set<string>;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  setSelectedSection: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSectionSelect: (sectionId: string) => void;
  setExpandedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function SectionTree({
  sections,
  selectedSection,
  expandedSections,
  setSections,
  setSelectedSection,
  onSectionSelect,
  setExpandedSections,
}: SectionTreeProps) {
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    sectionId: string;
    sectionName: string;
  }>({
    open: false,
    sectionId: "",
    sectionName: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    sectionId: string;
    sectionName: string;
    hasSubsections: boolean;
    fileCount: number;
  }>({
    open: false,
    sectionId: "",
    sectionName: "",
    hasSubsections: false,
    fileCount: 0,
  });

  const countTotalFiles = (section: Section): number => {
    let count = section.data.length;
    if (section.subsections) {
      section.subsections.forEach((subsection) => {
        count += countTotalFiles(subsection);
      });
    }
    return count;
  };

  const handleEditSection = (section: Section) => {
    setEditDialog({
      open: true,
      sectionId: section.id,
      sectionName: section.name,
    });
  };

  const handleDeleteSection = (section: Section) => {
    const totalFiles = countTotalFiles(section);
    setDeleteDialog({
      open: true,
      sectionId: section.id,
      sectionName: section.name,
      hasSubsections: !!(section.subsections && section.subsections.length > 0),
      fileCount: totalFiles,
    });
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const editSection = async (sectionId: string, newName: string) => {
    await updateSection({ id: sectionId, name: newName });
    const updateSectionName = (sectionList: Section[]): Section[] => {
      return sectionList.map((section) => {
        if (section.id === sectionId) {
          return { ...section, name: newName };
        }
        if (section.subsections) {
          return {
            ...section,
            subsections: updateSectionName(section.subsections),
          };
        }
        return section;
      });
    };

    setSections(updateSectionName(sections));
    toast.success("Sección renombrada");
  };

  const deleteSection = async (sectionId: string) => {
    await deleteSectionApi(sectionId);
    const removeSectionRecursively = (sectionList: Section[]): Section[] => {
      return sectionList
        .filter((section) => section.id !== sectionId)
        .map((section) => ({
          ...section,
          subsections: section.subsections
            ? removeSectionRecursively(section.subsections)
            : undefined,
        }));
    };

    setSections(removeSectionRecursively(sections));

    // If the deleted section was selected, select the first available section
    if (selectedSection === sectionId) {
      const remainingSections = removeSectionRecursively(sections);
      const allRemainingSections = getAllSectionsFromList(remainingSections);
      setSelectedSection(allRemainingSections[0]?.id || "");
    }
    toast.success("Sección eliminada");
  };

  const getAllSectionsFromList = (sectionList: Section[]): Section[] => {
    const allSections: Section[] = [];
    const addSectionsRecursively = (sections: Section[]) => {
      for (const section of sections) {
        allSections.push(section);
        if (section.subsections) {
          addSectionsRecursively(section.subsections);
        }
      }
    };
    addSectionsRecursively(sectionList);
    return allSections;
  };

  const renderSectionTree = (
    sectionList: Section[],
    level = 0
  ): React.ReactNode => {
    return sectionList.map((section) => (
      <div key={section.id} className={`${level > 0 ? "ml-6" : ""}`}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 group ${
            selectedSection === section.id
              ? "bg-blue-50 border-l-4 border-blue-500"
              : ""
          }`}
        >
          <div
            className="flex items-center gap-2 flex-1"
            onClick={() => onSectionSelect(section.id)}
          >
            {section.subsections && section.subsections.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionExpansion(section.id);
                }}
              >
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <FolderOpen className="h-4 w-4" />
            <span className="font-medium">{section.name}</span>
            <Badge variant="secondary" className="ml-auto">
              {section.data.length}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditSection(section)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteSection(section)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {section.subsections && expandedSections.has(section.id) && (
          <div className="mt-1">
            {renderSectionTree(section.subsections, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">{renderSectionTree(sections)}</div>

      <EditSectionDialog
        open={editDialog.open}
        onOpenChange={(open: boolean) => setEditDialog({ ...editDialog, open })}
        sectionName={editDialog.sectionName}
        onConfirm={(newName: string) =>
          editSection(editDialog.sectionId, newName)
        }
      />

      <DeleteSectionDialog
        open={deleteDialog.open}
        onOpenChange={(open: boolean) =>
          setDeleteDialog({ ...deleteDialog, open })
        }
        sectionName={deleteDialog.sectionName}
        hasSubsections={deleteDialog.hasSubsections}
        fileCount={deleteDialog.fileCount}
        onConfirm={() => deleteSection(deleteDialog.sectionId)}
      />
    </>
  );
}
