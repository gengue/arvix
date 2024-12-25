import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate } from "@refinedev/react-router";
import ImageMapper, { type MapArea, type Map as MapType } from "react-img-mapper";
import type { Route } from "./+types/mapper";
import useDimensions from "~/hooks/useDimensions";

export function meta(_params: Route.MetaArgs) {
	return [{ title: "Mapear imagen" }, { name: "description", content: "Mapear imagenes" }];
}

export default function ImageMapperPage() {
	const URL =
		"http://127.0.0.1:8090/api/files/pbc_2648271836/3sepgk4uve104k6/home_img_en752wv0kk.jpg?thumb=1920x1080";

	const MAP: MapType = {
		name: "el-jepa",
		areas: [
			{
				id: "1",
				shape: "poly",
				// fillColor: "#00ff194c",
				strokeColor: "transparent",
				fillColor: "#38d1db36",

				// strokeColor: "black",
				active: true,
				coords: [
					1154, 782, 1092, 744, 1106, 197, 1066, 192, 1066, 178, 1059, 178, 1059, 162, 1034, 161, 1034, 158,
					1018, 158, 1018, 160, 1012, 160, 1012, 126, 954, 124, 898, 124, 894, 126, 894, 177, 852, 178, 864,
					762, 864, 788, 910, 823, 910, 858, 915, 863, 916, 979, 986, 979, 997, 993, 1150, 941, 1151, 874,
				],
			},
			{
				id: "2",
				shape: "circle",
				fillColor: "#00ff194c",
				strokeColor: "black",
				coords: [1003, 571, 22],
			},
		],
	};

	return (
		<Authenticated key="mapper" fallback={<CatchAllNavigate to="/admin/login" />}>
			<h1 className="text-4xl">Mapper</h1>
			<InteractiveImage src={URL} map={MAP} />
		</Authenticated>
	);
}

type Props = {
	src: string;
	map: MapType;
	onChange?: (e: MapArea) => void;
	className?: string;
	style?: React.CSSProperties;
};
export function InteractiveImage({ src, map, onChange, className, style }: Props) {
	const { ref, dimensions } = useDimensions<HTMLDivElement>();
	console.log(dimensions);

	return (
		<div className={className || ""} ref={ref} style={style}>
			<ImageMapper
				src={src}
				map={map}
				onChange={(e) => {
					if (onChange) onChange(e);
				}}
				parentWidth={dimensions.width}
				height={dimensions.height}
				natural
				responsive
			/>
		</div>
	);
}
