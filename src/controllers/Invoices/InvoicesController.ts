import express, { Express } from 'express'
const router = express.Router()

import createInvoice from './routes/createInvoice'
import chargeInvoice from './routes/chargeInvoice'
import getInvoiceStatus from './routes/getInvoiceStatus'

export default class InvoicesController {
	static routes = [
		router.post(`/invoices`, createInvoice),
		router.patch(`/invoices/:id`, chargeInvoice),
		router.get(`/invoices/:id`, getInvoiceStatus),
	]

	static listenForRoutes(app: Express): void {
		for (const route of this.routes) app.use(route)
	}
}
