import { Errors } from '../common/Errors'
import ErrorManager from '../managers/ErrorManager'

import { PrismaClient, Request } from '@prisma/client'

const prisma = new PrismaClient()

type RequestCreateArgs = {
	url: string
	method: string
	body?: object
	headers?: object
}

type RequestUpdateArgs = {
	id: string
	status: number
	response: object
}

export default class RequestRepository {
	static async create(requestData: RequestCreateArgs): Promise<Request> {
		try {
			const request = await prisma.request.create({
				data: {
					...requestData,
					body: requestData.body || undefined,
					headers: requestData.headers || undefined,
					createdAt: new Date(),
				},
			})

			if (request) return request
		} catch (error: unknown) {
			ErrorManager.log(error as Error)
		}
		throw new Error(Errors.INTERNAL_ERROR)
	}

	static async update(requestData: RequestUpdateArgs): Promise<Request> {
		try {
			const request = await prisma.request.update({
				where: {
					id: requestData.id,
				},
				data: {
					status: requestData.status,
					response: requestData.response,
					updatedAt: new Date(),
				},
			})

			if (request) return request
		} catch (error: unknown) {
			ErrorManager.log(error as Error)
		}
		throw new Error(Errors.INTERNAL_ERROR)
	}
}
