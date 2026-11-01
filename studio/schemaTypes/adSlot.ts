import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'

export const adSlot = defineType({
  name: 'adSlot',
  title: 'Рекламный слот',
  type: 'document',
  icon: BulbOutlineIcon,
  fields: [
    defineField({name: 'city', title: 'Город', type: 'reference', to: [{type: 'city'}], validation: (r) => r.required()}),
    defineField({name: 'advertiser', title: 'Рекламодатель', type: 'reference', to: [{type: 'partner'}]}),
    defineField({name: 'title', title: 'Заголовок', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Текст', type: 'localeText'}),
    defineField({name: 'url', title: 'Ссылка', type: 'url'}),
    defineField({name: 'image', title: 'Картинка', type: 'image'}),
    defineField({name: 'from', title: 'Показывать с', type: 'date'}),
    defineField({name: 'until', title: 'Показывать до', type: 'date'}),
    defineField({name: 'active', title: 'Включён', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'title.en', subtitle: 'city.nameUz', media: 'image'}},
})
