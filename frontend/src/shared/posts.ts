export type FieldPost = {
  id: number
  title: string
  slug: string
  summary: string
  author: string
  cover: string
}

export const FIELD_POSTS: FieldPost[] = [
  {
    id: 1,
    title: 'Havacılıkta iniş safhasının kritik / operasyonel önemi',
    slug: 'inis-safhasinin-kritik-onemi',
    summary: '2025–2026 pist kazaları üzerinden iniş operasyonu ve emniyet dersleri.',
    author: 'Elif Yılmaz',
    cover: '/blog/cover.jpg',
  },
  {
    id: 2,
    title: 'Unstable approach: neden pas geçilir',
    slug: 'unstable-approach-neden-pas-gecilir',
    summary: 'Kararsız yaklaşmada hız, süzülüş ve konfigürasyon. Go-around bir başarısızlık değil, emniyettir.',
    author: 'Can Demir',
    cover: '/atmosphere/faq.jpg',
  },
  {
    id: 3,
    title: 'Flare: eşikte burun, yumuşak temas',
    slug: 'flare-esikte-burun',
    summary: 'Eşikte flare zamanlaması. Erken veya geç flare sert iniş ve pist kazasına gider.',
    author: 'Ayşe Kaya',
    cover: '/atmosphere/cockpit.jpg',
  },
  {
    id: 4,
    title: 'ATC ve pist: kule ile aynı resmi görmek',
    slug: 'atc-ve-pist',
    summary: 'Yer, kule ve yaklaşma aynı piste bakmazsa çakışma başlar. Read-back burada hayat kurtarır.',
    author: 'Mert Aksoy',
    cover: '/atmosphere/tower.jpg',
  },
  {
    id: 5,
    title: 'Taksi ve iniş sonrası: pist henüz bitmedi',
    slug: 'taksi-ve-inis-sonrasi',
    summary: 'Teker koyunca uçuş bitmez. Taksi, çıkış ve hold-short hâlâ operasyonun parçası.',
    author: 'Selin Aras',
    cover: '/atmosphere/night.jpg',
  },
]
