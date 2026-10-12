/**
 * Safaricom M-Pesa (Daraja API) Integration
 * Docs: https://developer.safaricom.co.ke/APIs
 *
 * Supports STK Push for mobile payments.
 * Note: For Ethiopia, use the Safaricom Ethiopia integration.
 */

const DARAJA_BASE = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.et'
  : 'https://sandbox.safaricom.et'

const CONSUMER_KEY    = process.env.MPESA_CONSUMER_KEY!
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!
const SHORT_CODE      = process.env.MPESA_SHORT_CODE!
const PASSKEY         = process.env.MPESA_PASSKEY!

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')

  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  })

  if (!res.ok) throw new Error(`M-Pesa auth error ${res.status}`)
  const { access_token } = await res.json()
  return access_token
}

function getTimestamp(): string {
  const now = new Date()
  return now.toISOString().replace(/[^0-9]/g, '').slice(0, 14)
}

function getPassword(timestamp: string): string {
  const raw = `${SHORT_CODE}${PASSKEY}${timestamp}`
  return Buffer.from(raw).toString('base64')
}

export async function initiateMpesaSTKPush(params: {
  phone: string       // format: 2519XXXXXXXX
  amount: number
  accountRef: string
  description: string
  callbackUrl: string
}) {
  const token = await getAccessToken()
  const timestamp = getTimestamp()

  const body = {
    BusinessShortCode: SHORT_CODE,
    Password: getPassword(timestamp),
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(params.amount),
    PartyA: params.phone,
    PartyB: SHORT_CODE,
    PhoneNumber: params.phone,
    CallBackURL: params.callbackUrl,
    AccountReference: params.accountRef,
    TransactionDesc: params.description,
  }

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`M-Pesa STK error ${res.status}: ${err}`)
  }

  return res.json()
}

export async function checkMpesaTransaction(checkoutRequestId: string) {
  const token = await getAccessToken()
  const timestamp = getTimestamp()

  const body = {
    BusinessShortCode: SHORT_CODE,
    Password: getPassword(timestamp),
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  }

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`M-Pesa query error ${res.status}`)
  return res.json()
}

/** Format Ethiopian phone number to Daraja format */
export function normalizeMpesaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) return `251${digits.slice(1)}`
  if (digits.startsWith('251')) return digits
  return `251${digits}`
}
