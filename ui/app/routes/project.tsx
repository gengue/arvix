import { Button } from "@nextui-org/button";
import { ArrowRight } from "lucide-react";
import { data, Link } from "react-router";
import pb from "~/lib/pb";
import type { Route } from "./+types/project";

export function meta(params: Route.MetaArgs) {
	return [{ title: params?.data?.name }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [dev, record] = await Promise.all([
		pb.collection("clients").getFirstListItem(pb.filter("slug={:slug}", { slug: params.developerSlug }), {
			fields: "id",
		}),
		await pb.collection("projects").getFirstListItem(pb.filter("slug={:slug}", { slug: params.projectSlug }), {
			fields: "collectionId,id,name,slug,logo,coverImg,coverVideoUrl",
		}),
	]);

	if (!dev) {
		throw data("Record not found", { status: 404 });
	}

	record.logo = pb.files.getURL(record, record.logo, { thumb: "100x250" });

	if (record?.coverImg) {
		record.coverImg = pb.files.getURL(record, record.coverImg);
	}

	return record;
}

export default function ProjectStartPage({ loaderData }: Route.ComponentProps) {
	const { logo, coverImg, coverVideoUrl } = loaderData;
	return (
		<main>
			<VimeoBackgroundContainer videoUrl={coverVideoUrl} imgFallback={coverImg}>
				<div className="absolute bottom-28 left-0 right-0 flex justify-center  z-20">
					<div className="grid gap-8">
						<img src={logo} alt="Aurora Logo" className="h-42 my-4" />
						<Button
							as={Link}
							to="spin"
							className="text-white backdrop-blur-xl bg-black/60 p-8"
							color="default"
							radius="full"
							size="lg"
							variant="flat"
							// style={{ boxShadow: "rgba(191, 151, 255, 0.44) 0px 0px 4px inset" }}
						>
							<span className="text-lg font-medium">Entrar</span>
							<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
						</Button>
					</div>
				</div>
			</VimeoBackgroundContainer>
		</main>
	);
}

function VimeoBackgroundContainer({
	children,
	videoUrl,
	imgFallback,
}: { children: React.ReactNode; videoUrl: string; imgFallback: string }) {
	const finalVideoUrl = `${videoUrl}?background=true&transparent=0&dnt=true&title=0&byline=0&portrait=0&muted=1&autoplay=1&autopause=0&controls=0&loop=1`;

	return (
		<div className="fixed inset-0 z-[-1] min-w-full min-h-full object-cover object-center bg-black">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/2 z-10" />
			{videoUrl ? (
				<iframe
					src={finalVideoUrl}
					className="vimeo-video z-10"
					title="Background Video"
					allow="autoplay; fullscreen"
					allowFullScreen
				/>
			) : (
				<div
					className="vimeo-video"
					style={{
						background: `url(${imgFallback}) no-repeat center center fixed`,
						backgroundSize: "cover",
					}}
				/>
			)}
			{children}
		</div>
	);
}
