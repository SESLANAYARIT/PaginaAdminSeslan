import { Label } from "@radix-ui/react-label";
import { Shield, User, Eye, Lock, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import type z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { loginSchema } from "~/schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "~/context/AuthContext";
type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const [verContrasena, setVerContrasena] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = ({ email, password }: LoginFormData) => {
    
    login({ email, password }).then(() => navigate("/dashboard", { replace: true }));
  };
  if (isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="space-y-4 text-center pb-6">
            {/* Government Seal Placeholder */}
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Sistema de Administración SESLAN
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                Acceso exclusivo para personal autorizado
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-slate-700 font-medium"
                >
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Ingrese su correo electrónico"
                    className={`pl-10 pr-10 border ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={verContrasena ? "text" : "password"}
                    {...register("password")}
                    placeholder="Ingrese su contraseña"
                    className={`pl-10 pr-10 border ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setVerContrasena(!verContrasena)}
                    className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:bg-transparent focus:outline-none focus:ring-0"
                  >
                    {verContrasena ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">Mostrar contraseña</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/recuperar-password"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  ¿Olvidó su contraseña?
                </Link>
                {/** 
                <div className="flex items-center text-slate-500">
                  <Shield className="h-3 w-3 mr-1" />
                  <span className="text-xs">MFA disponible</span>
                </div>
                */}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 cursor-pointer"
              >
                Iniciar Sesión
              </Button>
            </form>
            {/** 
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-center space-x-6 text-xs text-slate-500">
                <Link
                  to="/ayuda"
                  className="hover:text-blue-600 flex items-center"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Ayuda
                </Link>
                <Link
                  to="/accesibilidad"
                  className="hover:text-blue-600 flex items-center"
                >
                  <Accessibility className="h-3 w-3 mr-1" />
                  Accesibilidad
                </Link>
                <Link
                  to="/seguridad"
                  className="hover:text-blue-600 flex items-center"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Políticas
                </Link>
              </div>
              
            </div>
            */}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <Shield className="inline h-3 w-3 mr-1" />
            Uso exclusivo para personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
};
