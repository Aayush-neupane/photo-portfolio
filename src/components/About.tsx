const FACTS: [string, string][] = [
  ['Location', 'Jhapa, Nepal — trips to the valley'],
  ['Practice', 'Daily · streets, skies, garden'],
  ['Specialties', 'Sunsets · Night · Garden macro'],
  ['Day job', 'Web & game developer'],
];

export default function About() {
  return (
    <section className="section" id="about" aria-label="About the photographer">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div className="sec-index"><span>03</span><em>About</em></div>
          <h2 className="sec-title">Behind the camera</h2>
        </div>
        <div className="about-grid">
          <div className="about-media" data-reveal>
            <figure className="about-main">
              <img
                src="/me.JPG"
                alt="Aayush Neupane leaning against a tree in dappled sunlight"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mono">Lorem ipsum dolor</figcaption>
            </figure>
            <figure className="about-small">
              <img
                src="/gallery/f4bafb15-0bef-4072-a1b0-f8823320514a-1-105-c.jpeg"
                alt="Rows of prayer wheels at Swoyambhunath"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mono">Lorem ipsum dolor sit</figcaption>
            </figure>
          </div>
          <div className="about-body">
            <p className="about-lede" data-reveal>I’m Aayush — a developer from Jhapa who can’t leave the house without a camera.</p>
            <div data-reveal>
              <p>I’m 18, based in Jhapa, Nepal. I build websites and games by day — photography is the habit that gets me outside: morning rounds in the home garden, evening walks for the sunset, night skies when the town goes quiet.</p>
              <p>I shoot on whatever’s charged, in available light, with no crew and no plan beyond looking. One honest frame beats twenty hurried ones — most of what’s here was taken within a few kilometres of home, plus a few trips to the Kathmandu valley.</p>
            </div>
            <blockquote className="creed" data-reveal><p>Natural light. Honest frames. Details others walk past.</p></blockquote>
            <dl className="facts" data-reveal>
              {FACTS.map(([dt, dd]) => (
                <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>
              ))}
            </dl>
            <div className="about-lists" data-reveal>
              <div>
                <h3 className="mono-label">Day job</h3>
                <p>Websites and games — React, TypeScript, Unity. This site was designed and built the same way.</p>
              </div>
              <div>
                <h3 className="mono-label">Prints</h3>
                <p>Favourite frames available as prints — use the contact form and tell me which one.</p>
              </div>
            </div>
            <div className="kit" data-reveal>
              <h3 className="mono-label">How it’s made</h3>
              <dl className="facts">
                <div><dt>Camera</dt><dd>Phone camera — always in the pocket</dd></div>
                <div><dt>Light</dt><dd>Available light only — sun, streetlamps, moon</dd></div>
                <div><dt>Editing</dt><dd>Light touches — nothing staged, nothing faked</dd></div>
                <div><dt>Shortlist</dt><dd>Kept here; selects circled on the contact sheet</dd></div>
              </dl>
            </div>
            <div className="strip" data-reveal>
              <h3 className="mono-label">Test strip</h3>
              <div className="strip-row">
                {[0.45, 0.7, 1, 1.3, 1.65].map((b, i) => (
                  <figure className="strip-cell" key={['2s', '4s', '8s', '16s', '32s'][i]} style={{ filter: `brightness(${b})` }}>
                    <img src="/gallery/ca1ec9c0-a481-4bd7-b2c3-d84fe9be93dc-1-201-a.jpeg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    <figcaption className={i === 2 ? 'pick' : undefined}>{['2s', '4s', '8s', '16s', '32s'][i]}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="mono strip-note">Same frame, five exposures — 8s goes to print.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
