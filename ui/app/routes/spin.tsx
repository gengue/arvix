import { Button } from "@nextui-org/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouteLoaderData } from "react-router";
import useSpin from "~/spin/useSpin";
import type { Route } from "./+types/spin";
import type { LoaderData } from "./masterplan-layout";
import type { Map as MapType } from "react-img-mapper";

export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const data = useRouteLoaderData<LoaderData>("routes/masterplan-layout");
	const { videoRef, isPlaying, goForward, goBackward, poster, meta } = useSpin(data);

	return (
		<main>
			<video
				ref={videoRef}
				className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-screen w-screen z-[-1] m-0 left-2/4 top-2/4"
				poster={poster}
				muted
				playsInline
				style={{
					opacity: poster ? (isPlaying ? 1 : 0) : 1,
				}}
			>
				Tu navegador no soporta las características necesarias. Use un navegador moderno como Google Chrome, Mozilla
				Firefox, Safari o Microsoft Edge.
			</video>
			{poster && (
				<InteractiveImage
					src={poster}
					map={meta}
					style={{
						opacity: poster ? (!isPlaying ? 1 : 0) : 0,
					}}
				/>
			)}

			<div className="absolute-center w-full flex justify-between z-30">
				<Button
					isIconOnly
					aria-label="Girar a la izquierda"
					className="text-white backdrop-blur-xl bg-black/60"
					radius="full"
					variant="flat"
					onPress={goBackward}
					isDisabled={isPlaying}
				>
					<ArrowLeft />
				</Button>
				<Button
					isIconOnly
					aria-label="Girar a la derecha"
					className="text-white backdrop-blur-xl bg-black/60"
					radius="full"
					variant="flat"
					onPress={goForward}
					isDisabled={isPlaying}
				>
					<ArrowRight />
				</Button>
			</div>
		</main>
	);
}

type Props = {
	src: string;
	map: MapType;
	style?: React.CSSProperties;
};
function InteractiveImage({ src, map, style }: Props) {
	return (
		<>
			<img
				src={src}
				alt="Next frame"
				className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-screen w-screen m-0 left-2/4 top-2/4"
				style={style}
			/>
			{map && (
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1920 1080"
					className="z-20 absolute top-0 left-0 w-screen h-screen overflow-hidden align-middle"
					x="0px"
					y="0px"
					aria-label="Interactive map"
					role="img"
					xmlSpace="preserve"
					preserveAspectRatio="xMidYMid slice"
				>
					{map.areas.map((area) => {
						if (area.shape === "poly") {
							return (
								<polygon
									key={area.id}
									fill={area.fillColor}
									stroke={area.strokeColor}
									points={area.coords.map((coord, i) => (i % 2 === 0 ? `${coord},` : coord)).join(" ")}
									className="opacity-0 z-20 hover:cursor-pointer hover:opacity-100"
								/>
							);
						}
						if (area.shape === "circle") {
							return (
								<circle
									key={area.id}
									fill={area.fillColor}
									stroke={area.strokeColor}
									strokeWidth={2}
									cx={area.coords[0]}
									cy={area.coords[1]}
									r={area.coords[2]}
									className="opacity-0 z-30 hover:cursor-pointer hover:opacity-100"
								/>
							);
						}
						if (area.shape === "rect") {
							return (
								<rect
									key={area.id}
									fill={area.fillColor}
									stroke={area.strokeColor}
									x={area.coords[0]}
									y={area.coords[1]}
									width={area.coords[2]}
									height={area.coords[3]}
									className="opacity-0 z-20 absolute hover:cursor-pointer hover:opacity-100"
								/>
							);
						}
						return null;
					})}
				</svg>
			)}
		</>
	);
}
