import type { Route } from "./+types/home";

export function meta(params: Route.MetaArgs) {
	return [{ title: "Welcome to Arvix" }, { name: "description", content: "Arquitectural Visualization" }];
}

export default function Home() {
	return (
		<main>
			<h1>Welcome to Arvix</h1>
		</main>
	);
}
