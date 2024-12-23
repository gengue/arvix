import { NextUIProvider } from "@nextui-org/react";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <NextUIProvider>
      <Outlet />
    </NextUIProvider>
  );
}
