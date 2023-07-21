import { ExampleRawData } from './ExampleInterfaces'

const BASE_URL = 'https://api.chucknorris.io'

export default class ExampleService {
	static async generate(): Promise<null> {
		const URL = `${BASE_URL}/jokes/random`
		const response = await fetch(URL)
		const data = (await response.json()) as ExampleRawData

		const random = data.value

		return null
	}
}
