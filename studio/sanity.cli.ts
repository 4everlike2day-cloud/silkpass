import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your_project_id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Адрес админки после `npm run deploy`: https://welcome2.sanity.studio
  studioHost: 'welcome2',
  deployment: {
    appId: 'c9i0tsbu2ogrk0uga1ossqmu',
  },
})
