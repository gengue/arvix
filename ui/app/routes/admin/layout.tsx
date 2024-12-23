import { type NotificationProvider, Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import PocketBase from "pocketbase";
import { Outlet } from "react-router";
import * as rpb from "refine-pocketbase";

const { authProvider, dataProvider, liveProvider } = rpb;

const POCKETBASE_URL = "http://localhost:8090";
const pb = new PocketBase(POCKETBASE_URL);

const notificationProvider: NotificationProvider = {
	open: ({ message, key, type }) => {
		alert(message);
	},
	close: (key) => {},
};

export default function AdminLayout() {
	return (
		<Refine
			authProvider={authProvider(pb, {
				loginRedirectTo: "/admin",
				providerName: "google",
			})}
			dataProvider={dataProvider(pb)}
			liveProvider={liveProvider(pb)}
			routerProvider={routerProvider}
			notificationProvider={notificationProvider}
			resources={[
				{
					name: "organizations",
					list: "/organizations",
				},
				{
					name: "dashboard",
					list: "/",
					meta: {
						label: "Dashboard",
						icon: "🏠",
					},
				},
			]}
		>
			<Outlet />
		</Refine>
	);
}
