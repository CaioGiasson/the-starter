import express, { Express } from 'express'
const router = express.Router()

import chargeUpdatePIX from './routes/chargeUpdatePIX'
import chargeUpdateCREDIT from './routes/chargeUpdateCREDIT'

export default class CallbacksController {
	static routes = [
		router.post(`/webhook/pix/:id`, chargeUpdatePIX),
		router.post(`/webhook/credit/:id`, chargeUpdateCREDIT),
	]

	static listenForRoutes(app: Express): void {
		for (const route of this.routes) app.use(route)
	}
}
