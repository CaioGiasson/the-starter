import { Errors } from '../common/Errors'
import ErrorManager from '../managers/ErrorManager'

import { PrismaClient, Invoice, Customer, Product } from '@prisma/client'

const prisma = new PrismaClient()

export default class InvoicesRepository {
	static async create(customer: Customer, product: Product): Promise<Invoice> {
		try {
			const invoice = await prisma.invoice.create({
				data: {
					customer,
					product,
					createdAt: new Date(),
				},
			})

			if (invoice) return invoice as Invoice
		} catch (error: unknown) {
			ErrorManager.log(error as Error)
		}
		throw new Error(Errors.INVOICE_CREATE_FAILED)
	}
	static async get(id: string): Promise<Invoice> {
		try {
			const invoice = await prisma.invoice.findUnique({
				where: {
					id,
				},
			})

			if (invoice) return invoice as Invoice
		} catch (error: unknown) {
			ErrorManager.log(error as Error)
		}
		throw new Error(Errors.INVOICE_NOT_FOUND)
	}
}
