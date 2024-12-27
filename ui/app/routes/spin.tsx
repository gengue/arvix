import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouteLoaderData } from "react-router";
import type { MapMeta } from "~/global";
import useSpin from "~/spin/useSpin";
import type { Route } from "./+types/spin";
import type { LoaderData } from "./masterplan-layout";

export function meta(params: Route.MetaArgs) {
	return [{ title: "Explorar inmueble", description: "Descubre el proyecto desde una vista a 360 grados" }];
}

export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const data = useRouteLoaderData<LoaderData>("routes/masterplan-layout");
	const { videoRef, isPlaying, poster, meta, goForward, goBackward, enter } = useSpin(data);

	return (
		<>
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
				Tu navegador no soporta las características necesarias. Use un navegador moderno como Google Chrome,
				Mozilla Firefox, Safari o Microsoft Edge.
			</video>
			{poster && <InteractiveImage src={poster} map={meta} isActive={!isPlaying} onClick={enter} />}
			<Button
				isIconOnly
				aria-label="Girar a la izquierda"
				className="absolute left-2 top-[50%] z-30 brand-base"
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
				className="absolute right-2 top-[50%] z-30 brand-base"
				radius="full"
				variant="flat"
				onPress={goForward}
				isDisabled={isPlaying}
			>
				<ArrowRight />
			</Button>
		</>
	);
}

type Props = {
	src: string;
	map: MapMeta;
	isActive: boolean;
	onClick: () => void;
};
function InteractiveImage({ src, map, isActive, onClick }: Props) {
	return (
		<>
			<img
				src={src}
				alt="Next frame"
				className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-screen w-screen m-0 left-2/4 top-2/4"
				style={{ opacity: isActive ? 1 : 0 }}
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
					<g className="group">
						{map.areas.map((area) => {
							if (area.shape === "poly") {
								return (
									<Tooltip key={area.id} content={area.label}>
										{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
										<polygon
											key={area.id}
											fill={area.fillColor}
											stroke={area.strokeColor}
											points={area.coords.map((coord, i) => (i % 2 === 0 ? `${coord},` : coord)).join(" ")}
											className="opacity-0 z-20 cursor-pointer group-hover:opacity-100 group"
											onClick={onClick}
										/>
									</Tooltip>
								);
							}
							if (area.shape === "path") {
								return (
									<path
										key={area.id}
										fill={area.fillColor}
										stroke={area.strokeColor}
										d={area.d}
										className="opacity-0 z-20 cursor-pointer group-hover:opacity-100 group"
										style={{ visibility: isActive ? "visible" : "hidden" }}
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
										className="z-30 cursor-pointer"
										style={{ visibility: isActive ? "visible" : "hidden" }}
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
										className="opacity-0 z-20 absolute group-hover:cursor-pointer hover:opacity-100"
									/>
								);
							}
							return null;
						})}
					</g>
				</svg>
			)}
		</>
	);
}
