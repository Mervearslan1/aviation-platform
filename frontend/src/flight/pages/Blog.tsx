import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Article } from '../../shared/api'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

const FEATURED: Article = {
  id: 0,
  title: 'Havacılıkta iniş safhasının kritik / operasyonel önemi',
  slug: 'inis-safhasinin-kritik-onemi',
  summary: '2025–2026 pist kazaları üzerinden iniş operasyonu ve emniyet dersleri.',
}

export function Blog() {
  const { t } = useI18n()
  const [posts, setPosts] = useState<Article[]>([])
  useEffect(() => {
    api.articles(24).then(setPosts).catch(() => setPosts([]))
  }, [])
  const rest = posts.filter((p) => p.slug !== FEATURED.slug)
  return (
    <div className="blog-scene min-h-full">
      <section className="border-b border-[var(--stroke)]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.blogKicker}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold md:text-6xl">{t.blogTitle}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">{t.blogManifest}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/blog/yaz">{t.blogWriteCta}</Button>
            <Button variant="secondary" to="/katil">{t.navJoin}</Button>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link to={`/blog/${FEATURED.slug}`} className="article-sheet grid overflow-hidden rounded-3xl md:grid-cols-[1.3fr_0.7fr]">
          <div className="min-h-[240px] bg-cover bg-center md:min-h-[380px]" style={{ backgroundImage: 'url(/blog/cover.jpg)' }} />
          <div className="flex flex-col justify-center p-6 md:p-10">
            <p className="font-mono text-xs text-[var(--amber)]">01</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">{FEATURED.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{FEATURED.summary}</p>
            <span className="mt-6 font-extrabold">{t.navBlog} →</span>
          </div>
        </Link>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="surface rounded-2xl p-5 hover:border-[var(--amber)]">
              <h3 className="text-lg font-extrabold">{p.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm text-[var(--muted)]">{p.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
