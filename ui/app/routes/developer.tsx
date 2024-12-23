import { Link, data } from "react-router";
import pb from "~/lib/pb";
import type { ClientsResponse, ProjectsRecord } from "~/lib/pb.types";
import type { Route } from "./+types/developer";
import { Card, CardHeader, CardFooter, Image, Button } from "@nextui-org/react";

export function meta(params: Route.MetaArgs) {
	return [
		{ title: `${params.data.name} - Proyectos` },
		{ name: "description", content: `Proyectos de ${params.data.name}` },
	];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const record = await pb
		.collection("clients")
		.getFirstListItem<ClientsResponse<{ projects_via_client: ProjectsRecord[] }>>(
			pb.filter("slug={:slug}", { slug: params.developerSlug }),
			{
				expand: "projects_via_client",
			},
		);

	if (!record) {
		throw data("Record not found", { status: 404 });
	}

	const url = pb.files.getURL(record, record.logo, { thumb: "100x250" });
	record.logo = url;

	if (record?.expand?.projects_via_client) {
		record.expand.projects_via_client = record.expand.projects_via_client.map((project) => {
			if (project.logo) {
				project.logo = pb.files.getURL(project, project?.logo, { thumb: "200x0" });
			}
			if (project.coverImg) {
				project.coverImg = pb.files.getURL(project, project.coverImg, { thumb: "300x0" });
			}
			return project;
		});
	}

	return record;
}

export default function DeveloperPage({ loaderData }: Route.ComponentProps) {
	const { name, logo, slug, expand } = loaderData;
	return (
		<main className="container mx-auto">
			<div className="flex gap-4 my-6 p-4 items-center">
				<Image src={logo} alt={name} className="" />
				<h1 className="text-5xl">{name}</h1>
			</div>
			<h2 className="text-2xl my-8">Proyectos</h2>
			<nav className="flex flex-col flex-wrap gap-6">
				{expand?.projects_via_client?.map((project) => (
					<Card isFooterBlurred className="w-[300px] h-[300px]" key={project.id}>
						<CardHeader className="absolute z-10 top-1 flex-col items-start">
							<h4 className="text-black font-medium text-2xl">{project.name}</h4>
						</CardHeader>
						<Image
							removeWrapper
							alt="Project logo"
							className="absolute-center bg-radial from-black to-transparent"
							src={project.logo}
							shadow="lg"
						/>
						<Image removeWrapper alt={project.name} className="z-0 w-full h-full object-cover" src={project.coverImg} />
						<CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
							<div>
								<p className="text-black text-tiny">Unidades disponibles</p>
							</div>
							<Link to={`/${slug}/${project.slug}`} viewTransition>
								<Button className="text-tiny" color="primary" radius="full" size="sm">
									Ver
								</Button>
							</Link>
						</CardFooter>
					</Card>
				))}
			</nav>
		</main>
	);
}
