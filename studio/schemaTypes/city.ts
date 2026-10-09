import {defineArrayMember, defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

export const city = defineType({
  name: 'city',
  title: 'Город',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({name: 'nameUz', title: 'Название по-узбекски', description: 'Как на штампе: Toshkent, Samarqand…', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'name', title: 'Название', type: 'localeString', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Адрес страницы',
      description: 'ВНИМАНИЕ: на этот адрес ведёт QR в напечатанных паспортах. После печати не меняйте!',
      type: 'slug',
      options: {source: 'name.en'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Номер на маршруте', type: 'number', validation: (r) => r.required().min(1)}),
    defineField({name: 'stampRotation', title: 'Наклон штампа на сайте, градусы', type: 'number', initialValue: 0}),
    defineField({name: 'heroImage', title: 'Фото', type: 'image', options: {hotspot: true}}),
    defineField({name: 'intro', title: 'Вступление', type: 'localeText', validation: (r) => r.required()}),
    defineField({
      name: 'places',
      title: 'Топ мест',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'place',
          fields: [
            defineField({name: 'title', title: 'Название', type: 'localeString'}),
            defineField({name: 'text', title: 'Описание', type: 'localeText'}),
            defineField({name: 'mapsUrl', title: 'Ссылка на карту', type: 'url'}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'text.en'}},
        }),
      ],
    }),
    defineField({name: 'food', title: 'Что попробовать', type: 'array', of: [defineArrayMember({type: 'localeString'})]}),
    defineField({
      name: 'nextTravel',
      title: 'Как добраться до следующего города',
      description: 'Например: Afrosiyob high-speed train · about 2 h 15 min. Для последнего города оставьте пустым.',
      type: 'localeString',
    }),
  ],
  orderings: [{title: 'По маршруту', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'nameUz', subtitle: 'name.en', order: 'order', media: 'heroImage'},
    prepare: ({title, subtitle, order, media}) => ({title: `${order}. ${title}`, subtitle, media}),
  },
})
