import {defineType} from 'sanity'

// Поля с переводом. Сейчас обязателен только английский; RU и UZ заполняются, когда запустим эти языки.
const langs = [
  {id: 'en', title: 'English', required: true},
  {id: 'ru', title: 'Русский'},
  {id: 'uz', title: "O'zbekcha"},
]

export const localeString = defineType({
  name: 'localeString',
  title: 'Text',
  type: 'object',
  options: {collapsible: false},
  fields: langs.map((l) => ({
    name: l.id,
    title: l.title,
    type: 'string',
    validation: l.required ? (r: any) => r.required() : undefined,
  })),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Long text',
  type: 'object',
  fields: langs.map((l) => ({
    name: l.id,
    title: l.title,
    type: 'text',
    rows: 4,
    validation: l.required ? (r: any) => r.required() : undefined,
  })),
})
