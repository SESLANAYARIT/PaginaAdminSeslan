import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus } from "lucide-react";
import type { Section } from "~/interfaces/Article33/types/article33.types";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import type { Articulo33SectionForm } from "~/interfaces/Article33/types/article33.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectionSchema } from "~/schemas/section.schema";
import {
  createSubSection as createSubSectionApi,
  createSection as createSectionapi,
} from "~/api/Article33/sections.api";

interface CreateSectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sections: Section[];
  selectedSection: string | undefined;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  setSelectedSection: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsCreateSectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreateSubsectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
}

export function CreateSectionDialog({
  isOpen,
  onOpenChange,
  setSections,
  sections,
  selectedSection,
  setSelectedSection,
  setIsCreateSectionOpen,
  setIsCreateSubsectionOpen,
  isNew,
}: CreateSectionDialogProps) {
  const defaultValues: Articulo33SectionForm = {
    name: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Articulo33SectionForm>({
    resolver: zodResolver(sectionSchema),
    mode: "onBlur",
    defaultValues,
  });

  const createSection = (newSection: Section) => {
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
    setIsCreateSectionOpen(false);
    toast.success("Sección creada");
  };

  const createSubsection = (newSubsection: Section) => {
    const updatedSections = sections.map((section) => {
      if (section.id === selectedSection) {
        return {
          ...section,
          subsections: [...(section.subsections || []), newSubsection],
        };
      }
      return section;
    });
    setSections(updatedSections);
    setIsCreateSubsectionOpen(false);
    toast.success("Subsección creada");
  };

  const handleSectionSubmit = async (formDataInf: Articulo33SectionForm) => {
    const res = isNew
      ? await createSectionapi(formDataInf)
      : await createSubSectionApi({
          ...formDataInf,
          parentId: selectedSection!,
        });
    if (isNew) {
      createSection(res);
    } else {
      createSubsection(res);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1" onClick={() => reset()}>
          <Plus className="h-4 w-4 mr-1" />
          {isNew ? "Sección" : "SubSección"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(handleSectionSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Crear Sección" : "Crear Subsección"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la Sección</Label>
              <Input
                id="name"
                {...register("name")}
                className="focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el nombre de la sección"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {isNew ? "Crear Sección" : "Crear Subsección"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
