import type { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Arviz Dasbhoard" },
    { name: "description", content: "Arviz Sitio de administracion" },
  ];
}

export default function Home() {
  return (
    <h1>Dashboard page</h1>
  );
}
