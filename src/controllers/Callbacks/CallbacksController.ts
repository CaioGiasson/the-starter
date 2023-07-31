import express, { Express } from 'express'
const router = express.Router()

import chargeUpdatePIX from './routes/chargeUpdatePIX'
import chargeUpdateCREDIT from './routes/chargeUpdateCREDIT'

export default class CallbacksController {
	static routes = [
		router.post(`/webhook/PIX/:id`, chargeUpdatePIX),
		router.post(`/webhook/CREDIT_CARD/:id`, chargeUpdateCREDIT),
	]

	static listenForRoutes(app: Express): void {
		for (const route of this.routes) app.use(route)
	}
}
