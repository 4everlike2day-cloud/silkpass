import {useId} from 'react'
import {pad} from '@/lib/format'

type Props = {nameUz: string; name: string; order: number; rot: number; size?: number; total?: number}

// Схематичный штамп для сайта. Настоящий дизайн штампов можно заменить картинкой позже.
export default function Stamp({nameUz, name, order, rot, size = 170, total = 4}: Props) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="stamp" viewBox="0 0 120 120" width={size} height={size} style={{transform: `rotate(${rot}deg)`}} role="img" aria-label={`${name} stamp`}>
      <defs>
        <path id={`${id}a`} d="M60,60 m-44,0 a44,44 0 1,1 88,0" />
        <path id={`${id}b`} d="M60,60 m-47,0 a47,47 0 0,0 94,0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text fontSize="10.5" letterSpacing="2.2" fontWeight="500">
        <textPath href={`#${id}a`} startOffset="50%" textAnchor="middle">{nameUz.toUpperCase()}</textPath>
      </text>
      <text fontSize="7.5" letterSpacing="1.6">
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">{`W2-UZ · ${pad(order)} / ${pad(total)}`}</textPath>
      </text>
      <text className="big" x="60" y="66" fontSize="22" textAnchor="middle">{pad(order)}</text>
      <line x1="42" y1="76" x2="78" y2="76" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  )
}
