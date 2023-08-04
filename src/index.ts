import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app: Express = express()
const port = process.env.SERVER_PORT

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({ success: true, version: '1.0.1' })
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())

import InvoicesController from './controllers/Invoices/InvoicesController'
InvoicesController.listenForRoutes(app)

import CallbacksController from './controllers/Callbacks/CallbacksController'
CallbacksController.listenForRoutes(app)

import FrontendController from './controllers/Frontend/FrontendController'
FrontendController.listenForRoutes(app)
