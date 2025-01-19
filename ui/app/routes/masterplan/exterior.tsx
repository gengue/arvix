import { Button } from "@nextui-org/button";
import { cn, useDisclosure } from "@nextui-org/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouteLoaderData, useSearchParams } from "react-router";
import type { MapMeta } from "~/global";
import type { StructuresRecord, TransitionsRecord } from "~/lib/pb.types";
import { InteractiveImage } from "~/spin/interactive-image";
import type { Route } from "./+types/exterior";
import type { LoaderData } from "./layout";

export function meta(_params: Route.MetaArgs) {
	return [{ title: "Explorar inmueble", description: "Descubre el proyecto desde una vista a 360 grados" }];
}

type Steps = "intro" | "exterior" | "detail";

const getInitialExternalFrameFromSearchParams = (searchParams: URLSearchParams, data?: LoaderData) => {
	if (searchParams.has("i")) {
		const idx = Number(searchParams.get("i"));
		if (data?.spin?.[idx]) return data.spin[idx];
	}
	return data?.spin[0] ?? null;
};

const getInitialDetailFrameFromUrl = (params: Route.ComponentProps["params"], data?: LoaderData) => {
	if (params?.step === "detail" && data?.structures) {
		return data.structures.as3;
	}
	return null;
};
export default function SpinPage({ loaderData, params }: Route.ComponentProps) {
	const baseUrl = `/${params.developerSlug}/${params.projectSlug}/masterplan`;
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const data = useRouteLoaderData<LoaderData>("routes/masterplan/layout");
	const {
		isOpen: floorMenuIsOpen,
		onOpen: onOpenFloorMenu,
		onOpenChange: onOpenFloorMenuChange,
	} = useDisclosure();

	const videoRef = useRef<HTMLVideoElement>(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const [type, setType] = useState<Steps>((params?.step as Steps) || "intro");
	const [exteriorFrame, setFrame] = useState<TransitionsRecord | null>(
		getInitialExternalFrameFromSearchParams(searchParams, data),
	);
	const [detailFrame, setDetailFrame] = useState<StructuresRecord | null>(
		getInitialDetailFrameFromUrl(params, data),
	);
	const [introPlayed, setIntroPlayed] = useState(params.step !== undefined && params.step !== "intro");

	const playVideo = useCallback(async (videoEle: HTMLVideoElement, src: string, cb?: () => void) => {
		videoEle.src = src;
		try {
			videoEle.load();
			// Wait for the video to be ready
			await new Promise((resolve) => {
				videoEle.addEventListener("loadeddata", resolve, { once: true });
			});

			await videoEle.play();
			setIsPlaying(true);
			if (cb) {
				cb();
			}
		} catch (e) {
			// console.error(e);
		}
	}, []);

	const handleSpinForward = () => {
		if (videoRef.current && data?.spin && exteriorFrame) {
			const transitionVideo = exteriorFrame.forwardVideo || "";
			playVideo(videoRef.current, transitionVideo, () => {
				if (type === "exterior") {
					const idx = data?.spin?.findIndex((f) => f.id === exteriorFrame.id) || 0;
					const nextIdx = (idx + 1) % data?.spin?.length;
					const nextFrame = data?.spin?.[nextIdx];
					setSearchParams((prev) => {
						prev.set("i", nextIdx.toString());
						return prev;
					});
					setTimeout(() => {
						setFrame(nextFrame);
					}, 500);
				}
			});
		}
	};

	const handleSpinBackward = () => {
		if (videoRef.current && data?.spin && exteriorFrame) {
			const idx = data?.spin?.findIndex((f) => f.id === exteriorFrame.id) || 0;
			const nextIdx = (idx - 1 + data?.spin?.length) % data?.spin?.length;
			const nextFrame = data?.spin?.[nextIdx];
			setSearchParams((prev) => {
				prev.set("i", nextIdx.toString());
				return prev;
			});

			const transitionVideo = nextFrame.backwardVideo || "";
			playVideo(videoRef.current, transitionVideo);
			if (type === "exterior") {
				setTimeout(() => {
					setFrame(nextFrame);
				}, 500);
			}
		}
	};

	const handleOnClickStructure = () => {
		if (videoRef.current && exteriorFrame) {
			const transitionVideo = exteriorFrame.topVideo || "";
			playVideo(videoRef.current, transitionVideo);
		}

		if (type === "exterior" && exteriorFrame) {
			navigate(`${baseUrl}/detail`, { replace: true });
			setTimeout(() => {
				const nextFrame = data?.structures?.as3;
				setType("detail");
				setDetailFrame(nextFrame as StructuresRecord);
			}, 500);
		}

		onOpenFloorMenu();
	};

	const handleVideoEnded = () => {
		if (!introPlayed && data?.spin?.[0]) {
			setIntroPlayed(true);
			navigate(`${baseUrl}/exterior`, { replace: true });
			setTimeout(() => {
				setType("exterior");
				setFrame(data?.spin[0]);
				setSearchParams((prev) => {
					prev.set("i", "0");
					return prev;
				});
			}, 400);
		}

		setTimeout(() => {
			setIsPlaying(false);
		}, 300);
	};

	const handleBackToExterior = () => {
		setType("exterior");
		const idx = data?.spin?.findIndex((f: { id: string | undefined }) => f.id === exteriorFrame?.id) || 0;
		navigate(`${baseUrl}/exterior?i=${idx}`, { replace: true });
	};

	const handleSelectFloor = (floor: string) => {
		console.log(floor, data?.structures);
		const nextFrame = data?.structures?.[floor.length > 2 ? floor : `floor-${floor}`];
		setDetailFrame(nextFrame as StructuresRecord);
		setType("detail");
	};

	useEffect(() => {
		if (data?.intro && videoRef.current && !introPlayed) {
			const transitionVideo = data?.intro?.video || data?.spin?.[0]?.forwardVideo || "";
			playVideo(videoRef.current, transitionVideo);
		}
	}, [data?.intro, data?.spin, playVideo, introPlayed]);

	const currentFrameImg = introPlayed
		? type === "detail"
			? detailFrame?.img
			: exteriorFrame?.img
		: data?.intro?.img;
	const currentFrameMeta = type === "detail" ? detailFrame?.meta : exteriorFrame?.meta;

	return (
		<>
			<video
				ref={videoRef}
				className={cn(
					"absolute -translate-x-2/4 -translate-y-2/4 object-cover h-screen w-screen left-2/4 top-2/4 pointer-events-none -z-10",
				)}
				muted
				playsInline
				onEnded={handleVideoEnded}
			>
				Tu navegador no soporta las características necesarias. Use un navegador moderno como Google Chrome,
				Mozilla Firefox, Safari o Microsoft Edge.
			</video>
			{currentFrameImg && (
				<InteractiveImage
					src={currentFrameImg}
					map={currentFrameMeta as MapMeta}
					isActive={!isPlaying}
					onClick={handleOnClickStructure}
				/>
			)}
			{type !== "detail" && (
				<SpinButtons isPlaying={isPlaying} goForward={handleSpinForward} goBackward={handleSpinBackward} />
			)}

			{type === "detail" && !isPlaying && (
				<Button
					onPress={handleBackToExterior}
					className="absolute top-20 left-3 z-30 brand-base"
					radius="full"
					color="default"
					variant="flat"
				>
					<ArrowLeft />
					Volver
				</Button>
			)}

			{!floorMenuIsOpen && type === "detail" && (
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
				style={{ right: floorMenuIsOpen && !isPlaying && type === "detail" ? 0 : "-100%" }}
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
					"as3",
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
					"as2",
					"as1",
				].map((i) => (
					<Button
						key={i}
						className={cn(
							"text-lg text-default-100 min-w-16 uppercase",
							detailFrame?.slug === i && "border-default-100/30 bg-default/30 border-1",
						)}
						onPress={() => handleSelectFloor(i)}
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
