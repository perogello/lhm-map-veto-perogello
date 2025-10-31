
import { useEffect, useState } from 'react'
import './app.scss'
import API from './API'
import type { Match, Team } from './API/types'
import VetoStrip from './HUD/VetoStrip/VetoStrip'

function vetoSignature(m?: Match|null){
  if(!m || !Array.isArray(m.vetos)) return '';
  return m.vetos.map(v => [v.type, v.mapName, v.teamId].join('|')).join('~');
}

export default function App(){
  const [match, setMatch] = useState<Match | null>(null)
  const [teams, setTeams] = useState<Record<string, Team>>({})

  useEffect(() => {
    let alive = true
    let lastSig = ''
    let lastTeamSet = new Set<string>()
    const load = async () => {
      try{
        const m = await API.match.getCurrent()
        if(!alive) return
        const sig = vetoSignature(m)
        if(sig !== lastSig){
          setMatch(m)
          lastSig = sig
          const ids = new Set<string>()
          ;(m?.vetos||[]).forEach(v => { if(v.teamId && v.type!=='decider') ids.add(v.teamId) })
          let changed = ids.size !== lastTeamSet.size || Array.from(ids).some(id => !lastTeamSet.has(id))
          if(changed && ids.size){
            const res = await Promise.all(Array.from(ids).map(id => API.teams.getOne(id)))
            const byId: Record<string, Team> = {}
            res.forEach(t => { if((t as any)?._id) byId[(t as any)._id] = t as Team })
            if(alive) setTeams(byId)
            lastTeamSet = ids
          }
        }
      }catch{ /* ignore; will retry */ }
    }
    load()
    const it = setInterval(load, 1200)
    return () => { alive = false; clearInterval(it) }
  }, [])

  return (
    <div className="root-1080p">
      <VetoStrip match={match} teams={teams} lang="ru" />
    </div>
  )
}
