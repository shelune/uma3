import ALL_SKILLS_DATA from '../assets/home/skills-simplified.json'

export type RaceDate =
  `${1 | 2 | 3}-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}-${1 | 2}`

export type RaceWithDate = {
  name: string
  date: RaceDate
}

const MONTH_MAPPING = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

const sortRaceWithDate = (races: RaceWithDate[]): RaceWithDate[] => {
  return races.slice().sort((a, b) => {
    const [ya, ma, da] = a.date.split('-').map(Number)
    const [yb, mb, db] = b.date.split('-').map(Number)
    if (ya !== yb) return ya - yb
    if (ma !== mb) return ma - mb
    return da - db
  })
}

const groupRacesIntoMonths = (races: RaceWithDate[]) => {
  const calendar = Object.entries(MONTH_MAPPING).reduce(
    (acc, [monthNum, monthName]) => {
      const racesInMonth = races.filter(race => {
        const raceMonth = race.date.split('-')[1]
        return Number(raceMonth) === Number(monthNum)
      })
      if (racesInMonth.length > 0) {
        acc[monthName] = racesInMonth
      }
      return acc
    },
    {} as Record<string, RaceWithDate[]>
  )
  return calendar
}

const racesWithDate: RaceWithDate[] = [
  { name: 'Asahi Hai Futurity Stakes', date: '1-12-1' },
  { name: 'Hanshin Juvenile Fillies', date: '1-12-1' },
  { name: 'Hopeful Stakes', date: '1-12-2' },
  { name: 'Oka Sho', date: '2-4-1' },
  { name: 'Satsuki Sho', date: '2-4-1' },
  { name: 'NHK Mile Cup', date: '2-5-1' },
  { name: 'Japanese Oaks', date: '2-5-2' },
  { name: 'Tokyo Yushun (Japanese Derby)', date: '2-5-2' },
  { name: 'Yasuda Kinen', date: '2-6-1' },
  { name: 'Takarazuka Kinen', date: '2-6-2' },
  { name: 'Japan Dirt Derby', date: '2-7-1' },
  { name: 'Sprinters Stakes', date: '2-9-2' },
  { name: 'Kikuka Sho', date: '2-10-2' },
  { name: 'Shuka Sho', date: '2-10-2' },
  { name: 'Tenno Sho (Autumn)', date: '2-10-2' },
  { name: 'JBC Classic', date: '2-11-1' },
  { name: "JBC Ladies' Classic", date: '2-11-1' },
  { name: 'JBC Sprint', date: '2-11-1' },
  { name: 'Queen Elizabeth II Cup', date: '2-11-1' },
  { name: 'Japan Cup', date: '2-11-2' },
  { name: 'Mile Championship', date: '2-11-2' },
  { name: 'Champions Cup', date: '2-12-1' },
  { name: 'Arima Kinen', date: '2-12-2' },
  { name: 'Tokyo Daishoten', date: '2-12-2' },
  { name: 'February Stakes', date: '3-2-2' },
  { name: 'Osaka Hai', date: '3-3-2' },
  { name: 'Takamatsunomiya Kinen', date: '3-3-2' },
  { name: 'Tenno Sho (Spring)', date: '3-4-2' },
  { name: 'Victoria Mile', date: '3-5-1' },
  { name: 'Teio Sho', date: '3-6-2' },
]

export const BASE_WHITE_SPARK_RACES = racesWithDate.map(r => r.name)

export const WHITE_SPARK_RACES = groupRacesIntoMonths(
  sortRaceWithDate(racesWithDate)
)

const whiteSparks = ALL_SKILLS_DATA.map(skill => skill.name_en)

export const WHITE_SPARK_SKILLS: string[] = whiteSparks

export const WHITE_SPARK_SCENARIOS: string[] = ['URA Finale', 'Unity Cup']
