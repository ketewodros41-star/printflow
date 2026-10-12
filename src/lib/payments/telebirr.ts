/**
 * Telebirr Payment Integration
 * Docs: https://developer.ethiotelecom.et
 *
 * Telebirr is Ethiopian Telecom's mobile money platform.
 * Uses HMAC-SHA256 signature scheme.
 */

import crypto from 'crypto'
import type { TelebirrPaymentRequest } from '@/types'

const BASE_URL    = 'https://app.ethiotelecom.et/tomsm/payment/v1/initPayment'
const APP_ID      = process.env.TELEBIRR_APP_ID!
const APP_KEY     = process.env.TELEBIRR_APP_KEY!
const MERCH_CODE  = process.env.TELEBIRR_MERCH_CODE!
const PUBLIC_KEY  = process.env.TELEBIRR_PUBLIC_KEY!  // RSA public key from Telebirr

/** Generate nonce string */
function nonce(length = 16): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length)
}

/** Build sorted query string for signing */
function buildSignString(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
}

/** HMAC-SHA256 signature */
function sign(params: Record<string, string>): string {
  const str = buildSignString(params)
  return crypto.createHmac('sha256', APP_KEY).update(str).digest('hex').toUpperCase()
}

/** Encrypt with Telebirr RSA public key */
function encryptPayload(plain: string): string {
  const keyBuffer = Buffer.from(PUBLIC_KEY, 'base64')
  const encrypted = crypto.publicEncrypt(
    { key: keyBuffer, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(plain)
  )
  return encrypted.toString('base64')
}

export async function initiateTelebirrPayment(params: {
  amount: number
  orderRef: string
  subject: string
  notifyUrl: string
  returnUrl: string
  timeoutMinutes?: number
}) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonceStr  = nonce()
  const timeoutExpress = `${params.timeoutMinutes ?? 30}m`

  const signParams: Record<string, string> = {
    appid:           APP_ID,
    merch_code:      MERCH_CODE,
    nonce_str:       nonceStr,
    notify_url:      params.notifyUrl,
    out_trade_no:    params.orderRef,
    total_amount:    params.amount.toFixed(2),
    trans_currency:  'ETB',
    subject:         params.subject,
    timeout_express: timeoutExpress,
    timestamp,
  }

  const signature = sign(signParams)

  const payload: TelebirrPaymentRequest = {
    appid:           APP_ID,
    merch_code:      MERCH_CODE,
    nonce_str:       nonceStr,
    notify_url:      params.notifyUrl,
    out_trade_no:    params.orderRef,
    total_amount:    params.amount.toFixed(2),
    trans_currency:  'ETB',
    subject:         params.subject,
    timeout_express: timeoutExpress,
    timestamp,
    sign:            signature,
  }

  // Telebirr requires the ussd_push_info object encrypted
  const encryptedPayload = encryptPayload(JSON.stringify({
    ...payload,
    return_url: params.returnUrl,
  }))

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-APP-Key': APP_KEY,
    },
    body: JSON.stringify({
      appid: APP_ID,
      sign: signature,
      ussd_push_info: encryptedPayload,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telebirr error ${res.status}: ${err}`)
  }

  return res.json()
}

export function verifyTelebirrWebhook(
  body: Record<string, string>,
  receivedSign: string
): boolean {
  const { sign: _s, ...rest } = body
  void _s
  const computed = sign(rest)
  return computed === receivedSign
}
