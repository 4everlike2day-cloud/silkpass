import type {Guide, GuideItem} from './types'

// Подборки, которые лежат прямо в коде (фото в public/guides/...).
// Позже их можно перенести в Sanity: подборка с тем же городом и адресом заменит эту.

const img = (dir: string, n: string) => ({url: `/guides/${dir}/${n}.webp`, alt: ''})
const yandex = (lat: number, lon: number) => `https://yandex.uz/maps/?pt=${lon},${lat}&z=17&l=map`

function mural(
  n: string, title: string, text: string, lat: number, lon: number,
  opts: {extra?: string[]; area?: string; credit?: string} = {},
): GuideItem {
  const photos = [n, ...(opts.extra || [])].map((p) => img('tashkent-murals', p))
  return {title, text, image: photos[0], images: photos, mapsUrl: yandex(lat, lon), lat, lon, area: opts.area || null, credit: opts.credit || null}
}

export const LOCAL_GUIDES: Guide[] = [
  {
    slug: 'murals',
    citySlug: 'tashkent',
    title: 'Murals of Tashkent',
    summary: 'Ten big walls worth a detour, from space dreams to Uzbek ornament.',
    cover: img('tashkent-murals', 'cover'),
    intro:
      'Tashkent has turned dozens of Soviet apartment blocks into an open-air gallery. Most murals are in residential districts, away from the usual sights, so they are a good excuse to ride the metro and see the city locals live in.\n\nTap a mural to open it on the map. Paintings change: some fade, new ones appear every season.',
    order: 1,
    gallery: [],
    sourceUrl: 'https://t.me/ArtMuralTash',
    sourceLabel: 'Telegram @ArtMuralTash',
    sourceText: 'More murals and street art of Tashkent, with exact locations.',
    items: [
      mural('1', 'Tile-pattern tower', 'A whole block dressed in blue majolica stars, with a family scene painted at street level.', 41.2995, 69.2662, {extra: ['1-1']}),
      mural('2', 'Six portraits in smoke', 'Black-and-white portraits of six men wrapped in swirling smoke, on a modern facade.', 41.3463, 69.2848),
      mural('3', 'Children in the meadow', 'Kids running through grass and soap bubbles across an entire facade.', 41.254644, 69.377806),
      mural('4', 'Astronaut on the moon', 'A cosmonaut resting on a crescent moon among planets.', 41.2841, 69.2181),
      mural('5', 'Portraits in red and green', 'Three portraits on a red banner along a pedestrian street.', 41.278042, 69.244666),
      mural('6', 'Girl with peacocks', 'A girl in a white doppi between two peacocks and cotton flowers. Next to it: a mother helping her son with a space helmet.', 41.2562, 69.1979, {extra: ['6-1'], credit: 'Photo: gazeta.uz'}),
      mural('7', 'City walkers', 'A crowd of black-and-white figures with one in red, on a long courtyard wall.', 41.279595, 69.225215, {area: 'Chilanzar, 2nd quarter'}),
      mural('8', 'Cherry harvest', 'A woman in ikat silk picking cherries, painted the full height of the building.', 41.296173, 69.360289, {area: 'Tuzel, Yashnobod district', credit: 'Artist: @dildoraartdizayn'}),
      mural('9', 'Face in the wind', 'A calm face with closed eyes against a turquoise sky.', 41.225577, 69.215381, {area: 'Sergeli-VI, building 3', credit: 'Photo: nuz.uz'}),
      mural('10', 'Holding the Earth', 'A girl with a long braid embracing the planet, on a new block in Sergeli.', 41.217822, 69.211638, {area: 'Sergeli-VII'}),
    ],
  },
]
