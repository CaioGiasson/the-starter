import { Request, Response } from 'express'
import ErrorManager from '../../../managers/ErrorManager'
import InvoicesRepository from '../../../repositories/InvoicesRepository'
import { Errors } from '../../../common/Errors'
import { PaymentMethod } from '@prisma/client'
import MockData from '../../../common/MockData'

/**
 *
 * @param req
 * @param res
 */
export default async function chargeInvoice(req: Request, res: Response): Promise<void> {
	let result = null
	try {
		const invoiceId = req.params.id,
			invoice = await InvoicesRepository.get(invoiceId)
		if (!invoice) throw new Error(Errors.INVOICE_NOT_FOUND)

		const { creditCardHash, pix } = req.body,
			hasCreditCardHash = creditCardHash && creditCardHash.length > 0,
			isCreditCardCharge = hasCreditCardHash,
			isPixCharge = !isCreditCardCharge

		// TODO: Decodificar e validar hash do cartão de crédito

		// Primeiro salva o método requisitado como credit card hash
		let chargeResult = null
		if (isCreditCardCharge) {
			const chargeData = { method: 'CREDIT_CARD' as PaymentMethod, amount: invoice.product.price }
			chargeResult = await InvoicesRepository.setChargeData(invoiceId, chargeData)
			if (!chargeResult) throw new Error(Errors.INVOICE_CHARGE_FAILED)

			const checkoutSuccess = Math.random() > 0.3
			if (checkoutSuccess) {
				const paymentData = { doc: 'AUTHXPTO1234', aut: '12983741617' },
					paymentResult = await InvoicesRepository.setPaymentData(invoiceId, paymentData)
				if (!paymentResult) throw new Error(Errors.INVOICE_CHARGE_FAILED)
				result = paymentData
			}
		}

		if (isPixCharge) {
			const chargeData = { method: 'PIX' as PaymentMethod, amount: invoice.product.price }
			chargeResult = await InvoicesRepository.setChargeData(invoiceId, chargeData)
			if (!chargeResult) throw new Error(Errors.INVOICE_CHARGE_FAILED)
			result = {
				qrCode: MockData.qrCode,
				copyPaste: MockData.pixCopyPaste,
			}
		}

		// TODO: Fazer a tentativa de pagamento

		// Temporariamente, faz o checkout com 30% de chance de falha/sucesso e emite dados de comprovante
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
