import { Outlet } from "react-router";
import { data } from "react-router";
import type { Route } from "./+types/masterplan-layout";
import pb from "~/lib/pb";
import type { ProjectsResponse, SpinRecord } from "~/lib/pb.types";
import type { NavbarProps } from "@nextui-org/react";
import React from "react";
import {
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	Link,
	Divider,
	NavbarMenuItem,
	NavbarMenu,
} from "@nextui-org/react";
import { cn } from "@nextui-org/react";

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
	return (
		<main className="w-screen h-screen relative z-10">
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
					"md:h-full",
					"items-center",
					"hidden md:flex",
					"data-[active=true]:bg-default/30",
					"data-[active=true]:p-4",
					"data-[active=true]:rounded-full",
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
						<Link className="text-default-200 text-md" href="#" size="sm">
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
