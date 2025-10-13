import fs from 'fs'
import path from 'path'

// Input and output file paths
const inputPath = path.resolve(__dirname, '../home/skills-simplified.json')
const outputPath = path.resolve(__dirname, '../home/green-skills.json')

// Read and parse the input JSON file
const skillsData: any[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))

// Filter for objects where "char" is an array with exactly one element
const greenSkills = skillsData.filter(
  skill => Array.isArray(skill.char) && skill.char.length === 1
)

// Write the filtered array to the output file
fs.writeFileSync(outputPath, JSON.stringify(greenSkills, null, 2), 'utf-8')

console.log(`Filtered ${greenSkills.length} green skills to ${outputPath}`)
