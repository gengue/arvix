import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { Link, data } from "react-router";
import pb from "~/lib/pb";
import type { ClientsResponse, ProjectsRecord } from "~/lib/pb.types";
import type { Route } from "./+types/developer";

export function meta(params: Route.MetaArgs) {
	return [{ title: params.data?.name }];
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
				project.coverImg = pb.files.getURL(project, project.coverImg, { thumb: "600x0" });
			}
			return project;
		});
	}

	return record;
}

export default function DeveloperPage({ loaderData }: Route.ComponentProps) {
	const { name, logo, expand } = loaderData;
	return (
		<main className="container mx-auto">
			<div className="flex gap-4 my-6 p-4 items-center">
				<Image src={logo} alt={name} className="" />
				<h1 className="text-5xl">{name}</h1>
			</div>
			<h2 className="text-2xl my-8">Proyectos</h2>
			<nav className="flex flex-col flex-wrap gap-6">
				{expand?.projects_via_client?.map((project) => (
					<Link to={project.slug} viewTransition key={project.id}>
						<Card isFooterBlurred className="w-[300px] h-[300px] border-none">
							<CardHeader className="absolute z-10 top-0 flex-col items-start bg-white">
								<h4 className="text-black font-medium text-2xl">{project.name}</h4>
							</CardHeader>
							<Image
								removeWrapper
								isZoomed
								alt={project.name}
								className="z-0 w-full h-full object-cover"
								src={project.coverImg}
							/>
						</Card>
					</Link>
				))}
			</nav>
		</main>
	);
}
