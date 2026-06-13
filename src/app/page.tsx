import eventsData from "../public/events.json";
type EventItem = {
  title: string;
  date: string;
  endDate?: string;
  place: string;
  category: string;
  description: string;
  url: string;
  source: string;
};

const events = eventsData as EventItem[];

function formatEventDate(date: string, endDate?: string) {
  const start = new Date(date);
  const end = endDate ? new Date(endDate) : null;

  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
  });

  if (end) {
    return `${formatter.format(start)} – ${formatter.format(end)}`;
  }

  return formatter.format(start);
}

const upcomingEvents = events
  .filter((event) => {
    const eventEndDate = new Date(event.endDate || event.date);
    return eventEndDate >= new Date();
  })
  .sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
const galleryImages = [
  "https:/front domku.jpg",
  "https:/Wejscie i furtka.jpg",
  "https:/jadalnia 1.jpg",
  "https:/jadalnia widok od kuchni.jpg",
  "https:/kuchnia 1.jpg",
  "https:/front domku.jpg",
];

export default function Home() {
  return (
    <main className="site">
      <nav className="nav">
        <img src="/Logo Sova House.png" alt="Sova House" className="navLogo" />
        <div className="navLinks">
          <a href="#galeria">Galeria</a>
          <a href="#atrakcje">Lokalne atrakcje</a>
          <a href="#wydarzenia">Wydarzenia</a>
          <a href="#rejsy">Rejsy</a>
          <a href="#instrukcja">Instrukcja</a>
          <a href="#rezerwacja">Rezerwacja</a>
          <a href="#kontakt">Kontakt</a>
        </div>
      </nav>

      <section className="hero">
        <div className="heroOverlay" />
        <div className="heroContent">
          <img src="/Logo Sova House.png" alt="Sova House" className="heroLogo" />
          <p className="eyebrow">Kruczy Borek · las · cisza · woda</p>
          <h1>Sova House</h1>
          <p className="lead">
            Domek w lesie do wynajęcia. Miejsce na weekendowy reset, spokojny
            odpoczynek i małą ucieczkę od codziennego hałasu.
          </p>
          <div className="heroActions">
            <a href="#rezerwacja" className="buttonPrimary">Zapytaj o termin</a>
            <a href="#galeria" className="buttonGhost">Zobacz galerię</a>
          </div>
        </div>
      </section>

      <section className="intro section">
        <div>
          <p className="sectionKicker">O miejscu</p>
          <h2>Leśny azyl blisko Zalewu Zegrzyńskiego</h2>
        </div>
        <p>
          Sova House to kameralny domek położony w Kruczym Borku. Strona powstała
          jako spokojna baza informacji dla gości: zdjęcia, atrakcje w okolicy,
          rejsy, instrukcja obsługi domu i kontakt w sprawie rezerwacji.
        </p>
      </section>

      <section id="galeria" className="section">
        <div className="sectionHeader">
          <p className="sectionKicker">Galeria</p>
          <h2>Zdjęcia</h2>
        </div>
        <div className="galleryGrid">
          {galleryImages.map((image, index) => (
            <img key={image} src={image} alt={`Sova House galeria ${index + 1}`} />
          ))}
        </div>
      </section>

      <section id="atrakcje" className="section split">
        <div>
          <p className="sectionKicker">Lokalne atrakcje</p>
          <h2>Mapa miejsc wartych zobaczenia</h2>
          <p>
            Opis lokalnych atrakcji, tras spacerowych, miejsc nad
            wodą, restauracji, punktów widokowych i Twoja własna mapa Google My Maps.
          </p>
        </div>
        <div className="placeholderCard">
  <span>Mapa okolicy Sova House</span>
  <small>Restauracje, spacery i atrakcje</small>

 <a
  href="https://www.google.com/maps/d/u/0/viewer?mid=1z3-SDY6JPCpqJE6mYiFizekLls7p8ZE&ll=52.71921613478716%2C20.9495643&z=10"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="/mapa_okolicy_sova_house.png"
    alt="Kod QR do mapy okolicy Sova House"
    style={{
      width: "220px",
      maxWidth: "100%",
      height: "auto",
      margin: "20px 0",
    }}
  />
</a>

<p>
  <a
    href="https://www.google.com/maps/d/u/0/viewer?mid=1z3-SDY6JPCpqJE6mYiFizekLls7p8ZE&ll=52.71921613478716%2C20.9495643&z=10"
    target="_blank"
    rel="noopener noreferrer"
  >
    🦉 Otwórz mapę okolicy
  </a>
</p>

<small>Zeskanuj kod QR telefonem</small>
</div>
      </section>
      <section className="route-card">
  <div className="route-text">
    <p className="eyebrow">Trasa rowerowa</p>

    <h2>Sova House – Pułtusk – Grabówiec – Sova House</h2>

    <p>
      Krótka, poglądowa propozycja wycieczki rowerowej z Kruczego Borku
      w stronę Pułtuska i Grabowca. Trasa prowadzi spokojnymi drogami
      przez okolice Narwi i wraca do Sova House.
    </p>

    <ul>
      <li>około 25,9 km</li>
      <li>około 1 godz. 20 min jazdy według Google Maps</li>
      <li>rysunek ma charakter poglądowy — nawigację otwórz w Google Maps</li>
    </ul>

    <a
      className="route-button"
      href="https://maps.app.goo.gl/AzeE97EyQgpm5YBN7"
      target="_blank"
      rel="noopener noreferrer"
    >
      Otwórz trasę w Google Maps
    </a>
  </div>

  <a
    className="route-image-link"
    href="https://maps.app.goo.gl/AzeE97EyQgpm5YBN7"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Otwórz trasę rowerową w Google Maps"
  >
    <img
      src="/trasa-rowerowa-pultusk-grabowiec.png"
      alt="Poglądowa mapa trasy rowerowej Sova House – Pułtusk – Grabówiec – Sova House"
      className="route-image"
    />
  </a>
</section>

      <section id="rejsy" className="section feature">
        <p className="sectionKicker">Rejsy</p>
        <h2>Rejsy po Zalewie Zegrzyńskim i Narwi</h2>
        <p>
          Osobna sekcja na opis rejsów, propozycje tras, zdjęcia łodzi, warunki,
          terminy oraz praktyczne informacje dla gości.
        </p>
      </section>

      <section id="instrukcja" className="section">
        <div className="sectionHeader">
          <p className="sectionKicker">Instrukcja obsługi domu</p>
          <h2>Wszystko, co gość powinien wiedzieć</h2>
        </div>
        <div className="cards">
          <div className="card"><h3>Przyjazd</h3><p>Check-in, klucze, dojazd i parkowanie.</p></div>
          <div className="card"><h3>Dom</h3><p>Ogrzewanie, światło, WiFi, kuchnia i wyposażenie.</p></div>
          <div className="card"><h3>Bezpieczeństwo</h3><p>Zasady ognia, lasu, odpadów i ciszy nocnej.</p></div>
        </div>
      </section>

      <section id="rezerwacja" className="section reservation">
        <div>
          <p className="sectionKicker">Rezerwacja</p>
          <h2>Zapytaj o dostępny termin</h2>
          <p>
            Formularz może na początku wysyłać wiadomość na e-mail. Później można
            podpiąć kalendarz, system płatności lub zewnętrzny system rezerwacji.
          </p>
        </div>

      <form
  className="form"
  action="https://formspree.io/f/xojbrolp"
  method="POST"
>
  <input
    name="name"
    placeholder="Imię i nazwisko"
  />

  <input
    name="email"
    placeholder="E-mail"
    type="email"
  />

  <input
    name="phone"
    placeholder="Telefon"
  />

  <input
    name="date"
    placeholder="Planowany termin"
  />

  <textarea
    name="message"
    placeholder="Wiadomość"
    rows={5}
  />

  <button type="submit">
    Wyślij zapytanie
  </button>
</form>
</section>
      <section id="kontakt" className="section contact">
        <p className="sectionKicker">Kontakt</p>
        <h2>Kontakt</h2>
        <p>E-mail: kruczy.borek@gmail.com</p>
<p>Telefon: +48 609 703 338</p>
<p>Lokalizacja: Kruczy Borek</p>

<p>
  Facebook:{" "}
  <a
    href="https://www.facebook.com/profile.php?id=61580666498457"
    target="_blank"
    rel="noopener noreferrer"
  >
    Sova House
  </a>
</p>
      </section>
    </main>
  );
}
