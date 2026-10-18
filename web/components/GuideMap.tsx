'use client'
import {useEffect, useRef} from 'react'
import 'leaflet/dist/leaflet.css'

type Pt = {n: number; title: string; lat: number; lon: number; href: string}

// Карта на Leaflet + OpenStreetMap. Leaflet подгружается только в браузере.
export default function GuideMap({points}: {points: Pt[]}) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let map: import('leaflet').Map | null = null
    let cancelled = false
    import('leaflet').then(({default: L}) => {
      if (cancelled || !el.current) return
      map = L.map(el.current, {scrollWheelZoom: false})
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)
      const markers = points.map((p) =>
        L.marker([p.lat, p.lon], {
          icon: L.divIcon({className: 'map-pin', html: `<span>${p.n}</span>`, iconSize: [30, 30], iconAnchor: [15, 15]}),
          title: p.title,
        }).bindPopup(`<b>${p.n}. ${p.title}</b><br><a href="${p.href}">See photo ↓</a>`),
      )
      const group = L.featureGroup(markers).addTo(map)
      map.fitBounds(group.getBounds().pad(0.15))
    })
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [points])
  return <div ref={el} className="guide-map" role="region" aria-label="Map" />
}
