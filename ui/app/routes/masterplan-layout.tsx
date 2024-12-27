import type { NavbarProps } from "@nextui-org/react";
import {
	Divider,
	Link,
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@nextui-org/react";
import { cn } from "@nextui-org/react";
import React from "react";
import { Outlet } from "react-router";
import { data } from "react-router";
import pb from "~/lib/pb";
import type { ProjectsResponse, StructuresRecord, TransitionsRecord } from "~/lib/pb.types";
import type { Route } from "./+types/masterplan-layout";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [dev, record] = await Promise.all([
		pb.collection("clients").getFirstListItem(pb.filter("slug={:slug}", { slug: params.developerSlug }), {
			fields: "id",
		}),
		pb
			.collection("projects")
			.getFirstListItem<
				ProjectsResponse<
					unknown,
					{ transitions_via_project: TransitionsRecord[]; structures_via_project: StructuresRecord[] }
				>
			>(pb.filter("slug={:slug}", { slug: params.projectSlug }), {
				fields: "collectionId,id,name,coverImg,introTransitionVideo,introImg,expand",
				expand: "transitions_via_project,structures_via_project",
			}),
	]);

	if (!dev) {
		throw data("Record not found", { status: 404 });
	}

	let { expand, introTransitionVideo, introImg, ...project } = record;
	if (project?.coverImg) {
		project.coverImg = pb.files.getURL(project, project.coverImg);
	}
	if (introImg) {
		introImg = pb.files.getURL(project, introImg, { thumb: "1920x1080" });
	}

	let spin: TransitionsRecord[] = [];

	if (expand?.transitions_via_project) {
		spin = expand.transitions_via_project
			.sort((a, b) => a?.order - b?.order)
			.map((i) => {
				if (i.backwardVideo) i.backwardVideo = pb.files.getURL(i, i.backwardVideo);
				if (i.forwardVideo) i.forwardVideo = pb.files.getURL(i, i.forwardVideo);
				if (i.topVideo) i.topVideo = pb.files.getURL(i, i.topVideo);
				i.img = pb.files.getURL(i, i.img, { thumb: "1920x1080" });
				return i;
			});
	}

	let structures: Record<string, StructuresRecord> = {};
	if (expand?.structures_via_project) {
		structures = expand.structures_via_project
			.sort((a, b) => a?.order - b?.order)
			.reduce((acc, curr) => {
				if (curr.img) curr.img = pb.files.getURL(curr, curr.img, { thumb: "1920x1080" });
				acc[curr.slug] = curr;
				return acc;
			}, structures);
	}

	return {
		project,
		intro: {
			video: introTransitionVideo ? pb.files.getURL(record, introTransitionVideo) : "",
			img: introImg,
		},
		spin,
		structures,
	};
}

export type LoaderData = Awaited<ReturnType<typeof clientLoader>>;

export default function MasterplanLayout({ loaderData }: Route.ComponentProps) {
	return (
		<main className="w-screen h-screen relative z-10 bg-slate-950">
			<Menu />
			<Outlet />
		</main>
	);
}

const menuItems = ["Intro", "El edificio", "Plantas", "Amenidades", "Ubicación", "Contacto"];

export function Menu(props: NavbarProps) {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	return (
		<Navbar
			{...props}
			classNames={{
				wrapper: "relative py-1",
				base: "brand-base md:rounded-full md:w-fit md:-translate-x-2/4 md:-translate-y-2/4 md:left-2/4 md:top-[2rem] ",
				item: [
					"flex",
					"relative",
					"rounded-full",
					"md:h-full",
					"items-center",
					"hidden md:flex",
					"data-[active=true]:bg-default/30",
					"data-[active=true]:p-4",
					"data-[active=true]:border-default-100/30",
					"data-[active=true]:border-1",
				],
			}}
			height="52px"
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			maxWidth="sm"
			isBordered
			isBlurred
			position="sticky"
		>
			<NavbarContent justify="center" className="">
				{menuItems.map((item) => (
					<NavbarItem key={item} isActive={item === "El edificio"}>
						<Link className={cn("text-default-200 text-md")} href="#" size="sm">
							{item}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarMenuToggle className="text-default-400 md:hidden" />

			<NavbarMenu className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-black/60 pb-6 pt-6 shadow-medium backdrop-blur-xl">
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}`}>
						<Link className="mb-2 w-full text-default-200" href="#" size="md">
							{item}
						</Link>
						{index < menuItems.length - 1 && <Divider className="opacity-50" />}
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
