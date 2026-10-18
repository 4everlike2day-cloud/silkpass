import Link from 'next/link'
import {getCities, getSettings, pad} from '@/lib/data'
import {href, t, type Lang} from '@/lib/i18n'

export const howMeta = (lang: Lang) => ({title: t(lang).nav.how})

export default async function HowItWorks({lang}: {lang: Lang}) {
  const d = t(lang).how
  const [settings, cities] = await Promise.all([getSettings(lang), getCities(lang)])
  const fill = (s: string) => s.replace('{tag}', settings.hashtag).replace('{n}', String(cities.length))
  return (
    <>
      <section><div className="wrap"><p className="label">{t(lang).nav.how}</p><h1 style={{marginTop: 18, maxWidth: '14ch'}}>{d.title}</h1></div></section>
      <section>
        <div className="wrap">
          <ol className="places">
            {d.steps.map(([title, text], i) => (
              <li key={i}><span className="n">{pad(i + 1)}</span><div><h3>{title}</h3><p className="muted">{fill(text)}</p></div></li>
            ))}
          </ol>
        </div>
      </section>
      <section>
        <div className="wrap grid2">
          <div className="card"><p className="label">{d.reward}</p><h3>{d.rewardTitle(cities.length)}</h3><p className="muted">{d.rewardText}</p><p style={{marginTop: 14}}><Link className="btn ghost" href={href(lang, '/reward')}>{d.rewardMore}</Link></p></div>
          <div className="card"><p className="label">{d.rules}</p><h3>{d.rulesTitle}</h3><p className="muted">{d.rulesText}</p></div>
        </div>
      </section>
    </>
  )
}
