import { Link } from 'react-router-dom'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Blog() {
  const { t } = useI18n()
  return (
    <div className="blog-scene min-h-full">
      <section>
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
      <div className="mx-auto max-w-6xl px-4 pb-14">
        <Link to="/blog/inis-safhasinin-kritik-onemi" className="relative block min-h-[420px] overflow-hidden rounded-3xl md:min-h-[520px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/blog/cover.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative flex min-h-[420px] flex-col justify-end p-8 text-white md:min-h-[520px] md:p-12">
            <p className="font-mono text-xs text-[var(--amber)]">Elif Yılmaz</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-extrabold md:text-4xl">
              Havacılıkta iniş safhasının kritik / operasyonel önemi
            </h2>
            <p className="mt-3 max-w-2xl text-white/85">
              2025–2026 pist kazaları üzerinden iniş operasyonu ve emniyet dersleri.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
