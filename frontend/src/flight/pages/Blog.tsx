import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Article } from '../../shared/api'
import { useI18n } from '../../shared/i18n'

export function Blog() {
  const { t } = useI18n()
  const [posts, setPosts] = useState<Article[]>([])
  useEffect(() => {
    api.articles(12).then(setPosts).catch(() => setPosts([]))
  }, [])
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border border-[var(--stroke)]">
        <div className="min-h-[200px] bg-cover bg-center md:min-h-[280px]" style={{ backgroundImage: 'url(/atmosphere/blog.jpg)' }} />
      </div>
      <h1 className="mt-6 text-3xl font-semibold md:text-4xl">{t.blogTitle}</h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">{t.blogLead}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.length === 0 ? (
          <p className="text-[var(--muted)]">{t.blogEmpty}</p>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="surface rounded-2xl p-6">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{p.summary}</p>
              {p.slug ? (
                <Link className="mt-4 inline-block font-medium" to={`/blog/${p.slug}`}>
                  →
                </Link>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
