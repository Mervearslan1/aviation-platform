import json
import re
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

pdf = Path(r"C:\Users\merve.arslan\Downloads\Landing accidents .pdf")
out = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-platform\frontend\public\blog")
out.mkdir(parents=True, exist_ok=True)

reader = PdfReader(str(pdf))

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


def wrap_terms(body: str) -> str:
    used = set()
    for term, _ in sorted(terms, key=lambda x: len(x[0]), reverse=True):
        if term in used:
            continue
        pattern = re.compile(re.escape(term), re.IGNORECASE)
        if not pattern.search(body):
            continue
        used.add(term)
        body = pattern.sub(
            lambda m, t=term: f'<button type="button" class="term" data-term="{t}">{m.group(0)}</button>',
            body,
            count=1,
        )
    return body


def paras(text: str) -> list[str]:
    text = re.sub(r"[ \t]*\n[ \t]*", " ", text)
    text = re.sub(r" +", " ", text).strip()
    if not text:
        return []
    sentences = re.split(r"(?<=[.!?])\s+", text)
    out_p, buf = [], []
    for s in sentences:
        buf.append(s)
        if len(" ".join(buf)) > 420:
            out_p.append(" ".join(buf))
            buf = []
    if buf:
        out_p.append(" ".join(buf))
    return out_p


html: list[str] = []
fig_n = 0
for page in reader.pages:
    raw = page.extract_text() or ""
    for p in paras(raw):
        html.append(f"<p>{wrap_terms(p)}</p>")
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
        w, h = int(obj["/Width"]), int(obj["/Height"])
        data = obj.get_data()
        if w * h * 3 != len(data):
            continue
        fig_n += 1
        img = Image.frombytes("RGB", (w, h), data)
        if max(w, h) > 1600:
            img.thumbnail((1600, 1600))
        path = out / f"fig-{fig_n}.jpg"
        img.save(path, "JPEG", quality=86)
        html.append(f'<figure><img src="/blog/fig-{fig_n}.jpg" alt="Yazı görseli {fig_n}" /></figure>')

data = {
    "slug": "inis-safhasinin-kritik-onemi",
    "title": "Havacılıkta iniş safhasının kritik / operasyonel önemi",
    "summary": "2025–2026’daki iki ölümcül pist kazası üzerinden iniş operasyonunun aşamaları, ortak hatalar ve emniyet dersleri.",
    "cover": "/blog/cover.jpg",
    "background": "/blog/bg.jpg",
    "html": "\n".join(html),
    "terms": {k: v for k, v in terms},
}
(out / "landing-accidents.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print("figures", fig_n, "html", len(data["html"]))
