import { Request, Response } from 'express'
import ErrorManager from '../../../managers/ErrorManager'
import InvoicesRepository from '../../../repositories/InvoicesRepository'
import { InvoiceStatus, InvoiceStatusTexts } from '../../../common/InvoiceStatus'
import { Errors } from '../../../common/Errors'

/**
 *
 * @param req
 * @param res
 */
export default async function getInvoiceStatus(req: Request, res: Response): Promise<void> {
	let result = null
	try {
		const invoiceId = req.params.id,
			invoice = await InvoicesRepository.get(invoiceId)
		if (!invoice) throw new Error(Errors.INVOICE_NOT_FOUND)

		const isWaitingMethod = invoice.chargeData === null,
			isRequested = invoice.chargeData !== null,
			isPaid = invoice.paymentData && invoice.paymentData.paidAt !== null,
			status = isPaid ? InvoiceStatus.PAID : isRequested ? InvoiceStatus.REQUESTED : InvoiceStatus.PENDING,
			description = InvoiceStatusTexts[status],
			method = isWaitingMethod ? undefined : invoice.chargeData?.method

		result = {
			status,
			description,
			method,
		}
	} catch (error: unknown) {
		ErrorManager.log(error as Error)
	}

	const status = result === null ? 404 : 200
	const response = {
		success: result !== null,
		message: result === null ? Errors.INVOICE_NOT_FOUND : '',
		data: result,
	}

	res.status(status).json(response)
}
