import React from "react";
import { Card, CardContent } from "~/components/ui/card";

export const Bienvenida = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Bienvenido
            </h1>
            <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          </div>

          {/* Centered Image */}
          <div className="mb-8">
            <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
              <img
                src="/Seslan.png"
                alt="Edificio institucional"
                className="object-cover"
              />
            </div>
          </div>

          {/* Institution Message */}
          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Esta es la página de control para la página del SESLAN
            </p>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
             Creada por Alexis Torres Acosta
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
