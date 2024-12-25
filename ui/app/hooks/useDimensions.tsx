import { useState, useCallback, useLayoutEffect } from "react";

export default function useDimensions<T extends HTMLElement>(liveMeasure = true) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0, right: 0, bottom: 0 });
	const [node, setNode] = useState<T | null>(null);

	const ref = useCallback((node: T) => {
		setNode(node);
	}, []);

	useLayoutEffect(() => {
		function getDimensionObject(node: HTMLElement) {
			const rect = node.getBoundingClientRect();

			return {
				width: rect.width,
				height: rect.height,
				right: rect.right,
				bottom: rect.bottom,
			};
		}

		if (node) {
			const measure = () => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)));
			measure();

			if (liveMeasure) {
				window.addEventListener("resize", measure);
				window.addEventListener("scroll", measure);

				return () => {
					window.removeEventListener("resize", measure);
					window.removeEventListener("scroll", measure);
				};
			}
		}
	}, [node, liveMeasure]);

	return { ref, dimensions };
}
