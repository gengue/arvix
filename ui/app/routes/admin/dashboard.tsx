import type { Route } from "./+types/dashboard";

export function meta(_params: Route.MetaArgs) {
	return [{ title: "Arvix Dasbhoard" }, { name: "description", content: "Arvix Sitio de administracion" }];
}

export default function Home() {
	return <h1>Dashboard page</h1>;
}
