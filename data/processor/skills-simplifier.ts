import * as fs from 'fs'
import * as path from 'path'

type SkillInput = {
  enname: string
  name_en: string
  jpname: string
  name_jp: string
  char: number[]
  iconid: number
  id: number
  [key: string]: unknown // allow extra properties
}

type SkillOutputEN = {
  name_en: string
  jpname: string
  char: number[]
  iconid: number
  id: number
}

// Path to the input and output files
const inputPath = path.resolve(__dirname, '../wild/skills.json')
const outputPath = path.resolve(__dirname, '../home/skills-simplified.json')

// Read and parse the input JSON file
const rawData = fs.readFileSync(inputPath, 'utf-8')
const skills: SkillInput[] = JSON.parse(rawData)

const skillVariantSymbolsExtra = ['×', '◎']
const skillVariantSymbol = ['○']

// Map and filter properties
const simplifiedSkills: SkillOutputEN[] = skills
  .filter(skill => Boolean(skill.name_en))
  .filter(
    skill => !skillVariantSymbolsExtra.some(sym => skill.name_en.includes(sym))
  )
  .map(skill => ({
    name_en: skill.name_en
      .replace(new RegExp(`[${skillVariantSymbol.join('')}]`, 'g'), '')
      .trim(),
    jpname: skill.jpname,
    name_jp: skill.name_jp,
    char: skill.char,
    iconid: skill.iconid,
    id: skill.id,
  }))

fs.writeFileSync(outputPath, JSON.stringify(simplifiedSkills, null, 2), 'utf-8')

console.log(`Simplified skills written to ${outputPath}`)
