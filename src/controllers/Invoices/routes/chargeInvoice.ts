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

			// TODO: Pegar a resposta da cobrança criada e ver qual é próximo passo
			await WePayService.createCreditCard(invoice)
			result = {
				success: true,
			}
		}

		if (isPixCharge) {
			const chargeData = { method: 'PIX' as PaymentMethod, amount: invoice.product.price }
			chargeResult = await InvoiceRepository.setChargeData(invoiceId, chargeData)
			if (!chargeResult) throw new Error(Errors.INVOICE_CHARGE_FAILED)

			// TODO: Pegar a resposta da cobrança criada e ver qual é próximo passo
			await WePayService.createPix(invoice)

			result = {
				qrCode: MockData.qrCode,
				copyPaste: MockData.pixCopyPaste,
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
