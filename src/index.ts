import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app: Express = express()
const port = process.env.SERVER_PORT

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({ success: true, version: '0.9.9' })
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())

import InvoicesController from './controllers/Invoices/InvoicesController'
InvoicesController.listenForRoutes(app)
