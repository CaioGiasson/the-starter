export default class Formatter {
	static numberAsString(number: string | number): string {
		const string = number.toString()
		return string.replace(/\D/g, '')
	}

	static leadingZeros(number: string | number): string {
		const n = `${number}`
		return parseInt(n) < 10 ? '0' + n : n
	}

	static softDescriptor(text: string): string {
		return text.replace(/[^a-zA-Z]/g, '').substring(0, 13)
	}
}
