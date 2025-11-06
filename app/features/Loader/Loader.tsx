export default function Loader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg border flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div>
          <p className="font-medium">Cargando...</p>
          <p className="text-sm text-muted-foreground">
            Por favor espera un momento
          </p>
        </div>
      </div>
    </div>
  );
}
