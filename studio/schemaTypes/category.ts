import {defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons/Folder'

export const category = defineType({
  name: 'category',
  title: 'Категория шопа',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({name: 'title', title: 'Название', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Адрес', type: 'slug', options: {source: 'title.en'}, validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Описание', type: 'localeText'}),
    defineField({name: 'order', title: 'Порядок', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'По порядку', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title.en', subtitle: 'slug.current'}},
})
