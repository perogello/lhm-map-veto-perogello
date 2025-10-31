import './vetostrip.scss'
import { useMemo } from 'react'
import type { Match, Team, Veto } from '../../API/types'

type Props = { match: Match | null; teams: Record<string, Team>; lang: 'ru'|'en' }

const MAX_SLOTS = 7
const T = (lang: 'ru'|'en', type: 'ban'|'pick'|'decider') =>
  lang==='ru' ? (type==='ban'?'БАН':type==='pick'?'ПИК':'РЕШАЮЩАЯ') : (type==='ban'?'BAN':'PICK')

const aliasType = (raw?: string|null): 'ban'|'pick'|'decider'|'idle' => {
  if (!raw) return 'idle'
  const t = String(raw).toLowerCase()
  if (t==='ban' || t==='remove' || t==='veto') return 'ban'
  if (t==='pick' || t==='choice' || t==='choose') return 'pick'
  if (t==='decider' || t==='last' || t==='decide') return 'decider'
  return 'pick'
}

const resolveMapKey = (name?: string|null) => {
  if(!name) return 'default'
  const key = name.toLowerCase().replace(/\s+/g,'').replace(/-/g,'_')
  return key.startsWith('de_') ? key : `de_${key}`
}

const humanizeMapName = (key: string) => {
  const map: Record<string,string> = {
    de_mirage:'Mirage', de_ancient:'Ancient', de_inferno:'Inferno', de_nuke:'Nuke',
    de_overpass:'Overpass', de_vertigo:'Vertigo', de_dust2:'Dust 2', de_anubis:'Anubis',
    de_train:'Train', de_cache:'Cache'
  }
  return map[key] ?? key.replace(/^de_/,'').replace(/_/g,' ').replace(/\b\w/g, s=>s.toUpperCase())
}

export default function VetoStrip({match, teams, lang}:Props){
  const slots: (Veto|null)[] = useMemo(
    () => Array.from({length:MAX_SLOTS}).map((_,i)=> (match?.vetos||[])[i] ?? null),
    [match?.vetos]
  )

  return (
    <div className="veto-strip">
      {slots.map((veto, idx) => {
        const action  = aliasType(veto?.type)
        const state   = action // классы: ban/pick/decider/idle
        const mapKey  = veto?.mapName ? resolveMapKey(veto.mapName) : 'default'
        const mapName = veto?.mapName ? humanizeMapName(mapKey) : ''
        const team    = veto && action!=='decider' && veto.teamId ? teams[veto.teamId] : undefined
        const teamName= team?.name || ''
        // БЕЙДЖ: показываем всегда, если есть veto (даже если картинка/название ещё не готовы)
        const label   = veto ? T(lang, action as any) : ''

        return (
          <div key={idx} className={`slot ${state}`} data-idx={idx}>
            <div className="slot-bg">
              {/* твоя текущая логика картинки остаётся: положи сюда свой компонент/картинку как было раньше.
                 Если у тебя уже был <img className="map-img ..."> — оставь без изменений. */}
              <img className="map-img is-loaded" src={`maps/${mapKey}.png`} alt={mapName} />
              <div className="panel-overlay" />
            </div>

            {/* Бейдж: всегда поверх, всегда видим, с анимацией только при первом монтировании */}
            {veto && <div className={`badge ${state} badge-visible`}>{label}</div>}

            {action!=='decider' && team?.logo && (
              <div className="team-logo"><img src={team.logo} alt="logo" /></div>
            )}

            <div className="slot-footer">
              <div className="map-title">{mapName}</div>
              {action!=='decider' && <div className="team-title">{teamName}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
