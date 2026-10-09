import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

export const product = defineType({
  name: 'product',
  title: 'Товар',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({name: 'title', title: 'Название', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Адрес', type: 'slug', options: {source: 'title.en'}, validation: (r) => r.required()}),
    defineField({name: 'category', title: 'Категория', type: 'reference', to: [{type: 'category'}], validation: (r) => r.required()}),
    defineField({name: 'price', title: 'Цена, сум', type: 'number', validation: (r) => r.required().min(0)}),
    defineField({name: 'oldPrice', title: 'Старая цена, сум', description: 'Если есть скидка', type: 'number'}),
    defineField({name: 'images', title: 'Фото', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}})]}),
    defineField({name: 'description', title: 'Описание', type: 'localeText'}),
    defineField({name: 'maker', title: 'Мастер или производитель', type: 'string'}),
    defineField({name: 'inStock', title: 'В наличии', type: 'boolean', initialValue: true}),
    defineField({name: 'featured', title: 'Показывать на главной', type: 'boolean', initialValue: false}),
    defineField({name: 'order', title: 'Порядок в категории', type: 'number', initialValue: 10}),
  ],
  preview: {
    select: {title: 'title.en', price: 'price', cat: 'category.title.en', media: 'images.0', inStock: 'inStock'},
    prepare: ({title, price, cat, media, inStock}) => ({
      title: inStock === false ? `${title} (нет в наличии)` : title,
      subtitle: [cat, price != null ? `${price.toLocaleString('ru-RU')} сум` : null].filter(Boolean).join(' · '),
      media,
    }),
  },
})
