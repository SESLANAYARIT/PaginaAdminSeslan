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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Plus } from "lucide-react";
import {
  FREQUENCY_LABELS,
  FREQUENCY_PERIODS,
  type DataPoint,
  type Section,
} from "~/interfaces/Article33/types/article33.types";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { yearSchema, type YearForm } from "~/schemas/year.schema";
import { createDataPoint } from "~/api/Article33/datapoints.api";

interface CreateYearDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  sections: Section[];
  selectedSection: string | undefined;
}

export function CreateYearDialog({
  isOpen,
  onOpenChange,
  setSections,
  sections,
  selectedSection,
}: CreateYearDialogProps) {
  const defaultValues: YearForm = {
    year: new Date().getFullYear(),
    frequency: "TRIMESTRAL", // valor inicial
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<YearForm>({
    resolver: zodResolver(yearSchema),
    mode: "onBlur",
    defaultValues,
  });

  const frequency = watch("frequency");

  const onSubmit = async (data: YearForm) => {
    if (!selectedSection) return;
    await createDataPoint({
      ...data,
      sectionId: selectedSection,
    });
    const yearNumber = data.year;
    const periods = FREQUENCY_PERIODS[data.frequency];
    const newDataPoints: DataPoint[] = periods.map((period) => ({
      year: yearNumber,
      period,
    }));

    const updatedSections = sections.map((section) => {
      const updateSectionData = (sec: Section): Section => {
        if (sec.id === selectedSection) {
          return { ...sec, data: [...sec.data, ...newDataPoints] };
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
    onOpenChange(false);
    reset();
    toast.success("Año agregado correctamente");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => reset()}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Año
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Año</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Campo Año */}
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                min="2010"
                max="2100"
                placeholder="2024"
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="text-red-500">{errors.year.message}</p>
              )}
            </div>

            {/* Campo Frecuencia */}
            <div>
              <Label htmlFor="frequency">Frecuencia</Label>
              <Controller
                control={control}
                name="frequency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.frequency && (
                <p className="text-red-500">{errors.frequency.message}</p>
              )}
            </div>

            {/* Vista previa de períodos */}
            {frequency && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium mb-2">
                  Períodos que se crearán:
                </p>
                <div className="flex flex-wrap gap-1">
                  {FREQUENCY_PERIODS[frequency].map((period) => (
                    <Badge key={period} variant="secondary">
                      {period}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Crear Año
              </Button>
              <Button
                type="button"
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
