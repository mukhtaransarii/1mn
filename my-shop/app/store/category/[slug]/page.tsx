import Mens from './mens'

export default async function CategoryPage({params, }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;

  if (slug === "mens") return <Mens />;
  if (slug === "all-products") return <h1>All Products Page</h1>;
  if (slug === "sales-offers") return <h1>Sales & Offers Page</h1>;
  if (slug === "authentics-products") return <h1>Authentics Products Page</h1>;

  return <h1>Category Not Found</h1>;
}