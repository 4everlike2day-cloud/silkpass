import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {CogIcon} from '@sanity/icons/Cog'
import {schemaTypes} from './schemaTypes'

const singletons = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'SilkPass · Welcome 2 UZB',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your_project_id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Контент')
          .items([
            S.listItem().title('Настройки сайта').id('siteSettings').icon(CogIcon)
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('city').title('Города'),
            S.documentTypeListItem('partner').title('Партнёры'),
            S.documentTypeListItem('deal').title('Скидки'),
            S.documentTypeListItem('adSlot').title('Реклама'),
            S.divider(),
            S.documentTypeListItem('category').title('Шоп: категории'),
            S.documentTypeListItem('product').title('Шоп: товары'),
            S.divider(),
            S.documentTypeListItem('faq').title('FAQ'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletons.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletons.has(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
