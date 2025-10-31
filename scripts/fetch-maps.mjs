
import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
const outDir = path.resolve('public', 'maps')
fs.mkdirSync(outDir, { recursive: true })
const files = {
  de_mirage:  'https://developer.valvesoftware.com/w/images/6/6f/Counter-Strike_2_-_de_mirage.png',
  de_ancient: 'https://developer.valvesoftware.com/w/images/4/4d/Counter-Strike_2_-_de_ancient.png',
  de_inferno: 'https://developer.valvesoftware.com/w/images/a/ad/De_inferno_png.png',
  de_nuke:    'https://developer.valvesoftware.com/w/images/e/e9/Counter-Strike_2_-_de_nuke.png',
  de_overpass:'https://developer.valvesoftware.com/w/images/f/fc/Counter-Strike_2_-_de_overpass_2.png',
  de_vertigo: 'https://developer.valvesoftware.com/w/images/c/ca/Counter-Strike_2_-_de_vertigo_0.png',
  de_dust2:   'https://developer.valvesoftware.com/w/images/0/0c/Counter-Strike_2_-_de_dust2.png',
  de_anubis:  'https://developer.valvesoftware.com/w/images/d/d4/De_anubis_png.png'
}
function download(url, dest){
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, res => {
      const redirected = res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location
      const stream = redirected ? https.get(res.headers.location, r2 => r2.pipe(file)) : res
      ;(redirected ? stream : res).on('end', ()=>{})
      if (res.statusCode && res.statusCode !== 200 && !redirected) { file.close(); fs.unlink(dest,()=>{}); return reject(new Error('HTTP '+res.statusCode)) }
      if (!redirected) res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', err => { fs.unlink(dest, ()=>{}); reject(err) })
  })
}
for (const [name, url] of Object.entries(files)){
  const dest = path.join(outDir, `${name}.png`)
  console.log('→', name)
  try { await download(url, dest) } catch(e){ console.error('  failed', e.message) }
}
console.log('done.')
