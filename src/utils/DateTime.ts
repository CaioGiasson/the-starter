import Formatter from '../common/Formatter'

export class DateTime {
	static tomorrow({ asString = false, asDateTime = true }): Date | string {
		const date = new Date()
		date.setDate(date.getDate() + 1)
		const method = asDateTime ? DateTime.toDateTimeString : DateTime.toDateString
		return asString ? method(date) : date
	}

	static nextMonth({ asString = false, asDateTime = true }): Date | string {
		const date = new Date()
		date.setMonth(date.getMonth() + 1)
		const method = asDateTime ? DateTime.toDateTimeString : DateTime.toDateString
		return asString ? method(date) : date
	}

	static toDateTimeString(date: Date) {
		const year = date.getFullYear(),
			month = Formatter.leadingZeros(date.getMonth() + 1),
			day = Formatter.leadingZeros(date.getDate()),
			hour = Formatter.leadingZeros(date.getHours()),
			minute = Formatter.leadingZeros(date.getMinutes()),
			second = Formatter.leadingZeros(date.getSeconds())

		return `${year}-${month}-${day}T${hour}:${minute}:${second}`
	}

	static toDateString(date: Date) {
		const year = date.getFullYear(),
			month = Formatter.leadingZeros(date.getMonth() + 1),
			day = Formatter.leadingZeros(date.getDate())

		return `${year}-${month}-${day}`
	}

	static toTimeString(date: Date) {
		const hour = Formatter.leadingZeros(date.getHours()),
			minute = Formatter.leadingZeros(date.getMinutes()),
			second = Formatter.leadingZeros(date.getSeconds())

		return `${hour}:${minute}:${second}`
	}
}
