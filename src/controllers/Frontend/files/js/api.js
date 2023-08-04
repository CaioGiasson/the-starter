const API_URL = `/invoices`

async function createInvoice(payload) {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})

	const data = await response.json()

	return data
}

async function createInvoiceLink(invoiceId, method) {
	const payload = {
		pix: method === 'PIX',
	}
	const response = await fetch(`${API_URL}/${invoiceId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})

	const data = await response.json()

	return data
}
