# V24: instructional copy in Turkish; ATC lines stay English.
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
V23 = ROOT / "src/main/resources/db/migration/V23__four_stage_tower_pilot.sql"
OUT = ROOT / "src/main/resources/db/migration/V24__turkish_instruction_copy.sql"

WORDS = [
    ("frekansina", "frekansına"), ("takimlari", "takımları"), ("anlasilmadi", "anlaşılmadı"),
    ("yaklasmaya", "yaklaşmaya"), ("cizgisinde", "çizgisinde"), ("okunus", "okunuş"),
    ("cagri isareti", "çağrı işareti"), ("cagri", "çağrı"), ("kalkis", "kalkış"),
    ("inis", "iniş"), ("ucak", "uçak"), ("once", "önce"), ("dogru", "doğru"),
    ("karisik", "karışık"), ("musait", "müsait"), ("cizgi", "çizgi"), ("gecme", "geçme"),
    ("hayir", "hayır"), ("ruzgar", "rüzgar"), ("ayni", "aynı"), ("sirket", "şirket"),
    ("sira", "sıra"), ("yaklasma", "yaklaşma"), ("onunde", "önünde"), ("mesgul", "meşgul"),
    ("yakit", "yakıt"), ("geciyor", "geçiyor"), ("cikiyor", "çıkıyor"), ("cikis", "çıkış"),
    ("aralik", "aralık"), ("henuz", "henüz"), ("hizlan", "hızlan"), ("hizlansin", "hızlansın"),
    ("yogun", "yoğun"), ("hayati", "hayati"), ("oncelik", "öncelik"), ("oncelikli", "öncelikli"),
    ("donus", "dönüş"), ("dort", "dört"), ("simdi", "şimdi"), ("simdilik", "şimdilik"),
    ("arizasi", "arızası"), ("saglik", "sağlık"), ("cakisan", "çakışan"), ("basinc", "basınç"),
    ("kaybi", "kaybı"), ("oteki", "öteki"), ("sayisi", "sayısı"), ("dusuk", "düşük"),
    ("mucadele", "mücadele"), ("alcal", "alçal"), ("korsanlik", "korsanlık"),
    ("soyle", "söyle"), ("sektor", "sektör"), ("hatti", "hattı"), ("gercek", "gerçek"),
    ("gecip", "geçip"), ("gecis", "geçiş"), ("aldi", "aldı"), ("sifir", "sıfır"),
    ("kacirma", "kaçırma"), ("dusuyor", "düşüyor"), ("kirik", "kırık"), ("zayif", "zayıf"),
    ("uzere", "üzere"), ("'ye don", "'ye dön"), (" acar", " açar"),
    ("gecir", "geçir"), ("gecirir", "geçirir"), ("bos", "boş"), ("var mi", "var mı"),
    ("degil", "değil"), ("yuzde", "yüzde"), ("sik", "şık"), ("konus", "konuş"),
    ("sec.", "seç."), ("Ikinci", "İkinci"), ("Ikisi", "İkisi"), ("Ikisine", "İkisine"),
    ("Inen", "İnen"), ("Inis", "İniş"), ("Itfaiye", "İtfaiye"), ("Once", "Önce"),
    ("Canli", "Canlı"), ("Digerleri", "Diğerleri"), ("Dusmek", "Düşmek"),
    ("Kus.", "Kuş."), ("Kus ", "Kuş "), ("Yapamiyor", "Yapamıyor"),
    ("beklesin", "beklesin"), ("ardindan", "ardından"), ("ortasi", "ortası"),
    ("kapali", "kapalı"), ("kahve", "kahve"), ("kopugu", "köpüğü"),
    ("hazir", "hazır"), ("seyi", "şeyi"), ("sordu", "sordu"),
    ("gerekmez", "gerekmez"), ("Mukemmel", "Mükemmel"), ("Ingilizce", "İngilizce"),
    ("gecer", "geçer"), ("ogrenir", "öğrenir"), ("acacak", "açacak"),
    ("basacak", "basacak"), ("terk edecek", "terk edecek"),
]


def tr(s: str) -> str:
    if not s:
        return s
    out = s
    for a, b in WORDS:
        out = re.sub(re.escape(a), b, out, flags=re.IGNORECASE) if a[:1].isupper() else out.replace(a, b)
    # second pass case-sensitive remaining ascii turkish
    out = out.replace("Ucak", "Uçak").replace("Kalkis", "Kalkış").replace("Cagri", "Çağrı")
    out = out.replace("Ruzgar", "Rüzgar").replace("Yakit", "Yakıt").replace("Sira", "Sıra")
    out = out.replace("Oncelik", "Öncelik").replace("Hayir", "Hayır").replace("Degil", "Değil")
    out = out.replace("Yogun", "Yoğun").replace("Henuz", "Henüz").replace("Gercek", "Gerçek")
    out = out.replace("Konus", "Konuş").replace("Once", "Önce").replace("Ayni", "Aynı")
    return out


TITLES = {
    "twr1-intro": ("Aşama 1: Zemin", "Geri itiş, taksi, kalkış ve iniş izni."),
    "twr1-push-q": ("Dinle: AJet geri itiş", "AJet, frekansta Anadolu diye okunur."),
    "twr1-push": ("Konuş: geri itiş onayı", "Turkish 941 için kule cevabı."),
    "twr1-sxs-taxi": ("Dinle: SunExpress taksi", "Taksi rotasını seç."),
    "twr1-ajet-taxi": ("Konuş: AJet taksi", "Anadolu 221 — Bravo, hold short."),
    "twr1-ready-taxi": ("Senaryo: Pegasus taksi", "Aprondan holding’e."),
    "twr1-hold-q": ("Dinle: hold short", "Çizgiyi geçme."),
    "twr1-hold": ("Konuş: hold short", "Turkish 102J çizgide beklesin."),
    "twr1-lineup-q": ("Dinle: line up", "Kalkış izni değildir."),
    "twr1-lineup": ("Konuş: line up", "SunExpress piste girip bekler."),
    "twr1-not-to": ("Senaryo: henüz kalkış yok", "Finalde trafik varken line up."),
    "twr1-to": ("Konuş: kalkış izni", "Pist müsait."),
    "twr1-vacate-q": ("Dinle: pist boş", "Ground’a geçir."),
    "twr1-ground": ("Konuş: ground’a geçir", "121.7"),
    "twr1-wind": ("Dinle: rüzgâr", "İniş bilgisi."),
    "twr1-land": ("Konuş: iniş izni", "Turkish 1452, pist 05."),
    "twr1-land-rb": ("Senaryo: iniş izni", "Pist müsait, rüzgâr uygun."),
    "twr1-charlie-q": ("Dinle: Charlie", "Taxiway C."),
    "twr1-charlie": ("Konuş: Charlie", "Havacılık alfabesi."),
    "twr1-abc": ("Konuş: Alpha Bravo Charlie", "A B C — aksanla da yeter."),
    "twr1-anadolu": ("Dinle: AJet okunuşu", "Sözlü çağrı: Anadolu."),
    "twr1-first-call": ("Senaryo: ilk çağrı", "Sıra: birim, çağrı, konum, talep."),
    "twr1-tower-freq": ("Konuş: kuleye geçir", "118.1"),
    "twr1-ident-q": ("Dinle: ident", "Radar doğrulama."),
    "twr1-ident": ("Konuş: ident", "Turkish 941 ident versin."),
    "twr2-intro": ("Aşama 2: Havada trafik", "İki uçağa aynı anda, sıra, yaklaşma."),
    "twr2-num2-q": ("Dinle: number 2", "Önünde bir uçak var."),
    "twr2-num2": ("Konuş: number 2", "AJet yaklaşmaya devam."),
    "twr2-two": ("Senaryo: iki uçak", "Biri finalde, biri downwind."),
    "twr2-extend": ("Konuş: downwind uzat", "Aralık lazım."),
    "twr2-ga-q": ("Dinle: go around", "Pist meşgul."),
    "twr2-ga": ("Konuş: go around", "SunExpress’e pas geç."),
    "twr2-giveway": ("Senaryo: yol ver", "Apron çıkışı."),
    "twr2-orbit": ("Konuş: orbit", "İki dakikalık tur."),
    "twr2-final-q": ("Dinle: report final", "Finalde bildir."),
    "twr2-continue": ("Konuş: continue approach", "Henüz iniş izni yok."),
    "twr2-seq": ("Senaryo: sıra 1–2", "Üç uçak, bir pist."),
    "twr2-traffic": ("Konuş: trafik bilgisi", "Finaldeki Airbus."),
    "twr2-behind": ("Dinle: behind landing", "İnenin ardından kalkış."),
    "twr2-expedite": ("Konuş: expedite", "Pisti çabuk boşalt."),
    "twr2-cross": ("Senaryo: pist crossing", "Finalde uçak varken geçiş yok."),
    "twr2-cross-ok": ("Konuş: cross", "Final boş, geçebilir."),
    "twr2-delay": ("Dinle: delay", "Yoğun trafik."),
    "twr2-num1": ("Konuş: number 1", "Sıra onda."),
    "twr2-same-time": ("Senaryo: iki çağrı birden", "Önce finaldekine cevap."),
    "twr2-standby": ("Konuş: standby", "Frekans dolu."),
    "twr2-unable": ("Dinle: unable", "Hemen kalkış yok."),
    "twr2-after": ("Konuş: inenin ardından", "Sıralı kalkış."),
    "twr2-wake": ("Senaryo: iz türbülansı", "Ağır uçağın arkası."),
    "twr2-low": ("Konuş: low approach", "Alçak geçiş."),
    "twr3-intro": ("Aşama 3: PAN ve yoğun trafik", "PAN PAN, gecikme, kısa kule konuşması."),
    "twr3-pan-q": ("Dinle: PAN PAN", "Acil, hayati tehlike yok."),
    "twr3-pan-ack": ("Konuş: PAN aldım", "AJet’e öncelik."),
    "twr3-pan-priority": ("Senaryo: PAN öncelik", "Final dolu, PAN iner."),
    "twr3-pan-fuel": ("Konuş: PAN yakıt", "Minimum fuel."),
    "twr3-bird": ("Dinle: kuş çarpması", "PAN, dönüş talebi."),
    "twr3-return": ("Konuş: geri dön", "Pist 03, iniş izni."),
    "twr3-busy": ("Senaryo: yoğun saat", "Dört uçak, bir PAN."),
    "twr3-delay": ("Konuş: delay", "On dakika trafik."),
    "twr3-unable-q": ("Dinle: unable", "Şimdilik kalkış yok."),
    "twr3-unable": ("Konuş: unable", "Pozisyonda bekle."),
    "twr3-radio": ("Senaryo: kırık radyo", "Say again."),
    "twr3-sayagain": ("Konuş: say again", "Anlaşılmadı."),
    "twr3-7600": ("Dinle: 7600", "Radyo arızası, henüz MAYDAY değil."),
    "twr3-light": ("Konuş: ışık işareti", "NORDO, yeşil ışık."),
    "twr3-medical": ("Senaryo: ambulans", "PAN medical, iniş sonrası."),
    "twr3-ambulance": ("Konuş: ambulans yolda", "Bravo’da ekip."),
    "twr3-hold": ("Dinle: hold", "Golf’ta bekleme."),
    "twr3-holdgolf": ("Konuş: Golf’ta bekle", "Yoğun akış."),
    "twr3-expedite-all": ("Senaryo: herkesi hızlandır", "PAN inişte, arkadakiler boşaltsın."),
    "twr3-caution": ("Konuş: ıslak pist", "Dikkat uyarısı."),
    "twr3-priority": ("Dinle: priority", "PAN sırası birinci."),
    "twr3-num1-pan": ("Konuş: number 1 priority", "PAN’e iniş izni."),
    "twr3-break": ("Senaryo: break break", "Çakışan çağrılar."),
    "twr3-break-say": ("Konuş: break break", "Frekansı kes, PAN’e yer aç."),
    "twr4-intro": ("Aşama 4: MAYDAY", "Motor, basınç, hidrolik. Yolcu, yakıt, kargo. İtfaiye."),
    "twr4-mayday-q": ("Dinle: MAYDAY", "Hayati tehlike."),
    "twr4-mayday-ack": ("Konuş: MAYDAY aldım", "Pist senin."),
    "twr4-engine": ("Senaryo: motor kaybı", "Öteki finalde, MAYDAY öncelikli."),
    "twr4-souls": ("Konuş: yolcu sayısı", "Souls, yakıt, tehlikeli madde sor."),
    "twr4-souls-q": ("Dinle: souls", "Canlı sayısı."),
    "twr4-fuel": ("Konuş: kalan yakıt", "Fuel remaining."),
    "twr4-hydro": ("Senaryo: hidrolik", "Takım inmeyebilir, köpük hazır."),
    "twr4-foam": ("Konuş: köpük hazır", "İtfaiye pistte."),
    "twr4-cargo": ("Dinle: tehlikeli madde", "Kargo sorusu neden?"),
    "twr4-goods": ("Konuş: dangerous goods", "Kargo var mı diye sor."),
    "twr4-press": ("Senaryo: basınç kaybı", "Acil alçalma."),
    "twr4-descend": ("Konuş: emergency descent", "Alçal, pist senin."),
    "twr4-7700": ("Dinle: 7700", "Genel acil transponder."),
    "twr4-squawk": ("Konuş: squawk 7700", "Acil kodu."),
    "twr4-services": ("Senaryo: acil ekipler", "Kule itfaiye ve ambulansı çağırır."),
    "twr4-services-say": ("Konuş: acil ekipler", "Pist 03, motor arızası."),
    "twr4-evac": ("Dinle: tahliye", "Pistte boşaltma."),
    "twr4-evac-say": ("Konuş: tahliye", "Ekipler yanında."),
    "twr4-crash": ("Senaryo: düşmek üzere", "Her trafik dursun, pist onun."),
    "twr4-yours": ("Konuş: pist senin", "Ekipler yolda."),
    "twr4-gear": ("Dinle: iniş takımı", "Hidrolik teyidi."),
    "twr4-gear-say": ("Konuş: takım aşağıda mı", "Confirm gear down."),
    "twr4-full": ("Senaryo: tam MAYDAY listesi", "Pist, 7700, yolcu, yakıt, kargo, ekipler."),
    "twr4-full-say": ("Konuş: tam MAYDAY paketi", "Hepsini bir nefeste sor."),
    "twr4-ivao": ("Canlı: IVAO sektör", "Hattı bitirince sektör dene."),
    "plt1-intro": ("Aşama 1: Yer ve izinler", "Taksi, line up, kalkış ve iniş read-back."),
    "plt1-who": ("Dinle: ilk çağrı", "Birim, çağrı, konum, talep."),
    "plt1-push": ("Konuş: geri itiş talebi", "Anadolu 221 kuleyi arar."),
    "plt1-taxi": ("Konuş: taksi talebi", "SunExpress ground’u arar."),
    "plt1-rb-taxi": ("Dinle: taksi read-back", "Talimatı çağrı ile tekrarla."),
    "plt1-hold": ("Konuş: hold short", "Çizgide bekle, tekrarla."),
    "plt1-lineup": ("Konuş: line up read-back", "Pegasus piste girer."),
    "plt1-not-to": ("Senaryo: henüz kalkma", "Line up, take-off değil."),
    "plt1-to": ("Konuş: kalkış read-back", "AJet kalkış iznini tekrarla."),
    "plt1-land-q": ("Dinle: iniş izni", "Rüzgâr + pist + cleared to land."),
    "plt1-land": ("Konuş: iniş read-back", "Turkish 1452."),
    "plt1-vacate": ("Konuş: pist boş", "Vacated raporu."),
    "plt1-charlie": ("Konuş: Charlie", "Taksi yolu C."),
    "plt1-anadolu": ("Senaryo: AJet söyle", "Çağrı işareti Anadolu."),
    "plt1-sxs": ("Dinle: SunExpress", "Şirketi tanı."),
    "plt1-ready": ("Konuş: ready", "Holding’de hazırım."),
    "plt1-abc": ("Konuş: Alpha Bravo Charlie", "Alfabe, aksanla yeter."),
    "plt1-wind": ("Senaryo: rüzgârı al", "İniş iznini tekrarla."),
    "plt1-ground": ("Konuş: ground", "121.7’ye geç."),
    "plt1-hold-q": ("Dinle: hold short", "Pisti geçme."),
    "plt1-juliet": ("Konuş: 102 Juliet", "Çağrı harfi Juliet."),
    "plt2-intro": ("Aşama 2: Trafik paterni", "Downwind, number 2, final, go around."),
    "plt2-downwind": ("Konuş: downwind", "Pozisyon raporu."),
    "plt2-n2": ("Dinle: number 2", "Önünde biri var, yaklaşmaya devam."),
    "plt2-extend": ("Konuş: downwind uzatıyorum", "Read-back."),
    "plt2-final": ("Konuş: final", "Final raporu."),
    "plt2-ga": ("Senaryo: go around", "Pist meşgul, pas geç."),
    "plt2-ga-rb": ("Konuş: going around", "Pas geç read-back."),
    "plt2-orbit": ("Konuş: orbit", "Sol tur."),
    "plt2-wake": ("Dinle: iz türbülansı", "777’nin arkası."),
    "plt2-traffic-in-sight": ("Konuş: trafiği gördüm", "Traffic in sight."),
    "plt2-num1": ("Senaryo: number 1", "Sıra sende, final bildir."),
    "plt2-continue": ("Konuş: continuing", "Yaklaşmaya devam."),
    "plt2-wyz": ("Konuş: Whiskey Yankee Zulu", "W Y Z."),
    "plt2-behind": ("Dinle: behind landing", "İnenin ardından kalk."),
    "plt2-behind-rb": ("Konuş: behind landing", "Kalkış iznini tekrarla."),
    "plt2-two-hear": ("Senaryo: kule iki uçağa", "Sana extend dedi, ona iniş."),
    "plt2-giveway-rb": ("Konuş: yol veriyorum", "Giving way."),
    "plt3-intro": ("Aşama 3: PAN PAN", "Tıbbi, yakıt, kuş, radyo."),
    "plt3-pan-q": ("Dinle: PAN", "Acil, MAYDAY değil."),
    "plt3-pan-med": ("Konuş: PAN tıbbi", "Öncelikli iniş iste."),
    "plt3-pan-fuel": ("Konuş: PAN yakıt", "Minimum fuel."),
    "plt3-bird": ("Senaryo: kuş çarpması", "Dönüş iste, PAN."),
    "plt3-return": ("Konuş: geri dönüyorum", "İniş iznini tekrarla."),
    "plt3-sayagain": ("Konuş: say again", "Kuleyi duymadın."),
    "plt3-delay": ("Dinle: delay", "On dakika bekle."),
    "plt3-unable": ("Senaryo: unable", "Kule kalkış vermiyor."),
    "plt3-hold": ("Konuş: Golf’ta bekliyorum", "Yoğun trafik."),
    "plt3-priority-rb": ("Konuş: öncelik read-back", "PAN cevabını tekrarla."),
    "plt3-7600": ("Dinle: 7600", "Radyo arızası."),
    "plt3-medical-land": ("Senaryo: ambulans", "İniş sonrası Bravo."),
    "plt3-ident": ("Konuş: ident", "Radar için ident."),
    "plt3-wet": ("Konuş: ıslak pist", "Caution’ı tekrarla."),
    "plt3-break": ("Senaryo: break", "PAN varken konuşmayı kes."),
    "plt3-standby-rb": ("Konuş: bekliyorum", "Standby read-back."),
    "plt4-intro": ("Aşama 4: MAYDAY", "Motor, basınç, hidrolik. Kule yolcu, yakıt, kargo sorar."),
    "plt4-mayday": ("Konuş: MAYDAY motor", "Üç kez MAYDAY, sonra niyet."),
    "plt4-yours": ("Dinle: pist senin", "Ekipler yolda."),
    "plt4-souls": ("Konuş: yolcu–yakıt–kargo", "Kule üçünü birden sorar."),
    "plt4-hydro": ("Senaryo: hidrolik", "Köpük ve uzun pist iste."),
    "plt4-press": ("Konuş: basınç kaybı", "Acil alçalma."),
    "plt4-7700": ("Konuş: squawk 7700", "Acil kodu."),
    "plt4-goods-q": ("Dinle: kargo sorusu", "Varsa madde, yoksa none."),
    "plt4-none": ("Konuş: tehlikeli madde yok", "No dangerous goods."),
    "plt4-evac": ("Senaryo: tahliye", "Pistte duman, boşalt."),
    "plt4-evac-say": ("Konuş: tahliye ediyorum", "Evacuate read-back."),
    "plt4-gear": ("Konuş: takım aşağıda", "Gear down."),
    "plt4-foam": ("Dinle: köpük", "İtfaiye hazır."),
    "plt4-full": ("Senaryo: kule her şeyi sordu", "Üç sayıyı bir cümlede ver."),
    "plt4-full-say": ("Konuş: yolcu yakıt kargo", "Tek nefeste cevapla."),
    "plt4-ivao": ("Canlı: IVAO PP", "Hattı bitirince gerçek ATC dene."),
}

HTML = {
    "CONTENT": {
        "twr1-intro": "<p>Bu aşama yer konuşması: geri itiş, taksi, çizgide bekleme, piste girme, kalkış ve iniş izni. <strong>Frekanstaki cümleler İngilizce</strong>; açıklama ve sorular Türkçe. Turkish, SunExpress, AJet (Anadolu), Pegasus karışık gelir. Doğru şık her zaman birinci değil.</p>",
        "twr2-intro": "<p>Şimdi hava. Number 2, downwind uzat, pas geç, yol ver. İki çağrı işareti aynı anda gelebilir — önce finaldekine cevapla. Konuşmalar İngilizce kalır.</p>",
        "twr3-intro": "<p>PAN PAN üç kez: acil vardır, hayati tehlike yoktur. Yoğun saatte kule kısa konuşur, sıra verir, delay söyler. MAYDAY henüz değil. Frekans İngilizce.</p>",
        "twr4-intro": "<p>MAYDAY üç kez: hayati tehlike. Kule pisti verir, acil ekipleri çağırır; <em>souls on board</em>, kalan yakıt ve tehlikeli madde sorar. Sen de İngilizce sor, Türkçe düşün.</p>",
        "plt1-intro": "<p>Pilot tarafı: kuleyi ara, talimatı İngilizce tekrarla (read-back). AJet sözlü olarak Anadolu’dur. Yüzde 50 yakınlık yeter.</p>",
        "plt2-intro": "<p>Havada kule başka uçaklara da konuşur. Number 2’yi anla, downwind uzat, gerekirse pas geç. Senin read-back’in İngilizce.</p>",
        "plt3-intro": "<p>PAN PAN üç kez, sonra çağrı, sonra sorun. Kule öncelik verir. Bu MAYDAY değildir. Cümleler İngilizce.</p>",
        "plt4-intro": "<p>MAYDAY üç kez, sonra niyet. Kule pist verir; yolcu sayısı, yakıt ve kargo sorar. Cevabın İngilizce olsun.</p>",
    }
}

LISTEN_HTML = "<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>"
SPEAK_HTML = "<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>"
SCENE_HTML = "<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>"
LIVE_HTML = "<p>Bu adım IVAO. Giriş yapanlar hattı bitirince sektör veya gerçek ATC deneyebilir. Önce dinle.</p>"


def esc(s: str) -> str:
    return s.replace("'", "''")


def q(s: str) -> str:
    return "'" + esc(s) + "'"


def html_for(kind: str, slug: str) -> str:
    if kind == "CONTENT":
        return HTML["CONTENT"].get(slug, "<p>Bu adımı oku. Sonraki pratikte İngilizce konuşacaksın.</p>")
    if kind == "LISTEN":
        return LISTEN_HTML
    if kind == "SPEAK":
        return SPEAK_HTML
    if kind == "SCENARIO":
        return SCENE_HTML
    if kind == "LIVE_PRACTICE":
        return LIVE_HTML
    return LISTEN_HTML


INSERT_RE = re.compile(
    r"SELECT id, '(?P<title>(?:\\'|[^'])*)', '(?P<slug>[^']+)', '(?P<desc>(?:\\'|[^'])*)', '(?P<kind>[^']+)', '(?P<html>(?:\\'|[^'])*)', '(?P<json>\{.*?\})'::jsonb",
    re.DOTALL,
)


def sql_unescape(s: str) -> str:
    return s.replace("''", "'")


def main():
    raw = V23.read_text(encoding="utf-8")
    lines = []
    lines.append("-- Kule/pilot metinleri Türkçe; frekans konuşması İngilizce kalır.\n")
    lines.append(
        "UPDATE learning_paths SET description = "
        + q("Dört aşama: zemin, trafik, PAN, MAYDAY. Konuşmalar İngilizce; açıklama Türkçe. Giriş yapan puan biriktirir.")
        + " WHERE slug = 'kule-ol';\n"
    )
    lines.append(
        "UPDATE learning_paths SET description = "
        + q("Dört aşama: yer, patern, PAN, MAYDAY. Read-back İngilizce. Giriş yapan puan biriktirir.")
        + " WHERE slug = 'pilot-ol';\n\n"
    )
    seen = set()
    for m in INSERT_RE.finditer(raw):
        slug = m.group("slug")
        if slug in seen:
            continue
        seen.add(slug)
        kind = m.group("kind")
        cfg = json.loads(sql_unescape(m.group("json")))
        title, desc = TITLES.get(slug, (tr(sql_unescape(m.group("title"))), tr(sql_unescape(m.group("desc")))))
        if "question" in cfg:
            cfg["question"] = tr(cfg["question"])
        if "options" in cfg and kind == "LISTEN":
            cfg["options"] = [tr(o) for o in cfg["options"]]
            if "correctOption" in cfg:
                cfg["correctOption"] = tr(cfg["correctOption"])
        # SCENARIO options stay English (radio). situation: keep English ATC, add nothing if already EN.
        html = html_for(kind, slug)
        patch = {"stage": cfg.get("stage")}
        if "question" in cfg:
            patch["question"] = cfg["question"]
            patch["options"] = cfg["options"]
            patch["correctOption"] = cfg["correctOption"]
        merge = json.dumps({k: v for k, v in patch.items() if v is not None}, ensure_ascii=False, separators=(",", ":"))
        lines.append(
            "UPDATE learning_steps SET\n"
            f"  title = {q(title)},\n"
            f"  description = {q(desc)},\n"
            f"  content_html = {q(html)},\n"
            f"  configuration = configuration || {q(merge)}::jsonb\n"
            f" WHERE slug = {q(slug)};\n"
        )
    # leftover content steps from earlier curriculum
    lines.append(
        "\nUPDATE learning_steps SET configuration = coalesce(configuration, '{}'::jsonb) || '{\"stage\":1}'::jsonb\n"
        " WHERE slug IN ('kule-kimdir','turkiyede-atc','ivao-rating','twr-alfabe','plt-alfabe')\n"
        "   AND status = 'PUBLISHED';\n"
    )
    OUT.write_text("".join(lines), encoding="utf-8")
    print("updated", len(seen), "->", OUT)


if __name__ == "__main__":
    main()
