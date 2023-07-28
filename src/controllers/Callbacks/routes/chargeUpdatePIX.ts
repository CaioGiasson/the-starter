import { Request, Response } from 'express'
import ErrorManager from '../../../managers/ErrorManager'
import InvoiceRepository from '../../../repositories/InvoiceRepository'
import { Errors } from '../../../common/Errors'
import { PaymentMethod } from '@prisma/client'
import CallbackRepository from '../../../repositories/CallbackRepository'

/**
 *
 * @param req
 * @param res
 */
export default async function chargeUpdatePIX(req: Request, res: Response): Promise<void> {
	let result = null
	try {
		const invoiceId = req.params.id,
			body = req.body,
			method = PaymentMethod.PIX

		// Retorno antecipado para liberar o webhook
		res.status(200).json({ success: true })

		// Depois do retorno o processamento segue
		const invoice = await InvoiceRepository.get(invoiceId)
		if (!invoice) throw new Error(Errors.INVOICE_NOT_FOUND)

		await CallbackRepository.create({ url: req.url, method, body })
	} catch (error: unknown) {
		ErrorManager.log(error as Error)
	}
}
