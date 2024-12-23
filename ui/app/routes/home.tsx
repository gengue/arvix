import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Welcome to Arviz" }, { name: "description", content: "Arquitectural Visualization" }];
}

export default function Home() {
	return (
		<main>
			<h1>Welcome to Arviz</h1>
		</main>
	);
}
