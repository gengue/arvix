import { useEffect, useReducer, useState } from "react";
import React from "react";
import type { MapMeta } from "~/global";
import useDebounce from "~/hooks/useDebounce";
import type { StructuresRecord, TransitionsRecord } from "~/lib/pb.types";
import type { LoaderData } from "~/routes/masterplan-layout";

export default function useSpin(data?: LoaderData) {
	const [state, dispatch] = useReducer(reducer, {
		type: data?.intro?.video || data?.intro?.img ? "intro" : "forward",
		transitionVideo: (data?.intro?.video || data?.spin?.[0]?.forwardVideo) ?? "",
		intro: data?.intro,
		allSpins: data?.spin || [],
		allStructures: data?.structures || {},
		transitionId: 0,
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = React.useRef<HTMLVideoElement>(null);

	usePreloadMediaResources(data?.intro, data?.spin, data?.structures);

	useEffect(() => {
		const playVideo = async (videoEle: HTMLVideoElement) => {
			videoEle.src = state.transitionVideo;
			try {
				videoEle.load();
				// Wait for the video to be ready
				await new Promise((resolve) => {
					videoEle.addEventListener("loadeddata", resolve, { once: true });
				});

				await videoEle.play();
				setIsPlaying(true);
			} catch (e) {
				// console.error(e);
			}
		};

		if (videoRef.current) {
			playVideo(videoRef.current);
		}
	}, [state.transitionVideo]);

	// Add event listeners to the videoRef to handle state internally
	useEffect(() => {
		const videoElement = videoRef.current;
		if (!videoElement) return;

		// const handlePlaying = () => {};
		const handleEnded = () => {
			if (state.type === "intro") {
				dispatch({ type: "forward" });
				setTimeout(() => setIsPlaying(false), 500);
			} else {
				setIsPlaying(false);
			}
		};

		// videoElement.addEventListener("playing", handlePlaying);
		videoElement.addEventListener("ended", handleEnded);

		return () => {
			// videoElement.removeEventListener("playing", handlePlaying);
			videoElement.removeEventListener("ended", handleEnded);
		};
	}, [state.type]);

	const poster = useDebounce(state.spin?.img, 400);

	const getFinalPoster = (type: TransitionState["type"]) => {
		if (type === "enter") return state.struct?.img;
		if (type === "intro") return data?.intro?.img;
		return poster ?? state.spin?.img;
	};

	const getFinalMeta = (type: TransitionState["type"]) => {
		return (type === "enter" ? state.struct?.meta : state.spin?.meta) as MapMeta;
	};

	return {
		goForward: () => dispatch({ type: "forward" }),
		goBackward: () => dispatch({ type: "back" }),
		enter: () => dispatch({ type: "enter" }),
		videoRef,
		isPlaying,
		poster: getFinalPoster(state.type),
		meta: getFinalMeta(state.type),
	};
}

/* *
 * Main State Machine
 */

type Motion = "intro" | "forward" | "back" | "enter";
type TransitionState = {
	type: Motion;
	allSpins: TransitionsRecord[]; // come from the API
	allStructures: Record<string, StructuresRecord>; // come from the API
	transitionVideo: string; // current video
	transitionId: number; // current transition index
	intro?: Intro; // welcome video
	spin?: TransitionsRecord; // current spin (exterior of the structure)
	struct?: StructuresRecord; // Current structure (interior of the structure)
};

type SpinAction = { type: Motion };

function reducer(state: TransitionState, action: SpinAction): TransitionState {
	const len = Object.keys(state.allSpins).length;
	if (action.type === "forward") {
		let index = (state.transitionId + 1) % len;
		let spin = state.allSpins[index];
		let transitionVideo = state?.spin?.forwardVideo;

		if (state.type === "intro") {
			index = 0;
			spin = state.allSpins[index];
			transitionVideo = state.intro?.video;
		}

		return {
			...state,
			transitionId: index,
			transitionVideo: transitionVideo || "",
			spin,
			type: action.type,
		};
	}

	if (action.type === "back") {
		const index = (state.transitionId - 1 + len) % len;
		const spin = state.allSpins[index];

		return {
			...state,
			transitionId: index,
			transitionVideo: spin?.backwardVideo || "",
			spin,
			type: action.type,
		};
	}

	if (action.type === "enter") {
		return {
			...state,
			transitionVideo: state?.spin?.topVideo || "",
			struct: state.allStructures["as3" as keyof typeof state.allStructures],
			type: action.type,
		};
	}

	return {
		...state,
		transitionVideo: state.spin?.forwardVideo || "",
		type: "intro",
	};
}

interface Intro {
	video?: string;
	img?: string;
}

function usePreloadMediaResources(
	intro?: Intro,
	spin?: TransitionsRecord[],
	structures?: Record<string, StructuresRecord>,
) {
	useEffect(() => {
		if (!intro && !spin) return;

		const preload = (videoSrc?: string, imgSrc?: string) => {
			if (videoSrc) {
				const videoEle = document.createElement("video");
				videoEle.src = videoSrc;
				videoEle.preload = "auto";
			}
			if (imgSrc) {
				const img = new Image();
				img.src = imgSrc;
			}
		};

		if (structures) {
			for (const key in structures) {
				const structure = structures[key];
				preload(structure.img);
			}
		}

		if (intro) {
			preload(intro.video, intro.img);
		}

		if (spin) {
			for (const item of spin) {
				preload(item.forwardVideo, item.img);
				preload(item.backwardVideo);
				preload(item.topVideo);
			}
		}
	}, [intro, spin, structures]);
}
