import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'
import { FIELD_POSTS } from '../../shared/posts'

export function Blog() {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const posts = FIELD_POSTS
  const post = posts[i] || posts[0]
  const prev = () => setI((n) => (n - 1 + posts.length) % posts.length)
  const next = () => setI((n) => (n + 1) % posts.length)
  return (
    <div className="blog-scene min-h-full">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">{t.blogTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:mt-3 sm:text-base sm:leading-7">
          {t.blogManifest}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
          <Button to="/blog/yaz" className="min-h-10 px-4 text-sm">
            {t.blogWriteCta}
          </Button>
          <Button variant="secondary" to="/katil" className="min-h-10 px-4 text-sm">
            {t.navJoin}
          </Button>
        </div>
        <div className="relative mt-6 sm:mt-8">
          <Link to={`/blog/${post.slug}`} className="group relative block min-h-[320px] overflow-hidden rounded-3xl sm:min-h-[420px] md:min-h-[480px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${post.cover})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            <div className="relative flex min-h-[320px] flex-col justify-end p-6 text-white sm:min-h-[420px] sm:p-8 md:min-h-[480px] md:p-12">
              <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--amber)] sm:text-xs">
                {String(i + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')} · {post.author}
              </p>
              <h2 className="mt-2 max-w-3xl text-xl font-extrabold sm:mt-3 sm:text-3xl md:text-4xl">{post.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/85 sm:mt-4 sm:text-lg">{post.summary}</p>
            </div>
          </Link>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button type="button" className="blog-nav" onClick={prev} aria-label="<">
              ‹
            </button>
            <button type="button" className="blog-nav" onClick={next} aria-label=">">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
