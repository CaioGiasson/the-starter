import fs from 'fs'
import crypto from 'crypto'
import path from 'path'

const privateKey = path.join(__dirname, '../../keys/private_key.pem')
const publicKey = path.join(__dirname, '../../keys/private_key.pem')

export default class CryptoManager {
	static encrypt(plainText: string): string {
		return crypto
			.publicEncrypt(
				{
					key: fs.readFileSync(publicKey, 'utf8'),
					padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
					oaepHash: 'sha256',
				},
				Buffer.from(plainText)
			)
			.toString('base64')
	}

	static decrypt(encryptedText: string): string {
		const encryptedBuffer = Buffer.from(encryptedText, 'base64')

		return crypto
			.privateDecrypt(
				{
					key: fs.readFileSync(privateKey, 'utf8'),
					padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
					oaepHash: 'sha256',
				},
				encryptedBuffer
			)
			.toString()
	}
}
