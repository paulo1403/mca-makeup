import ErrorPage from '@/components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
      title="Página no encontrada"
      description="La página que buscas no existe o ha sido movida. Verifica la URL o navega desde el menú principal."
    />
  );
}
