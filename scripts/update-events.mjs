import fs from "fs/promises";
import path from "path";

const eventsPath = path.join(process.cwd(), "public", "events.json");

async function main() {
  const rawEvents = await fs.readFile(eventsPath, "utf-8");
  const events = JSON.parse(rawEvents);

  console.log(`Znaleziono ${events.length} wydarzeń w public/events.json`);

  await fs.writeFile(eventsPath, JSON.stringify(events, null, 2) + "\n");

  console.log("Plik events.json działa poprawnie.");
}

main().catch((error) => {
  console.error("Błąd aktualizacji wydarzeń:");
  console.error(error);
  process.exit(1);
});
