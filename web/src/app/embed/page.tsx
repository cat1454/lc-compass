import { loadPublicCatalog } from "../../lib/content/loader";
import { EmbedClient } from "./EmbedClient";

export const dynamic = "force-dynamic";

export default async function EmbedPage() {
  const cards = await loadPublicCatalog();

  return <EmbedClient initialCards={cards} />;
}
