import express, { Express } from 'express'

export default class FrontendController {
	static listenForRoutes(app: Express): void {
		app.use(`/checkout`, express.static(`${__dirname}/files`))
	}
}
