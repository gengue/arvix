import { Tooltip, Image } from "@nextui-org/react";
import type { MapMeta } from "~/global";

type Props = {
	src?: string;
	map: MapMeta;
	isActive: boolean;
	onClick: () => void;
};
export function InteractiveImage({ src, map, isActive, onClick }: Props) {
	const fallback = src?.replace("1920x1080", "200x113");
	return (
		<>
			<Image
				src={src}
				fallbackSrc={fallback}
				alt="Next frame"
				className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-screen w-screen m-0 left-2/4 top-2/4"
				radius="none"
				removeWrapper
				disableSkeleton
				style={{ opacity: isActive ? 1 : 0 }}
			/>
			{map && isActive && (
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
											className="opacity-0 z-20 cursor-pointer group-hover:opacity-100 hover:opacity-100 transition-opacity duration-300"
											onClick={onClick}
										/>
									</Tooltip>
								);
							}
							if (area.shape === "path") {
								return (
									<Tooltip key={area.id} content={area.label}>
										<path
											key={area.id}
											fill={area.fillColor}
											stroke={area.strokeColor}
											d={area.d}
											className="opacity-0 z-20 cursor-pointer hover:opacity-100 group transition-opacity duration-300"
											style={{ visibility: isActive ? "visible" : "hidden" }}
										/>
									</Tooltip>
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
