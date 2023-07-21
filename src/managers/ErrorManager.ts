export default class ErrorManager {
	static async log(error: Error): Promise<void> {
		// TODO: Logar erro de forma mais adequada
		// eslint-disable-next-line no-console
		console.log(error.message)
	}
}
