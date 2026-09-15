import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react'

export type WordPadHandle = {
  getHtml: () => string
  setHtml: (html: string) => void
  insertHtml: (html: string) => void
}

type Props = {
  disabled?: boolean
  placeholder: string
}

function run(cmd: string, value?: string) {
  document.execCommand(cmd, false, value)
}

export const WordPad = forwardRef<WordPadHandle, Props>(function WordPad({ disabled, placeholder }, ref) {
  const page = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getHtml: () => page.current?.innerHTML || '',
    setHtml: (html: string) => {
      if (page.current) page.current.innerHTML = html
    },
    insertHtml: (html: string) => {
      page.current?.focus()
      run('insertHTML', html)
    },
  }))

  return (
    <div className="word-pad overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-2)]">
      <div className="word-ribbon flex flex-wrap items-center gap-1 border-b border-[var(--stroke)] bg-[var(--panel)] px-2 py-2">
        <select className={tool} disabled={disabled} defaultValue="Outfit" title="Yazı tipi" onChange={(e) => run('fontName', e.target.value)}>
          <option value="Outfit">Outfit</option>
          <option value="Calibri">Calibri</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times</option>
          <option value="IBM Plex Mono">Mono</option>
        </select>
        <select className={tool} disabled={disabled} defaultValue="3" title="Punto" onChange={(e) => run('fontSize', e.target.value)}>
          <option value="1">10</option>
          <option value="2">13</option>
          <option value="3">16</option>
          <option value="4">18</option>
          <option value="5">24</option>
          <option value="6">32</option>
          <option value="7">48</option>
        </select>
        <span className={sep} />
        <Ribbon disabled={disabled} title="Kalın" onClick={() => run('bold')}>
          <path d="M6 5h6.2a3.3 3.3 0 0 1 0 6.6H6V5Zm0 6.6h7a3.5 3.5 0 0 1 0 7H6v-7Z" />
        </Ribbon>
        <Ribbon disabled={disabled} title="İtalik" onClick={() => run('italic')}>
          <path d="M10 5h8M6 19h8M14.5 5 9.5 19" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Altı çizili" onClick={() => run('underline')}>
          <path d="M7 5v7.2a5 5 0 0 0 10 0V5M6 20h12" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Üstü çizili" onClick={() => run('strikeThrough')}>
          <path d="M5 12h14M9 8.2C9.4 6.6 10.8 5.5 13 5.5c2.4 0 4 1.1 4 2.8 0 1.2-.7 2-2.2 2.6M8.2 13.5C8.6 16 10.4 18 13.2 18c2.6 0 4.3-1.4 4.6-3.2" />
        </Ribbon>
        <label className={`${tool} w-8 cursor-pointer p-0`} title="Yazı rengi">
          <input type="color" className="h-7 w-full cursor-pointer bg-transparent" defaultValue="#10233d" disabled={disabled} onChange={(e) => run('foreColor', e.target.value)} />
        </label>
        <label className={`${tool} w-8 cursor-pointer p-0`} title="Vurgu">
          <input type="color" className="h-7 w-full cursor-pointer bg-transparent" defaultValue="#f5c542" disabled={disabled} onChange={(e) => run('hiliteColor', e.target.value)} />
        </label>
        <span className={sep} />
        <Ribbon disabled={disabled} title="Sola" onClick={() => run('justifyLeft')}>
          <path d="M4 7h16M4 12h10M4 17h16" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Ortala" onClick={() => run('justifyCenter')}>
          <path d="M4 7h16M7 12h10M4 17h16" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Sağa" onClick={() => run('justifyRight')}>
          <path d="M4 7h16M10 12h10M4 17h16" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Madde" onClick={() => run('insertUnorderedList')}>
          <circle cx="6" cy="7" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="6" cy="17" r="1.2" fill="currentColor" stroke="none" />
          <path d="M10 7h10M10 12h10M10 17h10" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Numara" onClick={() => run('insertOrderedList')}>
          <path d="M5 8V6h2M5 13h2M5 16.5h2v1.5H5M10 7h10M10 12h10M10 17h10" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Girinti azalt" onClick={() => run('outdent')}>
          <path d="M14 6h6M4 12h8M14 12h6M14 18h6M8 9l-4 3 4 3" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Girinti" onClick={() => run('indent')}>
          <path d="M4 6h6M12 12h8M4 12h6M4 18h6M16 9l4 3-4 3" />
        </Ribbon>
        <span className={sep} />
        <Ribbon
          disabled={disabled}
          title="Bağlantı"
          onClick={() => {
            const url = window.prompt('Link')
            if (url) run('createLink', url)
          }}
        >
          <path d="M10 13.5 8.8 14.7a3.2 3.2 0 0 1-4.5-4.5l2.4-2.4a3.2 3.2 0 0 1 4.5 0M14 10.5l1.2-1.2a3.2 3.2 0 0 1 4.5 4.5l-2.4 2.4a3.2 3.2 0 0 1-4.5 0" />
        </Ribbon>
        <Ribbon
          disabled={disabled}
          title="Görsel"
          onClick={() => {
            const url = window.prompt('Görsel linki')
            if (url) run('insertHTML', `<figure><img src="${url}" alt="" /></figure>`)
          }}
        >
          <rect x="4" y="6" width="16" height="13" rx="2" />
          <circle cx="9" cy="11" r="1.4" />
          <path d="m8 16 3.2-3.4 2.3 2.4L16 12.5 20 16" />
        </Ribbon>
        <Ribbon
          disabled={disabled}
          title="Ses"
          onClick={() => {
            const url = window.prompt('Ses linki')
            if (url) run('insertHTML', `<p><audio controls src="${url}"></audio></p>`)
          }}
        >
          <path d="M5 10v4h3l4 3V7L8 10H5Z" />
          <path d="M16 9.2a4 4 0 0 1 0 5.6M18.4 7.2a7 7 0 0 1 0 9.6" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Başlık" onClick={() => run('formatBlock', 'H2')}>
          <path d="M6 6v12M14 6v12M6 12h8" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Paragraf" onClick={() => run('formatBlock', 'P')}>
          <path d="M8 6h7a3.5 3.5 0 0 1 0 7H11v5M8 6v12" />
        </Ribbon>
        <Ribbon disabled={disabled} title="Biçimi sil" onClick={() => run('removeFormat')}>
          <path d="m6 18 9-12M8.5 18H18M7 14.5 5 18" />
        </Ribbon>
      </div>
      <div
        ref={page}
        className="word-page min-h-[50vh] bg-[var(--bg-2)] px-5 py-6 text-base leading-7 outline-none sm:min-h-[60vh] md:min-h-[70vh] md:px-16 md:py-12"
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onMouseDown={() => page.current?.focus()}
      />
    </div>
  )
})

function Ribbon({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button type="button" title={title} aria-label={title} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={tool}>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  )
}

const tool =
  'inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-transparent px-1.5 text-xs text-[var(--ink)] hover:border-[var(--stroke)] hover:bg-[var(--bg)] disabled:opacity-40'
const sep = 'mx-1 h-6 w-px bg-[var(--stroke)]'
