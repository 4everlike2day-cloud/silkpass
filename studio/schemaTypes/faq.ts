import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

export const faq = defineType({
  name: 'faq',
  title: 'Вопрос FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'question', title: 'Вопрос', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'answer', title: 'Ответ', type: 'localeText', validation: (r) => r.required()}),
    defineField({name: 'order', title: 'Порядок', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'По порядку', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question.en'}},
})
