import { Button } from "@nextui-org/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useReducer, useTransition } from "react";
import React from "react";
import { useRouteLoaderData } from "react-router";
import type { SpinRecord } from "~/lib/pb.types";
import type { Route } from "./+types/spin";
import type { LoaderData } from "./masterplan-layout";

//TODO: rename backVideo to backwardVideo
//TODO: disable button where is playing
export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const data = useRouteLoaderData<LoaderData>("routes/masterplan-layout");
	const [state, dispatch] = useReducer(reducer, {
		type: "intro",
		transitionVideo: data?.intro?.forwardVideo || "",
		intro: data?.intro,
		all: arrayToObject(data?.spin || []),
		spinId: 0,
	});
	const videoRef = React.useRef<HTMLVideoElement>(null);

	const [isPending, startTransition] = useTransition();
	usePreloadSpingVideos(data?.spin);

	const isPlaying = !!(
		(videoRef?.current?.currentTime ?? 0) > 0 &&
		!videoRef?.current?.paused &&
		!videoRef?.current?.ended
	);

	console.log("isPlaying", isPlaying);
	console.log("videoRef", videoRef?.current);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.src = state.transitionVideo;
			videoRef.current.load();
			if (isPlaying) {
				videoRef.current.play();
			}
			videoRef.current.play();
		}
	}, [state.transitionVideo, isPlaying]);

	if (!state?.transitionVideo) return null;

	const handleSpinStep = (motion: "forward" | "back") => {
		startTransition(() => {
			dispatch({ type: motion });
		});
	};

	return (
		<main>
			<video
				ref={videoRef}
				className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-full z-[-1] m-0 left-2/4 top-2/4"
				muted
				playsInline
				autoPlay
				preload="auto"
				// style={{ opacity: 0 }}
				onEnded={() => {
					if (state.type === "intro") {
						dispatch({ type: "forward" });
					}
				}}
			>
				<source type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<div className="absolute-center w-full flex justify-between z-20">
				<Button
					isIconOnly
					aria-label="Girar a la izquierda"
					className="text-white backdrop-blur-xl bg-black/60"
					radius="full"
					variant="flat"
					onPress={() => handleSpinStep("back")}
					isDisabled={isPending || isPlaying}
				>
					<ArrowLeft />
				</Button>
				<Button
					isIconOnly
					aria-label="Girar a la derecha"
					className="text-white backdrop-blur-xl bg-black/60"
					radius="full"
					variant="flat"
					onPress={() => handleSpinStep("forward")}
					isDisabled={isPending || isPlaying}
				>
					<ArrowRight />
				</Button>
			</div>
		</main>
	);
}

function usePreloadSpingVideos(spin: SpinRecord[] | undefined) {
	useEffect(() => {
		if (spin) {
			// preload all videos
			for (const item of spin) {
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

function arrayToObject(arr: SpinRecord[]) {
	return arr.reduce(
		(acc, item, index) => {
			acc[index] = item;
			return acc;
		},
		{} as Record<number, SpinRecord>,
	);
}
