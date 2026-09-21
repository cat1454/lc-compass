import { HomeClient } from "../components/HomeClient";
import { loadPublicCatalog } from "../lib/content/loader";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialCards = await loadPublicCatalog();

  return <HomeClient initialCards={initialCards} />;
}
