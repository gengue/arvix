import { Outlet } from "react-router";
import { data } from "react-router";
import type { Route } from "./+types/masterplan-layout";
import pb from "~/lib/pb";
import type { ProjectsResponse, SpinRecord } from "~/lib/pb.types";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const dev = await pb
		.collection("clients")
		.getFirstListItem(pb.filter("slug={:slug}", { slug: params.developerSlug }), {
			fields: "id",
		});

	if (!dev) {
		throw data("Record not found", { status: 404 });
	}

	const record = await pb
		.collection("projects")
		.getFirstListItem<ProjectsResponse<unknown, { spin_via_project: SpinRecord[] }>>(
			pb.filter("slug={:slug}", { slug: params.projectSlug }),
			{
				fields: "collectionId,id,name,coverImg,expand",
				expand: "spin_via_project",
			},
		);

	const { expand, ...project } = record;
	if (project?.coverImg) {
		project.coverImg = pb.files.getURL(project, project.coverImg);
	}

	let spin: SpinRecord[] = [];
	let intro: SpinRecord | undefined;

	if (expand?.spin_via_project) {
		const [first, ...rest] = expand.spin_via_project
			.sort((a, b) => a?.order - b?.order)
			.map((i) => {
				if (i.backVideo) i.backVideo = pb.files.getURL(i, i.backVideo);
				if (i.forwardVideo) i.forwardVideo = pb.files.getURL(i, i.forwardVideo);
				i.img = pb.files.getURL(i, i.img, { thumb: "1920x1080" });
				return i;
			});

		if (first.forwardVideo && !first.backVideo) {
			intro = first;
			spin = rest;
		} else {
			spin = [first, ...rest];
		}
	}

	return {
		project,
		intro,
		spin,
	};
}

export type LoaderData = Awaited<ReturnType<typeof clientLoader>>;

export default function MasterplanLayout({ loaderData }: Route.ComponentProps) {
	return <Outlet />;
}
