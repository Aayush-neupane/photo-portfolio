import { useEffect, useState } from 'react';
import { playShutter } from '../lib/shutter';

export interface EnquiryPrefill {
  type: string;
  message: string;
}

interface ContactProps {
  prefill: EnquiryPrefill | null;
  formKey: number;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Contact({ prefill, formKey }: ContactProps) {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setError(null);
    setSent(false);
  }, [formKey]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (name: string): string => {
      const el = f.elements.namedItem(name);
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement
        ? el.value.trim()
        : '';
    };
    const name = val('name');
    const email = val('email');
    const type = val('type');
    const message = val('message');
    const date = val('date');
    const location = val('location');

    if (!name) { setError('Please add your name.'); return; }
    if (!EMAIL_RE.test(email)) { setError('That email doesn’t look right — mind checking it?'); return; }
    if (!type) { setError('Please choose a project type.'); return; }
    if (!message) { setError('Please tell me a little about the day.'); return; }
    if (val('_honey')) return; // bots go nowhere

    setError(null);
    setSending(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/theghostoftheuchiha38@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          type,
          date,
          location,
          message,
          _subject: `Photo enquiry (${type}) from ${name}`,
          _autoresponse: `Hi ${name}, thanks for writing about your ${type.toLowerCase()}! I read every note myself and reply within 48 hours. — Aayush Neupane`,
          _captcha: 'false',
          _honey: '',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
      playShutter('send');
      f.reset();
    } catch {
      setError('Couldn’t send just now — email me directly at the address above.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section section-dark" id="contact" aria-label="Contact">
      <div className="wrap contact-grid">
        <div>
          <div className="sec-index on-dark" data-reveal><span>06</span><em>Contact</em></div>
          <h2 className="contact-title" id="contact-title" tabIndex={-1} data-reveal>Let’s create something <em>worth remembering.</em></h2>
          <p className="contact-sub" data-reveal>Tell me about your day, your dates and the feeling you’re after. I reply personally within 48 hours.</p>
          <ul className="contact-lines" data-reveal>
            <li><span className="mono">Email</span><a href="mailto:theghostoftheuchiha38@gmail.com">theghostoftheuchiha38@gmail.com</a></li>
            <li><span className="mono">Instagram</span><a href="https://www.instagram.com/dynamic_aayush38" target="_blank" rel="noopener">@dynamic_aayush38</a></li>
            <li><span className="mono">Base</span><span>Jhapa, Nepal — no studio, just streets</span></li>
            <li><span className="mono">Availability</span><span><i className="avail-dot" /> Personal work · prints & small shoots on request</span></li>
          </ul>
        </div>
        <form className="form" key={formKey} onSubmit={onSubmit} noValidate data-reveal>
          <div className="form-row">
            <div className="field">
              <label htmlFor="fName">Name *</label>
              <input id="fName" name="name" type="text" autoComplete="name" required placeholder="Your full name" />
            </div>
            <div className="field">
              <label htmlFor="fEmail">Email *</label>
              <input id="fEmail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="fType">Project type *</label>
              <select id="fType" name="type" required defaultValue={prefill?.type ?? ''}>
                <option value="">Select…</option>
                <option>Print request</option>
                <option>Portrait session</option>
                <option>Event / gathering</option>
                <option>Collaboration</option>
                <option>Photo walk</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="fDate">Date</label>
              <input id="fDate" name="date" type="date" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="fLoc">Location</label>
            <input id="fLoc" name="location" type="text" autoComplete="address-level2" placeholder="Jhapa, Kathmandu valley, elsewhere…" />
          </div>
          <div className="field" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <label htmlFor="fCompany">Company</label>
            <input id="fCompany" name="_honey" type="text" autoComplete="off" tabIndex={-1} />
          </div>
          <div className="field">
            <label htmlFor="fMsg">Message *</label>
            <textarea id="fMsg" name="message" rows={5} required placeholder="Tell me about the day, the people, the light you’re hoping for…" defaultValue={prefill?.message ?? undefined} />
          </div>
          {error ? <p className="form-error mono" role="alert">{error}</p> : null}
          <button className="submit" type="submit" disabled={sending}>
            <span>{sending ? 'Sending…' : 'Send inquiry'}</span>
            <span aria-hidden="true">→</span>
          </button>
          <p className="mono form-note">No spam, no newsletters — your note goes straight to me.</p>
          {!sent ? null : (
            <p className="form-success" role="status">
              <b>Thank you — your note is on its way.</b>
              <span>I’ll reply within 48 hours. For anything urgent: +977 986-2862023.</span>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
