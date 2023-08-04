import { Request, Response } from 'express'
import ErrorManager from '../../../managers/ErrorManager'
import InvoiceRepository from '../../../repositories/InvoiceRepository'
import { Errors } from '../../../common/Errors'
import { PaymentMethod } from '@prisma/client'
import MockData from '../../../common/MockData'
import WePayService from '../../../services/Example/WePayService'

/**
 *
 * @param req
 * @param res
 */
export default async function chargeInvoice(req: Request, res: Response): Promise<void> {
	let result = null
	try {
		const invoiceId = req.params.id,
			invoice = await InvoiceRepository.get(invoiceId)
		if (!invoice) throw new Error(Errors.INVOICE_NOT_FOUND)

		console.log(`\n\n`)
		console.log(invoice)

		const { pix } = req.body,
			isPixCharge = pix === true,
			isCreditCardCharge = !isPixCharge

		console.log({ isCreditCardCharge })

		let chargeResult = null
		if (isCreditCardCharge) {
			const chargeData = { method: 'CREDIT_CARD' as PaymentMethod, amount: invoice.product.price }
			chargeResult = await InvoiceRepository.setChargeData(invoiceId, chargeData)
			console.log(chargeResult)
			if (!chargeResult) throw new Error(Errors.INVOICE_CHARGE_FAILED)

			const checkoutUrl = await WePayService.createCreditCard(invoice)
			await InvoiceRepository.saveCheckoutUrl(invoice.id, checkoutUrl)

			result = {
				success: true,
				checkoutUrl,
			}
		}

		if (isPixCharge) {
			const chargeData = { method: 'PIX' as PaymentMethod, amount: invoice.product.price }
			chargeResult = await InvoiceRepository.setChargeData(invoiceId, chargeData)
			if (!chargeResult) throw new Error(Errors.INVOICE_CHARGE_FAILED)

			const checkoutUrl = await WePayService.createPix(invoice)
			await InvoiceRepository.saveCheckoutUrl(invoice.id, checkoutUrl)

			result = {
				success: true,
				checkoutUrl,
			}
		}
	} catch (error: unknown) {
		ErrorManager.log(error as Error)
	}

	const status = result === null ? 404 : 200
	const response = {
		success: result !== null,
		message: result === null ? Errors.INVOICE_CHARGE_FAILED : '',
		data: result,
	}

	res.status(status).json(response)
}
