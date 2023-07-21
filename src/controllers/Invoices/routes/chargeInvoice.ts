import { Request, Response } from 'express'
import Formatter from '../../../common/Formatter'
import ErrorManager from '../../../managers/ErrorManager'

/**
 *
 * @param req
 * @param res
 */
export default async function chargeInvoice(req: Request, res: Response): Promise<void> {
	const identifier = Formatter.numberAsString(req.query.number as string)

	let result = null
	try {
		result = 123
	} catch (error: unknown) {
		ErrorManager.log(error as Error)
	}

	const status = result === null ? 404 : 200
	const response = {
		success: result !== null,
		message: result === null ? 'Resource not found' : 'Resource found',
		data: result,
	}

	res.status(status).json(response)
}
