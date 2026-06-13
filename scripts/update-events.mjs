import fs from "fs/promises";
import path from "path";

const eventsPath = path.join(process.cwd(), "public", "events.json");

const SOURCES = [
  {
    name: "Miasto i Gmina Pułtusk",
    url: "https://pultusk.pl/events/",
    place: "Pułtusk",
  },
];

const INCLUDE_KEYWORDS = [
  "koncert",
  "recital",
  "organowy",
  "wystawa",
  "muzeum",
  "zwiedzanie",
  "spacer",
  "historyczny",
  "teatr",
  "kino",
  "film",
  "literacki",
  "autorskie",
  "narew",
  "zamek",
  "bazylika",
  "kościół",
  "kosciol",
  "piwnice",
  "pojezuickie",
  "wzgórze abrahama",
  "wzgorze abrahama",
  "dom polonii",
  "galeria",
  "mckis",
  "kultura",
  "wianki",
];

const EXCLUDE_KEYWORDS = [
  "sesja rady",
  "przetarg",
  "nabór",
  "nabor",
  "komunikat",
  "odpady",
  "utrudnienia",
  "szkolenie",
  "zawody",
  "turniej",
  "mistrzostwa",
  "bieg",
  "sportowy",
  "sportowe",
  "piłka",
  "pilka",
  "dnia dziecka",
  "dzień dziecka",
  "dzien dziecka",
  "food truck",
  "disco party",
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function shouldIncludeEvent(event) {
  const text = normalizeText(
    `${event.title} ${event.description} ${event.category || ""}`
  );

  const hasIncludedKeyword = INCLUDE_KEYWORDS.some((keyword) =>
    text.includes(normalizeText(keyword))
  );

  const hasExcludedKeyword = EXCLUDE_KEYWORDS.some((keyword) =>
    text.includes(normalizeText(keyword))
  );

  return hasIncludedKeyword && !hasExcludedKeyword;
}

function makeId(event) {
  return normalizeText(`${event.date}-${event.title}-${event.place}`)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getShortDescription(text) {
  const clean = stripHtml(text);

  if (clean.length <= 170) {
    return clean;
  }

  return `${clean.slice(0, 167).trim()}...`;
}

function parsePolishDate(text) {
  const months = {
    stycznia: "01",
    lutego: "02",
    marca: "03",
    kwietnia: "04",
    maja: "05",
    czerwca: "06",
    lipca: "07",
    sierpnia: "08",
    września: "09",
    wrzesnia: "09",
    października: "10",
    pazdziernika: "10",
    listopada: "11",
    grudnia: "12",
  };

  const normalized = normalizeText(text);

  const fullDateMatch = normalized.match(
    /(\d{1,2})\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|wrzesnia|pazdziernika|listopada|grudnia),?\s+(\d{4})/
  );

  if (fullDateMatch) {
    const [, day, monthName, year] = fullDateMatch;
    return `${year}-${months[monthName]}-${day.padStart(2, "0")}`;
  }

  const currentYear = new Date().getFullYear();

  const shortDateMatch = normalized.match(
    /(\d{1,2})\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|wrzesnia|pazdziernika|listopada|grudnia)/
  );

  if (shortDateMatch) {
    const [, day, monthName] = shortDateMatch;
    return `${currentYear}-${months[monthName]}-${day.padStart(2, "0")}`;
  }

  const isoDateMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (isoDateMatch) {
    return isoDateMatch[0];
  }

  return null;
}

function parseEventBlocksFromPultusk(html, source) {
  const blocks = html.split(/<h3|<h2/gi);
  const events = [];

  for (const rawBlock of blocks) {
    const block = `<h3${rawBlock}`;

    if (!block.includes("tribe-events") && !block.includes("@")) {
      continue;
    }

    const titleMatch =
      block.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i) ||
      block.match(/>([^<>]{8,160})<\/h3>/i);

    if (!titleMatch) {
      continue;
    }

    const url = titleMatch[1]?.startsWith("http")
      ? titleMatch[1]
      : source.url;

    const titleRaw = titleMatch[2] || titleMatch[1];
    const title = stripHtml(titleRaw);

    if (!title || title.length < 5) {
      continue;
    }

    const plainBlock = stripHtml(block);
    const date = parsePolishDate(plainBlock);

    if (!date) {
      continue;
    }

    const dateRangeMatch = plainBlock.match(
      /(\d{1,2}\s+[a-ząćęłńóśźż]+(?:,?\s+\d{4})?)\s*@.*?-\s*(\d{1,2}\s+[a-ząćęłńóśźż]+(?:,?\s+\d{4})?)/i
    );

    let endDate;

    if (dateRangeMatch) {
      endDate = parsePolishDate(dateRangeMatch[2]) || undefined;
    }

    const event = {
      id: makeId({
        title,
        date,
        place: source.place,
      }),
      title,
      date,
      ...(endDate ? { endDate } : {}),
      place: source.place,
      category: "wydarzenie",
      description: getShortDescription(plainBlock.replace(title, "")),
      url,
      source: source.name,
    };

    if (shouldIncludeEvent(event)) {
      events.push(event);
    }
  }

  return events;
}
function getDuplicateKey(event) {
  const text = normalizeText(`${event.title} ${event.description || ""}`);

  if (text.includes("teraz pultusk") || text.includes("pultuskart")) {
    return `${event.date}-teraz-pultusk-${normalizeText(event.place)}`;
  }

  if (text.includes("wianki")) {
    return `${event.date}-wianki-${normalizeText(event.place)}`;
  }

  if (text.includes("pojezuickie") || text.includes("wzgorze abrahama")) {
    return `${event.date}-pojezuickie-piwnice-${normalizeText(event.place)}`;
  }

  return event.id || makeId(event);
}

function deduplicateEvents(events) {
  const seen = new Set();
  const result = [];

  for (const event of events) {
    const key = getDuplicateKey(event);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push({
      ...event,
      id: event.id || makeId(event),
    });
  }

  return result;
}
async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "SovaHouseEventsBot/1.0 (+https://www.sovahouse.pl; wydarzenia lokalne)",
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać ${url}: ${response.status}`);
  }

  return response.text();
}

async function readExistingEvents() {
  try {
    const rawEvents = await fs.readFile(eventsPath, "utf-8");
    return JSON.parse(rawEvents);
  } catch (error) {
    console.warn("Nie udało się odczytać events.json. Tworzę nową listę.");
    return [];
  }
}

async function main() {
  const existingEvents = await readExistingEvents();
  const foundEvents = [];

  for (const source of SOURCES) {
    console.log(`Pobieram: ${source.url}`);

    const html = await fetchHtml(source.url);
    const sourceEvents = parseEventBlocksFromPultusk(html, source);

    console.log(
      `Źródło "${source.name}": znaleziono ${sourceEvents.length} pasujących wydarzeń.`
    );

    foundEvents.push(...sourceEvents);
  }

  const allEvents = deduplicateEvents([...existingEvents, ...foundEvents])
    .filter((event) => {
      const eventEndDate = new Date(event.endDate || event.date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      return eventEndDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  await fs.writeFile(eventsPath, JSON.stringify(allEvents, null, 2) + "\n");

  console.log(
    `Gotowe. W events.json zapisano ${allEvents.length} aktualnych wydarzeń.`
  );
}

main().catch((error) => {
  console.error("Błąd aktualizacji wydarzeń:");
  console.error(error);
  process.exit(1);
});
