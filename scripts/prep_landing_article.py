import json
import re
from pathlib import Path

from pypdf import PdfReader

pdf = Path(r"C:\Users\merve.arslan\Downloads\Landing accidents .pdf")
out = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-platform\frontend\public\blog")
out.mkdir(parents=True, exist_ok=True)

reader = PdfReader(str(pdf))
raw = "\n".join((p.extract_text() or "") for p in reader.pages)
text = re.sub(r"[ \t]*\n[ \t]*", " ", raw)
text = re.sub(r" +", " ", text).strip()

figs = []
n = 0
for page in reader.pages:
    resources = page.get("/Resources")
    if not resources:
        continue
    xobj = resources.get("/XObject")
    if not xobj:
        continue
    xobj = xobj.get_object()
    for _name, ref in xobj.items():
        obj = ref.get_object()
        if obj.get("/Subtype") != "/Image":
            continue
        filt = obj.get("/Filter")
        data = obj.get_data()
        n += 1
        if filt == "/DCTDecode" or (isinstance(filt, list) and "/DCTDecode" in filt):
            path = out / f"fig-{n}.jpg"
            path.write_bytes(data)
            figs.append(f"/blog/fig-{n}.jpg")
        elif filt == "/FlateDecode":
            # skip raw bitmaps that are hard to decode
            continue

terms = [
    ("Yaklaşma", "Approach: uçağın seyir irtifasından piste kontrollü alçalışa geçtiği safha."),
    ("Approach", "Yaklaşma safhası; inişin pist görülmeden önce başlayan kısmı."),
    ("İniş", "Yaklaşmadan taksiye kadar uçağın yere indirildiği operasyon."),
    ("Flare", "Eşikte burnu hafif kaldırarak süzülüşü yumuşatma manevrası."),
    ("Taksi", "Yerde uçağın kendi gücüyle hareketi."),
    ("ATC", "Hava trafik kontrol; kule, yaklaşma ve yer kontrol birimleri."),
    ("Pist", "Uçağın kalkış ve iniş yaptığı kaplanmış yüzey (runway)."),
    ("Go-around", "Kararsız yaklaşmada inişi bırakıp tırmanışa geçme."),
    ("Unstable approach", "Hız, süzülüş veya konfigürasyonun stabilize olmadığı yaklaşma."),
    ("Emniyet", "Kazayı önleyecek prosedür, eğitim ve sistem bütünü."),
    ("Soruşturma", "Kaza sonrası resmi inceleme; ders çıkarmak için yapılır."),
]

# split into paragraphs by sentence groups
sentences = re.split(r"(?<=[.!?])\s+", text)
paras = []
buf = []
for s in sentences:
    buf.append(s)
    if len(" ".join(buf)) > 420:
        paras.append(" ".join(buf))
        buf = []
if buf:
    paras.append(" ".join(buf))

html_parts = []
fig_i = 0
for i, para in enumerate(paras):
    body = para
    for term, _def in sorted(terms, key=lambda x: len(x[0]), reverse=True):
        pattern = re.compile(re.escape(term), re.IGNORECASE)
        body = pattern.sub(
            lambda m: f'<button type="button" class="term" data-term="{term}">{m.group(0)}</button>',
            body,
            count=1,
        )
    html_parts.append(f"<p>{body}</p>")
    if figs and i in (1, 4, 8, 12) and fig_i < len(figs):
        html_parts.append(f'<img src="{figs[fig_i]}" alt="Yazı görseli {fig_i + 1}" />')
        fig_i += 1

data = {
    "slug": "inis-safhasinin-kritik-onemi",
    "title": "Havacılıkta iniş safhasının kritik / operasyonel önemi",
    "summary": "2025–2026’daki iki ölümcül pist kazası üzerinden iniş operasyonunun aşamaları, ortak hatalar ve emniyet dersleri.",
    "cover": "/blog/cover.jpg",
    "background": "/blog/bg.jpg",
    "html": "\n".join(html_parts),
    "terms": {k: v for k, v in terms},
}

(out / "landing-accidents.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print("figs", len(figs), "paras", len(paras), "html", len(data["html"]))
