export default function Manifesto() {
  return (
    <section className="manifesto" aria-label="Statement">
      <div className="wrap manifesto-grid">
        <div className="sec-index" data-reveal><span>01</span><em>Introduction</em></div>
        <div className="manifesto-body">
          <p className="lede" data-reveal>I photograph streets, skies, and the <em>quiet moments</em> between them — driven by natural light, honest frames, and details that are often overlooked.</p>
          <div className="manifesto-row" data-reveal>
            <p>Shot between classes, walks home and trips to the valley — one habit: stopping when the light changes. No crew, no plan beyond looking. If it felt true, it stays.</p>
            <a href="#about" className="text-link">More about me →</a>
          </div>
          <dl className="stats" data-reveal>
            <div><dd>70+</dd><dt>Frames in the gallery</dt></div>
            <div><dd>08</dd><dt>Long-term series</dt></div>
            <div><dd>03</dd><dt>Home grounds</dt></div>
            <div><dd>02</dd><dt>Feline critics</dt></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
