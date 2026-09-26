interface Service {
  n: string;
  title: string;
  desc: string;
  meta: string;
}

const SERVICES: Service[] = [
  { n: '01', title: 'Streets & Everyday', desc: 'Jhapa on foot — flags, wires, floodlights and the small pride of hometown infrastructure.', meta: 'Jhapa · available light' },
  { n: '02', title: 'Skies & Weather', desc: 'Monsoon build-ups, sunbreaks and grey ceilings. The sky does the work; I just look up.', meta: 'Eastern hills · changing sky' },
  { n: '03', title: 'Night & Moon', desc: 'Crescents through branches, copper moons, ferris lights — the town after hours.', meta: 'Night · long looks' },
  { n: '04', title: 'Garden Macro', desc: 'Flowers photographed like portraits, webs and droplets — all within the home garden.', meta: 'Home · morning rounds' },
  { n: '05', title: 'Heritage & Travel', desc: 'Trips to the valley — Boudhanath, Swoyambhunath and the road between.', meta: 'Kathmandu valley · on foot' },
  { n: '06', title: 'Prints & Requests', desc: 'Favourite frames as prints, and small local shoots on request — ask me anything.', meta: 'On request · just ask' },
];

const PROCESS: { t: string; d: string }[] = [
  { t: 'Meter', d: 'We talk through ideas and scout where the light lands.' },
  { t: 'Expose', d: 'Small crew, available light, room to breathe on the day.' },
  { t: 'Develop', d: 'Shortlisted here — selects circled on the contact sheet.' },
  { t: 'Print', d: 'Finals, fine-art albums and framed editions, delivered with care.' },
];

export default function Services() {
  return (
    <section className="section section-alt" id="services" aria-label="Services">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div className="sec-index"><span>04</span><em>Services</em></div>
          <h2 className="sec-title">What I photograph</h2>
          <p className="sec-note">No packages, no studio — just the work, grouped by habit. Everything here was shot for the love of it.</p>
        </div>
        <ol className="services">
          {SERVICES.map((s) => (
            <li key={s.n} data-reveal>
              <span className="s-num">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <p className="mono s-meta">{s.meta}</p>
              </div>
              <span className="s-arrow" aria-hidden="true">→</span>
            </li>
          ))}
        </ol>
        <div className="process" data-reveal>
          <h3 className="mono-label">From exposure to print</h3>
          <ol>
            {PROCESS.map((step) => (
              <li key={step.t}><b>{step.t} —</b> {step.d}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
