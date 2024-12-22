import type { Route } from "./+types/orgs";
import { useList } from "@refinedev/core";
import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate } from "@refinedev/react-router";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Usuarios" },
    { name: "description", content: "Administrar usuarios" },
  ];
}

export default function OrganizationsList() {
  const { data, isLoading, isError } = useList({ resource: "organizations" })

  const organizations = data?.data ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <Authenticated key="organizations" fallback={<CatchAllNavigate to="/admin/login" />}>
      <ul>
        {organizations.map((product) => (
          <li key={product.id}>
            <h4>
              {product.name} - ({product.email})
            </h4>
          </li>
        ))}
      </ul>
    </Authenticated>
  );
};
