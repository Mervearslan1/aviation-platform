import json
from pathlib import Path

p = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-platform\frontend\public\blog\landing-accidents.json")
d = json.loads(p.read_text(encoding="utf-8"))
short = {
    "Yaklaşma": "Pist öncesi kontrollü alçalış.",
    "Approach": "Yaklaşma safhası (approach).",
    "İniş": "Yaklaşmadan taksiye yere indirme.",
    "Flare": "Eşikte burnu kaldırıp yumuşak temas.",
    "Taksi": "Yerde kendi gücüyle hareket.",
    "ATC": "Hava trafik kontrol (kule/APP).",
    "Pist": "Kalkış ve iniş yüzeyi (runway).",
    "Go-around": "Kararsız yaklaşmada pas geçme.",
    "Unstable approach": "Stabilize olmamış yaklaşma.",
    "Emniyet": "Kazayı önleyen prosedür ve sistemler.",
    "Soruşturma": "Kaza sonrası resmi inceleme.",
}
d["terms"] = short
html = d["html"]
for term, tip in short.items():
    old = f'data-term="{term}"'
    new = f'data-term="{term}" data-tip="{tip}"'
    html = html.replace(old, new)
d["html"] = html
p.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
print("tips", html.count("data-tip="))
