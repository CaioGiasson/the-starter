function createLink() {
	const product = {
		sku: document.getElementById('productSKU').value,
		description: document.getElementById('productDescription').value,
		price: document.getElementById('productPrice').value,
	}

	const validationErrors = []

	if (product.sku.length < 1) validationErrors.push('É necessário adicionar um SKU')
	if (product.description.length < 1) validationErrors.push('É necessário fornecer uma descriçào (ou título)')
	if (product.price <= 0) validationErrors.push('É necessário fornecer um valor para o produto')

	if (validationErrors.length > 0) return alert(`ATENÇÃO: \n\n${validationErrors.join(`\n`)}`)

	const baseUrl = `https://the-starter.koud.dev/checkout/?`,
		fullUrl = baseUrl + `sku=` + product.sku + `&product=` + product.description + `&price=` + product.price,
		encodedUrl = encodeURI(fullUrl),
		resultHtml = `
			<div classe="col col-12 text-center">
				  <div class="form-group">
    				<input type="text" class="form-control" value="${encodedUrl}" id="link-input">
  				</div>
			</div>
			<div class="col col-12 text-center py-3">
				Link copiado para a área de transferência e pronto para ser utilizado em botões nas páginas do WebFlow
			</div>
			<div class="col col-12 text-center">
				<a class="btn btn-success" target="_blank" href="${encodedUrl}">Acessar link</a>
			</div>
		`

	document.getElementById(`linkGerado`).innerHTML = resultHtml

	setTimeout(function () {
		const input = document.getElementById('link-input')
		input.select()
		input.setSelectionRange(0, 99999)
		navigator.clipboard.writeText(input.value)
	}, 500)
}
