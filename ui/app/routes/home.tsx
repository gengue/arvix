import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Welcome to Arviz" },
    { name: "description", content: "Arquitectural Visualization" },
  ];
}

export default function Home() {
  return <Welcome />;
}
