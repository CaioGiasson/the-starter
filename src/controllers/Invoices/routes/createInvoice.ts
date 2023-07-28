import { Request, Response } from 'express'
import ErrorManager from '../../../managers/ErrorManager'
import InvoiceRepository from '../../../repositories/InvoiceRepository'
import { Errors } from '../../../common/Errors'

/**
 *
 * @param req
 * @param res
 */
export default async function createInvoice(req: Request, res: Response): Promise<void> {
	let result = null
	try {
		const { customer, product } = req.body,
			invoice = await InvoiceRepository.create(customer, product)

		result = { invoiceId: invoice.id }
	} catch (error: unknown) {
		ErrorManager.log(error as Error)
	}

	const status = result === null ? 404 : 201
	const response = {
		success: result !== null,
		message: result === null ? Errors.INVOICE_CREATE_FAILED : '',
		data: result,
	}

	res.status(status).json(response)
}
