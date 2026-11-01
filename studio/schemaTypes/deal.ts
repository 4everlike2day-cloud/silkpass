import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const deal = defineType({
  name: 'deal',
  title: 'Скидка для владельцев',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({name: 'partner', title: 'Партнёр', type: 'reference', to: [{type: 'partner'}], validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Предложение', description: 'Например: 10% off with the passport', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'validUntil', title: 'Действует до', type: 'date'}),
    defineField({name: 'active', title: 'Показывать', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'text.en', subtitle: 'partner.name'}},
})
