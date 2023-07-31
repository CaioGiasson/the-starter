import { Errors } from '../common/Errors'
import ErrorManager from '../managers/ErrorManager'

import { Callback, PaymentMethod, PrismaClient, Request } from '@prisma/client'

const prisma = new PrismaClient()

type CallbackCreateArgs = {
	url: string
	method: PaymentMethod
	body?: object
}

export default class CallbackRepository {
	static async create(requestData: CallbackCreateArgs, status: string, invoiceId: string): Promise<Callback> {
		try {
			const request = await prisma.callback.create({
				data: {
					...requestData,
					body: requestData.body || {},
					receivedAt: new Date(),
				},
			})

			if (request) return request
		} catch (error: unknown) {
			ErrorManager.log(error as Error)
		}
		throw new Error(Errors.INTERNAL_ERROR)
	}
}
