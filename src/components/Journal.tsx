import { useState } from 'react';
import { POSTS, type Post } from '../data/posts';

interface JournalProps {
  onOpen: (id: string) => void;
}

function JournalCard({ post, onOpen }: { post: Post; onOpen: (id: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  const markLoaded = (): void => setLoaded(true);

  return (
    <article
      className="j-card"
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${post.title}`}
      onClick={() => onOpen(post.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(post.id); }
      }}
    >
      <div className="j-media">
        <img
          loading="lazy"
          decoding="async"
          src={post.img.src}
          alt={post.img.alt}
          className={loaded ? 'loaded' : undefined}
          ref={(el) => { if (el && el.complete && el.naturalWidth) markLoaded(); }}
          onLoad={markLoaded}
          onError={markLoaded}
        />
      </div>
      <div>
        <span className="j-meta"><span>{post.date}</span><span>·</span><span>{post.cat}</span><span>·</span><span>{post.read}</span></span>
        <h3>{post.title}</h3>
        <p>{post.ex}</p>
      </div>
    </article>
  );
}

export default function Journal({ onOpen }: JournalProps) {
  return (
    <section className="section" id="journal" aria-label="Journal">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div className="sec-index"><span>05</span><em>Journal</em></div>
          <h2 className="sec-title">Notes &amp; field stories</h2>
          <p className="sec-note">Occasional writing on light, process and the frames that stayed with me.</p>
        </div>
        <div className="journal-grid">
          {POSTS.map((post) => (
            <JournalCard key={post.id} post={post} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
