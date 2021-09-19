import { writeList } from './services/tank/listWriter'

const crawling = async () => {
  await writeList()
}

const main = async () => {
  try {
    await crawling()
  } catch (e) {
    console.error(e)
  }
}

main()
