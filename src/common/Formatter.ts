export default class Formatter {
	static numberAsString(number: string | number): string {
		const string = number.toString()
		return string.replace(/\D/g, '')
	}
}
