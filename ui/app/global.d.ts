export interface MapMeta {
	name: string;
	areas: MapArea[];
}

export interface MapArea {
	id: string;
	label: string;
	shape: string;
	coords: number[];
	d: string;
	active?: boolean;
	disabled?: boolean;
	href?: string;
	fillColor?: string;
	strokeColor?: string;
	lineWidth?: number;
	preFillColor?: string;
}
