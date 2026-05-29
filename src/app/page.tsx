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
          <span>Tu będzie Twoja mapa</span>
          <small>miejsce na Google My Maps</small>
          <div className="qrBox">QR</div>
          <small>miejsce na kod QR do mapy</small>
        </div>
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
  action="mailto:kruczy.borek@gmail.com"
  method="post"
  encType="text/plain"
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

      <section id="kontakt" className="section contact">
        <p className="sectionKicker">Kontakt</p>
        <h2>Kontakt</h2>
        <p>E-mail: kruczy.borek@gmail.com</p>
        <p>Telefon: +48 609 703 338</p>
        <p>Lokalizacja: Kruczy Borek</p>
      </section>
    </main>
  );
}
