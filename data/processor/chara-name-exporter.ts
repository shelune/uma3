import * as fs from 'fs'
import * as path from 'path'
import { CharacterNameID } from '../../frontend/src/types/characterNameId'
import { DressData } from '../../frontend/src/types/dressData'
import { TextData } from '../../frontend/src/types/textData'

const allTextsPath = path.resolve(__dirname, '../wild/all_texts.json')
const dressDataPath = path.resolve(__dirname, '../wild/dress_data.json')

const allTextsRaw = fs.readFileSync(allTextsPath, 'utf-8')
const allTexts: Array<TextData> = JSON.parse(allTextsRaw)

const dressDataRaw = fs.readFileSync(dressDataPath, 'utf-8')
const dressData: Array<DressData> = JSON.parse(dressDataRaw)

const exportCharacterNames = async () => {
  const dressIds = new Set(dressData.map(item => item.id.toString()))

  const formatCharacter = (item: TextData): CharacterNameID => ({
    chara_id: item.index.toString(),
    chara_name: item.text,
    chara_id_base: item.index.toString().slice(0, 4),
    dress_color_main: `#${
      dressData.find(d => d.id.toString() === item.index.toString())
        ?.dress_color_main || '000000'
    }`,
  })

  const result = allTexts
    .filter(
      item =>
        // matching "index" to "id" and category to 4 (character names)?
        dressIds.has(item.index.toString()) && item.category === 4
    )
    .map(formatCharacter)

  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, '../home/chara_names_with_id.json'),
      JSON.stringify(result, null, 2),
      'utf-8',
      err => {
        if (err) {
          reject(err)
        } else {
          console.log(
            `Parsed ${result.length} characters for id - name - dress color`
          )
          resolve()
        }
      }
    )
  })
}

// Run the function directly
exportCharacterNames().catch(error => {
  console.error('Error exporting character names:', error)
  process.exit(1)
})
