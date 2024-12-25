import { useEffect, useReducer, useState } from "react";
import React from "react";
import useDebouce from "~/hooks/useDebouce";
import type { SpinRecord } from "~/lib/pb.types";
import type { LoaderData } from "~/routes/masterplan-layout";

export default function useSpin(data?: LoaderData) {
	const [state, dispatch] = useReducer(reducer, {
		type: "intro",
		transitionVideo: data?.intro?.forwardVideo || "",
		intro: data?.intro,
		all: arrayToObject(data?.spin || []),
		spinId: 0,
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = React.useRef<HTMLVideoElement>(null);

	usePreloadMediaResources(data?.spin);

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

		// const handlePlaying = () => setIsPlaying(true);
		const handleEnded = () => {
			if (state.type === "intro") {
				dispatch({ type: "forward" });
			}
			setIsPlaying(false);
		};

		// videoElement.addEventListener("playing", handlePlaying);
		videoElement.addEventListener("ended", handleEnded);

		return () => {
			// videoElement.removeEventListener("playing", handlePlaying);
			videoElement.removeEventListener("ended", handleEnded);
		};
	}, [state.type]);

	const poster = useDebouce(state.spin?.img, 400);

	return {
		goForward: () => dispatch({ type: "forward" }),
		goBackward: () => dispatch({ type: "back" }),
		videoRef,
		isPlaying,
		poster: state.type === "intro" ? state.spin?.img : poster,
	};
}

/* *
 * Main State Machine
 */

type Motion = "intro" | "forward" | "back";
type SpinState = {
	type: Motion;
	transitionVideo: string;
	all: Record<number, SpinRecord>;
	spinId: number;
	intro?: SpinRecord;
	spin?: SpinRecord;
};

type SpinAction = { type: Motion };

function reducer(state: SpinState, action: SpinAction): SpinState {
	const len = Object.keys(state.all).length;
	if (action.type === "forward") {
		let spinId = (state.spinId + 1) % len;
		let spin = state.all[spinId];
		let transitionVideo = state?.spin?.forwardVideo;

		if (state.type === "intro") {
			spinId = 0;
			spin = state.all[spinId];
			transitionVideo = state.intro?.forwardVideo;
		}

		return {
			...state,
			spinId,
			transitionVideo: transitionVideo || "",
			spin,
			type: action.type,
		};
	}

	if (action.type === "back") {
		const spinId = (state.spinId - 1 + len) % len;
		const spin = state.all[spinId];

		return {
			...state,
			spinId,
			transitionVideo: spin?.backVideo || "",
			spin,
			type: action.type,
		};
	}

	return {
		...state,
		transitionVideo: state.spin?.forwardVideo || "",
		type: "intro",
	};
}

/**
 * Utility
 */
function arrayToObject(arr: SpinRecord[]) {
	return arr.reduce(
		(acc, item, index) => {
			acc[index] = item;
			return acc;
		},
		{} as Record<number, SpinRecord>,
	);
}

function usePreloadMediaResources(spin: SpinRecord[] | undefined) {
	useEffect(() => {
		if (spin) {
			// preload all videos
			for (const item of spin) {
				if (item.img) {
					const img = new Image();
					img.src = item.img;
				}
				if (item.backVideo) {
					const backVideo = document.createElement("video");
					backVideo.src = item.backVideo;
					backVideo.preload = "auto";
				}
				if (item.forwardVideo) {
					const forwardVideo = document.createElement("video");
					forwardVideo.src = item.forwardVideo;
					forwardVideo.preload = "auto";
				}
			}
		}
	}, [spin]);
}
