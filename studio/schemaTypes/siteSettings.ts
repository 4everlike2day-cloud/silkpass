import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Настройки сайта',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'main', title: 'Главная', default: true},
    {name: 'passport', title: 'Паспорт'},
    {name: 'contacts', title: 'Контакты'},
  ],
  fields: [
    defineField({name: 'heroTitle', title: 'Заголовок на главной', type: 'localeString', group: 'main'}),
    defineField({name: 'heroLede', title: 'Подзаголовок на главной', type: 'localeText', group: 'main'}),
    defineField({name: 'hashtag', title: 'Хештег', type: 'string', initialValue: '#welcome2uz', group: 'main'}),
    defineField({
      name: 'passportPrice',
      title: 'Цена паспорта, сум',
      description: 'Оставьте пустым, пока цена не определена: на сайте будет «Price coming soon».',
      type: 'number',
      group: 'passport',
    }),
    defineField({name: 'rewardText', title: 'Награда за все 4 штампа', type: 'localeText', group: 'passport'}),
    defineField({name: 'instagram', title: 'Instagram (без @)', type: 'string', initialValue: 'silkpass', group: 'contacts'}),
    defineField({name: 'telegram', title: 'Telegram (без @)', type: 'string', group: 'contacts'}),
    defineField({name: 'whatsapp', title: 'WhatsApp, номер в формате 998901234567', type: 'string', group: 'contacts'}),
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contacts'}),
  ],
  preview: {prepare: () => ({title: 'Настройки сайта'})},
})
