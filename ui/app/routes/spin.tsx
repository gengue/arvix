import { Button } from "@nextui-org/button";
import { cn, useDisclosure } from "@nextui-org/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouteLoaderData } from "react-router";
import { InteractiveImage } from "~/spin/interactive-image";
import useSpin from "~/spin/useSpin";
import type { Route } from "./+types/spin";
import type { LoaderData } from "./masterplan-layout";

export function meta(params: Route.MetaArgs) {
	return [{ title: "Explorar inmueble", description: "Descubre el proyecto desde una vista a 360 grados" }];
}

export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const data = useRouteLoaderData<LoaderData>("routes/masterplan-layout");
	const { videoRef, isPlaying, poster, meta, type, goForward, goBackward, enter, leave } = useSpin(data);
	const {
		isOpen: floorMenuIsOpen,
		onOpen: onOpenFloorMenu,
		onOpenChange: onOpenFloorMenuChange,
	} = useDisclosure();

	const handleOnClickStructure = () => {
		enter();
		onOpenFloorMenu();
	};

	return (
		<>
			<video
				ref={videoRef}
				className={cn(
					"absolute -translate-x-2/4 -translate-y-2/4 object-cover h-screen w-screen left-2/4 top-2/4 pointer-events-none",
				)}
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
			{poster && (
				<InteractiveImage src={poster} map={meta} isActive={!isPlaying} onClick={handleOnClickStructure} />
			)}
			{type !== "enter" && (
				<SpinButtons isPlaying={isPlaying} goForward={goForward} goBackward={goBackward} />
			)}

			{type === "enter" && !isPlaying && (
				<Button
					onPress={() => leave()}
					className="absolute top-20 left-3 z-30 brand-base"
					radius="full"
					color="default"
					variant="flat"
				>
					<ArrowLeft />
					Volver
				</Button>
			)}

			{!floorMenuIsOpen && type === "enter" && (
				<div className="cta-container absolute top-20 right-3 z-30">
					<Button
						onPress={onOpenFloorMenu}
						className="cta text-md "
						radius="full"
						color="default"
						variant="flat"
					>
						Cambiar planta
					</Button>
				</div>
			)}

			<div
				className="fixed top-16 z-20 py-3 px-1 gap-1 flex flex-col items-center rounded-full text-white backdrop-blur-xl bg-black/40 border-default-100/30 border-1 transition-[right] duration-800"
				style={{ right: floorMenuIsOpen && !isPlaying && type === "enter" ? 0 : "-100%" }}
			>
				<Button
					isIconOnly
					aria-label="Like"
					color="secondary"
					className="text-lg text-default-100 cta"
					radius="full"
					onPress={onOpenFloorMenuChange}
				>
					<ArrowRight />
				</Button>
				{[
					"AS3",
					"26",
					"25",
					"24",
					"23",
					"22",
					"21",
					"20",
					"19",
					"18",
					"17",
					"16",
					"15",
					"14",
					"13",
					"12",
					"11",
					"10",
					"9",
					"8",
					"7",
					"6",
					"AS2",
					"AS1",
				].map((i) => (
					<Button
						key={i}
						className={cn(
							"text-lg text-default-100 min-w-16",
							"AS3" === i && "border-default-100/30 bg-default/30 border-1",
						)}
						radius="full"
						size="md"
						variant="light"
					>
						{i}
					</Button>
				))}
			</div>
		</>
	);
}

function SpinButtons({
	isPlaying,
	goForward,
	goBackward,
}: { isPlaying: boolean; goForward: () => void; goBackward: () => void }) {
	return (
		<>
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
