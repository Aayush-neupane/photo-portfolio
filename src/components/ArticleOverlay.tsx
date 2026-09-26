import { Fragment, useEffect, useRef } from 'react';
import type { Post } from '../data/posts';

interface ArticleOverlayProps {
  post: Post;
  onClose: () => void;
}

export default function ArticleOverlay({ post, onClose }: ArticleOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    scrollRef.current?.scrollTo({ top: 0 });
    return () => { last?.focus(); };
  }, []);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="arTitle">
      <div className="pv-top">
        <button className="pv-back" ref={closeRef} type="button" onClick={onClose}>← <span>Journal</span></button>
        <span className="mono">{post.date} · {post.read}</span>
      </div>
      <article className="pv-scroll" ref={scrollRef} tabIndex={0}>
        <div className="wrap ar-wrap">
          <p className="mono-label">{post.cat} — {post.date} · {post.read}</p>
          <h2 className="pv-title" id="arTitle">{post.title}</h2>
          <figure className="ar-cover">
            <img src={post.img.src} alt={post.img.alt} />
            <figcaption className="mono">{post.cap}</figcaption>
          </figure>
          <div className="ar-body">
            {post.body.map((t, i) => (
              i === 2 ? (
                <Fragment key={i}>
                  <h4>A short aside</h4>
                  <p>{t}</p>
                </Fragment>
              ) : (
                <p key={i}>{t}</p>
              )
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
