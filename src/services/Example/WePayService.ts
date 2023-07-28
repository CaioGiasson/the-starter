import RequestRepository from '../../repositories/RequestRepository'
import { ExampleRawData } from './ExampleInterfaces'

const SELF_URL = process.env.SELF_URL

const BASE_URL = process.env.WEPAY_URL || ''
const MERCHANT_ID = process.env.WEPAY_MERCHANT_ID || ''
const WEPAY_API_KEY = process.env.WEPAY_API_KEY || ''

export default class WePayService {
	static async createPix(amount: number, invoiceId: string): Promise<void> {
		const amountInCents = amount * 100,
			webhook = SELF_URL + `/webhook/pix/${invoiceId}`,
			payload = {
				clientId: parseInt(MERCHANT_ID),
				customNumber: invoiceId,
				callbackUrl: webhook,
				title: {
					expireDate: '2023-07-28T16:20:00',
					amountInCents: amountInCents,
				},
				buyer: {
					name: 'Fulano de Tal',
					document: {
						type: 'CPF',
						number: '00000000191',
					},
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
}
