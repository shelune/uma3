import * as fs from 'fs'
import * as path from 'path'

import { CharacterNameID } from '../../frontend/src/types/characterNameId'
import characterListJSON from '../home/chara_names_with_id.json'

// Output and make sure directory exists
const outputDir = path.resolve(__dirname, '../home/images/characters')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const CHARACTER_LIST: CharacterNameID[] = characterListJSON

const fetchImages = async () => {
  for (const character of CHARACTER_LIST) {
    const url = `https://gametora.com/images/umamusume/characters/chara_stand_${character.chara_id_base}_${character.chara_id}.png`
    const res = await fetch(url)
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(
        path.join(outputDir, `${character.chara_id}.png`),
        buffer
      )
      console.log(`Fetched and saved: ${character.chara_name}`)
    } else {
      console.warn(`Failed to fetch: ${url} (status: ${res.status})`)
    }
  }
}

;(async () => {
  try {
    await fetchImages()
  } catch (error) {
    console.error('Error', error)
  }
})()
