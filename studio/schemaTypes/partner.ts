import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const partner = defineType({
  name: 'partner',
  title: 'Партнёр',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'name', title: 'Название', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'active', title: 'Показывать на сайте', type: 'boolean', initialValue: true}),
    defineField({name: 'city', title: 'Город', type: 'reference', to: [{type: 'city'}], validation: (r) => r.required()}),
    defineField({
      name: 'roles',
      title: 'Роль',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Точка штампа', value: 'stamp'},
          {title: 'Точка продажи паспортов', value: 'sales'},
          {title: 'Скидка для владельцев', value: 'deal'},
          {title: 'Рекламодатель', value: 'ad'},
        ],
        layout: 'grid',
      },
      validation: (r) => r.required().min(1),
    }),
    defineField({name: 'kind', title: 'Тип заведения', description: 'Hostel, Hotel, Cafe, Tour agency…', type: 'localeString'}),
    defineField({name: 'address', title: 'Адрес', type: 'localeString'}),
    defineField({name: 'hours', title: 'Часы работы', description: 'Например: 09:00–21:00, daily', type: 'string'}),
    defineField({name: 'mapsUrl', title: 'Ссылка на Google Maps', type: 'url'}),
    defineField({name: 'yandexUrl', title: 'Ссылка на Яндекс Карты', type: 'url'}),
    defineField({name: 'website', title: 'Сайт или Instagram партнёра', type: 'url'}),
    defineField({name: 'logo', title: 'Логотип', type: 'image'}),
    defineField({
      name: 'internalNote',
      title: 'Заметка для себя',
      description: 'Не показывается на сайте: контакт владельца, условия договора и т.п.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'name', city: 'city.nameUz', roles: 'roles', media: 'logo', active: 'active'},
    prepare: ({title, city, roles, media, active}) => ({
      title: active === false ? `${title} (скрыт)` : title,
      subtitle: [city, (roles || []).join(', ')].filter(Boolean).join(' · '),
      media,
    }),
  },
})
