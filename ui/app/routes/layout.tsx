import { NextUIProvider } from "@nextui-org/react";
import { Outlet, useHref, useNavigate, type NavigateOptions } from "react-router";

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NavigateOptions;
	}
}

export default function MainLayout() {
	const navigate = useNavigate();
	return (
		<NextUIProvider navigate={navigate} useHref={useHref}>
			<Outlet />
		</NextUIProvider>
	);
}
