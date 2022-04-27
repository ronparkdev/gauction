import { writeList } from './services/naver/listWriter'

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
