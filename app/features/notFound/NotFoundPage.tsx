
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        <h1 className="mb-4 text-9xl font-extrabold text-gray-900">404</h1>
        <div className="mb-8 text-center">
          <div className="mb-4 h-1 w-16 bg-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">¿Estás perdido?</h2>
          <p className="mt-3 text-gray-600">
            La página que estás buscando no existe o ha sido movida a otra ubicación.
          </p>
          <p className="mt-2 text-gray-500">Comprueba la URL o regresa a la página principal.</p>
        </div>
        <Button asChild className="inline-flex items-center gap-2">
          <Link to="/">
            <span>Volver al inicio</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
