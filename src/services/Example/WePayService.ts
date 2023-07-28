import { Invoice } from '@prisma/client'
import RequestRepository from '../../repositories/RequestRepository'
import { DateTime } from '../../utils/DateTime'
import Formatter from '../../common/Formatter'

const SELF_URL = process.env.SELF_URL

const BASE_URL = process.env.WEPAY_URL || ''
const MERCHANT_ID = process.env.WEPAY_MERCHANT_ID || ''
const MERCHANT_NAME = process.env.MERCHANT_NAME || ''
const MERCHANT_DOCUMENT = process.env.MERCHANT_DOCUMENT || ''
const MERCHANT_SUPPORT_CHANNEL = process.env.MERCHANT_SUPPORT_CHANNEL || ''
const WEPAY_API_KEY = process.env.WEPAY_API_KEY || ''

export default class WePayService {
	static async createPix(invoice: Invoice): Promise<void> {
		const amountInCents = invoice.product.price * 100,
			webhook = SELF_URL + `/webhook/PIX/${invoice.id}`,
			payload = {
				clientId: parseInt(MERCHANT_ID),
				customNumber: invoice.id,
				callbackUrl: webhook,
				title: {
					expireDate: DateTime.tomorrow({ asString: true }),
					amountInCents: amountInCents,
				},
				buyer: {
					name: invoice.customer.name,
					document: {
						type: 'CPF',
						number: invoice.customer.document,
					},
				},
				sender: {
					name: MERCHANT_NAME,
					document: MERCHANT_DOCUMENT,
					helpdesk: MERCHANT_SUPPORT_CHANNEL,
				},
			},
			URL = BASE_URL + `/v1/payin/payments/pix`,
			headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${WEPAY_API_KEY}`,
			}

		const request = await RequestRepository.create({ url: URL, body: payload, headers, method: 'POST' })

		const response = await fetch(URL, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
		})

		let result = {}
		try {
			result = await response.json()
		} catch (e) {}

		await RequestRepository.update({ id: request.id, status: response.status, response: result })
	}

	static async createCreditCard(invoice: Invoice): Promise<void> {
		const amountInCents = invoice.product.price * 100,
			webhook = SELF_URL + `/webhook/CREDIT_CARD/${invoice.id}`,
			payload = {
				callbackUrl: webhook,
				customNumber: invoice.id,
				title: {
					expireDate: DateTime.nextMonth({ asString: true }),
					amountInCents: amountInCents,
				},
				buyer: {
					name: invoice.customer.name,
					email: invoice.customer.email,
					document: {
						type: 'CPF',
						number: invoice.customer.document,
					},
				},
				sender: {
					name: MERCHANT_NAME,
					document: MERCHANT_DOCUMENT,
					helpdesk: MERCHANT_SUPPORT_CHANNEL,
				},
				statement_descriptor: Formatter.softDescriptor(MERCHANT_NAME),
				product_info: [
					{
						id: invoice.product.sku,
						title: invoice.product.name,
						description: invoice.product.name,
						category_id: invoice.product.name,
						quantity: 1,
						unit_price: invoice.product.price,
					},
				],
			},
			URL = BASE_URL + `/v1/payin/payments/credit-card`,
			headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${WEPAY_API_KEY}`,
			}

		const request = await RequestRepository.create({ url: URL, body: payload, headers, method: 'POST' })

		const response = await fetch(URL, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
		})

		let result = {}
		try {
			result = await response.json()
		} catch (e) {}

		await RequestRepository.update({ id: request.id, status: response.status, response: result })
	}
}
