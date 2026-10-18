import {defineArrayMember, defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'

// Подборка: отдельная страница города (муралы, куда сходить ещё, рынки…).
// Адрес: welcome2.uz/<город>/<адрес подборки>. Карточка-ссылка сама появляется на странице города.
export const guide = defineType({
  name: 'guide',
  title: 'Подборка',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({name: 'city', title: 'Город', type: 'reference', to: [{type: 'city'}], validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Заголовок', description: 'Например: Street art in Tashkent', type: 'localeString', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Адрес страницы',
      description: 'Латиницей, например murals. Страница будет welcome2.uz/tashkent/murals',
      type: 'slug',
      options: {source: 'title.en'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'summary', title: 'Коротко (для карточки)', type: 'localeString'}),
    defineField({name: 'cover', title: 'Обложка', type: 'image', options: {hotspot: true}}),
    defineField({name: 'intro', title: 'Текст', description: 'Абзацы разделяйте пустой строкой', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Места / пункты',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'guideItem',
          fields: [
            defineField({name: 'title', title: 'Название', type: 'localeString'}),
            defineField({name: 'text', title: 'Описание', type: 'localeText'}),
            defineField({name: 'image', title: 'Фото', type: 'image', options: {hotspot: true}}),
            defineField({name: 'mapsUrl', title: 'Ссылка на карту', type: 'url'}),
            defineField({name: 'location', title: 'Точка на карте', description: 'Если задать, место появится на общей карте подборки', type: 'geopoint'}),
            defineField({name: 'area', title: 'Район', type: 'localeString'}),
            defineField({name: 'credit', title: 'Автор / фото', description: 'Например: Artist @name · Photo: gazeta.uz', type: 'string'}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'text.en', media: 'image'}},
        }),
      ],
    }),
    defineField({name: 'sourceUrl', title: 'Ссылка в конце страницы', description: 'Например канал, где больше материалов', type: 'url'}),
    defineField({name: 'sourceLabel', title: 'Текст кнопки', type: 'localeString'}),
    defineField({name: 'sourceText', title: 'Подпись к ссылке', type: 'localeString'}),
    defineField({name: 'gallery', title: 'Галерея', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}})]}),
    defineField({name: 'order', title: 'Порядок на странице города', type: 'number', initialValue: 10}),
    defineField({name: 'active', title: 'Показывать', type: 'boolean', initialValue: true}),
  ],
  orderings: [{title: 'По порядку', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title.en', subtitle: 'city.nameUz', media: 'cover'}},
})
