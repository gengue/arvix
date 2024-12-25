import { Button } from "@nextui-org/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouteLoaderData } from "react-router";
import useSpin from "~/spin/useSpin";
import type { Route } from "./+types/spin";
import type { LoaderData } from "./masterplan-layout";

//TODO: rename backVideo to backwardVideo
//TODO: remove flash from intro video
//TODO: url params should render a specific spin
export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const data = useRouteLoaderData<LoaderData>("routes/masterplan-layout");
	const { videoRef, isPlaying, goForward, goBackward, poster } = useSpin(data);

	console.log("poster", poster);

	return (
		<main>
			<video
				ref={videoRef}
				className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-full z-[-1] m-0 left-2/4 top-2/4"
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
				<img
					src={poster}
					alt="Next frame"
					className="absolute -translate-x-2/4 -translate-y-2/4 object-cover h-full  m-0 left-2/4 top-2/4"
					style={{
						opacity: poster ? (!isPlaying ? 1 : 0) : 0,
					}}
				/>
			)}
			<div className="absolute-center w-full flex justify-between z-20">
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

				<p className="text-4xl text-white">Status: {isPlaying ? "Playing" : "Paused"}</p>
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
