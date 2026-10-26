import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

// Подарок за пройденный маршрут. Турист выбирает его в форме «Маршрут пройден» на странице /reward.
// Выключите «Доступен сейчас», и подарок пропадёт из списка на сайте (после публикации и пересборки).
export const gift = defineType({
  name: 'gift',
  title: 'Подарок за маршрут',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({name: 'title', title: 'Название', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Описание и условия', type: 'localeText', description: 'Коротко: что это и как получить. Например, «скидка 20% на паспорт, действует 14 дней».'}),
    defineField({name: 'active', title: 'Доступен сейчас', type: 'boolean', initialValue: true}),
    defineField({name: 'order', title: 'Порядок', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'По порядку', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title.ru', en: 'title.en', active: 'active'},
    prepare: ({title, en, active}) => ({title: title || en, subtitle: active === false ? 'Скрыт' : 'Доступен'}),
  },
})
