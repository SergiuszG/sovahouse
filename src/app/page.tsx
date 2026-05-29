export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1720",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <img
          src="/Logo Sova House.png"
          alt="Sova House"
          style={{
            width: "180px",
            marginBottom: "2rem",
          }}
        />

        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            letterSpacing: "0.1em",
          }}
        >
          Sova House
        </h1>

        <p
          style={{
            maxWidth: "700px",
            fontSize: "1.2rem",
            lineHeight: "1.8",
            opacity: 0.85,
          }}
        >
          Domek w lesie do wynajęcia w Kruczym Borku.
          <br />
          Cisza, drewno, natura i odpoczynek blisko Zalewu Zegrzyńskiego.
        </p>
      </section>
    </main>
  );
}
