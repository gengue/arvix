import { Button } from "@nextui-org/button";
import { ArrowLeft, ArrowRight, Video } from "lucide-react";
import { useRouteLoaderData } from "react-router";
import type { Route } from "./+types/spin";
import { useEffect, useMemo, useState, useTransition } from "react";
import React from "react";
import type { LoaderData } from "./masterplan-layout";
import type { SpinRecord } from "~/lib/pb.types";

type StepStatus = {
	idx: number;
	motion: "intro" | "forward" | "back";
};

//TODO: fix changing motions
//TODO: rename backVideo to backwardVideo
export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const data = useRouteLoaderData<LoaderData>("routes/masterplan-layout");
	const [step, setStep] = useState<StepStatus>({
		idx: Number.parseInt(params.step || "0"),
		motion: !params.step ? "intro" : "forward",
	});
	const videoRef = React.useRef<HTMLVideoElement>(null);

	const view = useMemo(() => {
		if (step.motion === "intro") {
			return {
				...data?.intro,
				currentVideo: data?.intro?.forwardVideo,
			};
		}
		return {
			...data?.spin[step.idx],
			currentVideo: step.motion === "back" ? data?.spin[step.idx]?.backVideo : data?.spin[step.idx]?.forwardVideo,
		};
	}, [data?.intro, data?.spin, step]);

	const [isPending, startTransition] = useTransition();
	usePreloadSpingVideos(data?.spin);

	if (!data?.spin) return null;

	const handleSpinStep = (motion: "forward" | "back") => {
		startTransition(() => {
			setStep((prev) => ({
				idx: (prev.idx + (motion === "forward" ? 1 : -1) + data.spin.length) % data.spin.length,
				motion,
			}));
			if (videoRef.current) {
				const newSrc = view[`${motion}Video`];
				if (!newSrc || !videoRef.current) return;
				videoRef.current.src = newSrc;
				videoRef.current.play();
			}
		});
	};

	console.log("step", step, "view", view);
	// console.log("view", view);

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
					if (step.motion === "intro") {
						setStep({ idx: 0, motion: "forward" });
					}
				}}
			>
				<source src={view.currentVideo} type="video/mp4" />
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
					disabled={isPending}
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
					disabled={isPending}
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
