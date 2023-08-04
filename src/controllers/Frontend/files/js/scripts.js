// First page loading
window.onload = function () {
	loadProductData()
}

function getProductFromURL() {
	const urlParams = new URLSearchParams(window.location.search)

	// There is no centralized product database on the company
	// This means all products should be passed through query parameters
	const product = {
		sku: '' + urlParams.get('sku'),
		name: '' + urlParams.get('product'),
		price: parseFloat(urlParams.get('price')),
	}
	const isValidProduct = validateProduct(product)

	if (isValidProduct) {
		saveProductOnLocalStorage(product)
		document.location = window.location.origin + window.location.pathname
		return product
	}

	return null
}

function saveProductOnLocalStorage(product) {
	localStorage.setItem('product', JSON.stringify(product))
}
function getProductFromLocalStorage() {
	const product = JSON.parse(localStorage.getItem('product'))
	const isValidProduct = validateProduct(product)
	return isValidProduct ? product : null
}

async function loadProductData() {
	const product = getProductFromURL() || getProductFromLocalStorage()

	// Loading illusion
	await delayMs(1000)

	const isValidProduct = validateProduct(product)
	if (!isValidProduct) return showError()

	renderProduct(product)
	showCart()
}

async function saveProduct() {}

async function doCheckout() {
	const customer = {
		name: document.getElementById('form-name').value,
		document: document.getElementById('form-document').value,
		email: document.getElementById('form-email').value,
	}
	if (!validateCustomer(customer)) return alert('Dados inválidos, por favor verifique os campos')
	if (!validatePayentMethod()) return alert('Selecione uma forma de pagamento')

	showLoading()

	const payload = {
		customer: customer,
		product: window.product,
	}
	const invoiceResult = await createInvoice(payload)
	if (!invoiceResult || !invoiceResult.success) return showError()

	const invoiceId = invoiceResult.data.invoiceId
	const linkResult = await createInvoiceLink(invoiceId, window.paymentMethod)
	if (!linkResult || !linkResult.success) return showError()

	document.location = linkResult.data.checkoutUrl
}

async function setPaymentMethod(button) {
	window.paymentMethod = button.dataset.method
	const allBtns = document.getElementsByClassName(`btn-payment-method`)
	for (let btn of allBtns) btn.classList.remove(`btn-success`)
	await delayMs(10)
	button.classList.add(`btn-success`)
}

function validatePayentMethod() {
	if (!['PIX', 'CREDIT_CARD'].includes(window.paymentMethod)) return false
	return true
}

function validateProduct(product) {
	if (product === null || product === undefined) return false
	if (!product.sku || !product.name || !product.price) return false
	if (isNaN(product.price)) return false
	if (product.price <= 0) return false
	if (product.name.length < 1) return false
	if (product.sku.length < 1) return false

	return true
}

function validateCustomer(customer) {
	console.log(customer)
	if (!customer.name || !customer.document || !customer.email) return false
	if (customer.name.length < 1) return false
	if (!/[a-zA-Z'\-]{1,}([ ][a-zA-Z'\-])+/.test(customer.name)) return false
	if (customer.document.length < 1) return false
	if (!validateCPF(customer.document)) return false
	if (customer.email.length < 1) return false
	if (!/[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/.test(customer.email)) return false

	return true
}

function renderProduct(product) {
	window.product = product

	const options = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 3 }
	const formatter = new Intl.NumberFormat('pt-BR', options)

	document.getElementById('prod-name').innerHTML = product.name
	document.getElementById('prod-price').innerHTML = formatter.format(product.price)
	document.getElementById('prod-total-price').innerHTML = formatter.format(product.price)
}

function showError() {
	document.getElementById(`loading`).classList.add('hidden')
	document.getElementById(`cart`).classList.add('hidden')
	document.getElementById(`error`).classList.remove('hidden')
}
function showLoading() {
	document.getElementById(`loading`).classList.remove('hidden')
	document.getElementById(`cart`).classList.add('hidden')
	document.getElementById(`error`).classList.add('hidden')
}
function showCart() {
	document.getElementById(`loading`).classList.add('hidden')
	document.getElementById(`cart`).classList.remove('hidden')
	document.getElementById(`error`).classList.add('hidden')
}
async function delayMs(time) {
	return new Promise((resolve) => setTimeout(resolve, time))
}

function validateCPF(strCPF) {
	var Soma
	var Resto
	Soma = 0
	if (strCPF == '00000000000') return false

	for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
	Resto = (Soma * 10) % 11

	if (Resto == 10 || Resto == 11) Resto = 0
	if (Resto != parseInt(strCPF.substring(9, 10))) return false

	Soma = 0
	for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
	Resto = (Soma * 10) % 11

	if (Resto == 10 || Resto == 11) Resto = 0
	if (Resto != parseInt(strCPF.substring(10, 11))) return false
	return true
}
