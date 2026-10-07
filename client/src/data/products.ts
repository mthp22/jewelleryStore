export type Category = 'Rings' | 'Earrings' | 'Necklaces'

export type Product = {
  id: string
  name: string
  description: string
  category: Category
  price: number
  metal: string
  carat: number
  cut: string
  clarity: string
  colour: string
  assetType: 'image' | 'video'
  assetSrc: string
  poster?: string
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`

export const products: Product[] = [
  {
    id: 'arya-platinum-ring',
    name: 'Arya Platinum Hidden Halo Engagement Ring',
    description: 'Timeless elegance with the Arya design.',
    category: 'Rings',
    price: 186500,
    metal: 'Platinum',
    carat: 1.02,
    cut: 'Round Brilliant',
    clarity: 'VS1',
    colour: 'F',
    assetType: 'video',
    assetSrc:
      'https://ralphjacobs.co.za/cdn/shop/videos/c/vp/7812236f3c42459ca303183f539a06e5/7812236f3c42459ca303183f539a06e5.HD-720p-3.0Mbps-36052827.mp4?v=0',
    poster: '',
  },
  {
    id: 'betty-platinum-ring',
    name: 'Betty Platinum Solitaire Engagement Ring',
    description: 'A clean solitaire with concealed settings for seamless sparkle.',
    category: 'Rings',
    price: 142000,
    metal: 'Platinum',
    carat: 0.9,
    cut: 'Oval',
    clarity: 'VS2',
    colour: 'G',
    assetType: 'video',
    assetSrc:
      'https://ralphjacobs.co.za/cdn/shop/videos/c/vp/207a749ea1b5470599c9353600d9c399/207a749ea1b5470599c9353600d9c399.HD-720p-3.0Mbps-36027974.mp4?v=0',
  },
  {
    id: 'north-star-earrings',
    name: 'North Star Earrings',
    description: 'Asymmetric cluster composition with exceptional light return in motion.',
    category: 'Earrings',
    price: 96400,
    metal: '18k White Gold',
    carat: 1.4,
    cut: 'Pear',
    clarity: 'VVS2',
    colour: 'E',
    assetType: 'image',
    assetSrc: unsplash('photo-1629224316810-9d8805b95e76'),
  },
  {
    id: 'luminara-riviera-necklace',
    name: 'Luminara Diamond Riviera Necklace',
    description: 'A graduated riviera line that sits flush against the collarbone.',
    category: 'Necklaces',
    price: 248000,
    metal: '18k Yellow Gold',
    carat: 3.15,
    cut: 'Round Brilliant',
    clarity: 'VS1',
    colour: 'F',
    assetType: 'image',
    assetSrc: unsplash('photo-1605100804763-247f67b3557e'),
  },
  {
    id: 'ember-toi-et-moi-ring',
    name: 'Ember Toi Et Moi Ring',
    description: 'Two stones meeting at an angle for a modern, personal silhouette.',
    category: 'Rings',
    price: 124900,
    metal: '18k Rose Gold',
    carat: 1.5,
    cut: 'Cushion',
    clarity: 'VVS1',
    colour: 'E',
    assetType: 'image',
    assetSrc: unsplash('photo-1515562141207-7a88fb7ce338'),
  },
  {
    id: 'celeste-marquise-earrings',
    name: 'Celeste Marquise Drop Earrings',
    description: 'Marquise drops balanced for movement and a long, flattering line.',
    category: 'Earrings',
    price: 78500,
    metal: '18k White Gold',
    carat: 1.1,
    cut: 'Marquise',
    clarity: 'VS1',
    colour: 'G',
    assetType: 'image',
    assetSrc: unsplash('photo-1611591437281-460bfbe1220a'),
  },
  {
    id: 'vega-tennis-necklace',
    name: 'Vega Diamond Tennis Necklace',
    description: 'A continuous line of matched stones for everyday brilliance.',
    category: 'Necklaces',
    price: 320000,
    metal: 'Platinum',
    carat: 5,
    cut: 'Round Brilliant',
    clarity: 'VS1',
    colour: 'F',
    assetType: 'image',
    assetSrc: unsplash('photo-1599643478518-a784e5dc4c8f'),
  },
  {
    id: 'isla-emerald-halo-ring',
    name: 'Isla Emerald Cut Halo Ring',
    description: 'An emerald cut framed by a fine halo for quiet, structured sparkle.',
    category: 'Rings',
    price: 168000,
    metal: 'Platinum',
    carat: 1.75,
    cut: 'Emerald',
    clarity: 'VVS2',
    colour: 'E',
    assetType: 'image',
    assetSrc: unsplash('photo-1573408301185-9146fe634ad0'),
  },
]

export const categories: Category[] = ['Rings', 'Earrings', 'Necklaces']

export const getProduct = (id: string | undefined | null) => products.find((item) => item.id === id)

export const relatedTo = (product: Product, limit = 3) =>
  products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(products.filter((item) => item.id !== product.id && item.category !== product.category))
    .slice(0, limit)
