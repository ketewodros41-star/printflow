/**
 * Chapa Payment Integration
 * Docs: https://developer.chapa.co/docs
 *
 * Used for ETB payments. Chapa is the primary gateway for PrintFlow.
 */

import type { ChapaPaymentRequest, ChapaPaymentResponse } from '@/types'

const CHAPA_BASE = 'https://api.chapa.co/v1'
const SECRET_KEY = process.env.CHAPA_SECRET_KEY!

export async function initiateChapaPayment(
  payload: ChapaPaymentRequest
): Promise<ChapaPaymentResponse> {
  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Chapa error ${res.status}: ${err}`)
  }

  return res.json() as Promise<ChapaPaymentResponse>
}

export async function verifyChapaTransaction(txRef: string) {
  const res = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
  })

  if (!res.ok) throw new Error(`Chapa verify error ${res.status}`)
  return res.json()
}

/**
 * Build a Chapa payment request from an order.
 */
export function buildChapaRequest(params: {
  amount: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  txRef: string
  orderNumber: string
  baseUrl: string
}): ChapaPaymentRequest {
  return {
    amount: params.amount,
    currency: 'ETB',
    email: params.email,
    first_name: params.firstName,
    last_name: params.lastName,
    phone_number: params.phone,
    tx_ref: params.txRef,
    callback_url: `${params.baseUrl}/api/payments/chapa/webhook`,
    return_url: `${params.baseUrl}/store/checkout/success?ref=${params.txRef}`,
    customization: {
      title: 'PrintFlow Order',
      description: `Payment for order ${params.orderNumber}`,
      logo: `${params.baseUrl}/logo.png`,
    },
  }
}
