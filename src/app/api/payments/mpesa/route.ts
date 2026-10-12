import { NextRequest, NextResponse } from 'next/server'
import { initiateMpesaSTKPush, normalizeMpesaPhone } from '@/lib/payments/mpesa'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, amount, orderRef, description } = body

    if (!phone || !amount || !orderRef) {
      return NextResponse.json({ error: 'phone, amount and orderRef are required' }, { status: 400 })
    }

    const baseUrl     = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/api/payments/mpesa/callback`

    const result = await initiateMpesaSTKPush({
      phone:        normalizeMpesaPhone(phone),
      amount:       Math.ceil(amount),
      accountRef:   orderRef,
      description:  description ?? `PrintFlow order ${orderRef}`,
      callbackUrl,
    })

    return NextResponse.json({
      checkoutRequestId: result.CheckoutRequestID,
      merchantRequestId: result.MerchantRequestID,
      responseCode:      result.ResponseCode,
      customerMessage:   result.CustomerMessage,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** M-Pesa STK callback */
export async function PUT(req: NextRequest) {
  // Safaricom posts JSON to this URL on payment completion
  const data = await req.json()
  const stkCallback = data?.Body?.stkCallback

  if (!stkCallback) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid callback' })
  }

  const { ResultCode, CheckoutRequestID } = stkCallback

  if (ResultCode === 0) {
    // Payment successful — update order status in DB
    // TODO: find order by CheckoutRequestID, mark as PAID
    console.log('[M-Pesa] Payment confirmed:', CheckoutRequestID)
  } else {
    // Payment failed
    console.warn('[M-Pesa] Payment failed:', stkCallback.ResultDesc)
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
}
