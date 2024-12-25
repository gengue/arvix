import { AuthPage } from "@refinedev/core";
import type { Route } from "./+types/login";

export function meta(_params: Route.MetaArgs) {
	return [{ title: "Usuarios" }, { name: "description", content: "Administrar usuarios" }];
}
export default function Login() {
	return (
		<AuthPage
			type="login"
			providers={[
				{
					name: "google",
					icon: null,
					label: "Sign in with Google",
				},
			]}
			contentProps={{
				style: {
					background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
				},
			}}
			wrapperProps={{
				style: {
					background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
					position: "absolute",
					top: "0px",
					right: "0px",
					bottom: "0px",
					left: "0px",
				},
			}}
		/>
	);
}
