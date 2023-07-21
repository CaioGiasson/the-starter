export enum InvoiceStatus {
	PENDING = 'PENDING',
	REQUESTED = 'REQUESTED',
	PAID = 'PAID',
	CANCELLED = 'CANCELLED',
	EXPIRED = 'EXPIRED',
}

export enum InvoiceStatusTexts {
	PENDING = 'Aguardando definição de pagamento',
	REQUESTED = 'Aguardando pagamento',
	PAID = 'Paga',
	CANCELLED = 'Cancelada',
	EXPIRED = 'Expirada',
}
