import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	layout("routes/layout.tsx", [
		index("routes/home.tsx"),
		route(":developerSlug", "routes/developer.tsx"),
		route(":developerSlug/:projectSlug", "routes/project.tsx"),
		layout("routes/masterplan/layout.tsx", [
			route(":developerSlug/:projectSlug/masterplan/:step?", "routes/masterplan/exterior.tsx"),
		]),
	]),
	...prefix("admin", [
		layout("routes/admin/layout.tsx", [
			index("routes/admin/dashboard.tsx"),
			route("login", "routes/admin/login.tsx"),
			route("organizations", "routes/admin/orgs.tsx"),
			route("mapper", "routes/admin/mapper.tsx"),
		]),
	]),
] satisfies RouteConfig;
