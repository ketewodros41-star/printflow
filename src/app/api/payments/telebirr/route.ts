import { NextRequest, NextResponse } from 'next/server'
import { initiateTelebirrPayment, verifyTelebirrWebhook } from '@/lib/payments/telebirr'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, orderRef, subject } = body

    if (!amount || !orderRef) {
      return NextResponse.json({ error: 'amount and orderRef are required' }, { status: 400 })
    }

    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const notifyUrl = `${baseUrl}/api/payments/telebirr/callback`
    const returnUrl = `${baseUrl}/store/checkout/success?ref=${orderRef}`

    const result = await initiateTelebirrPayment({
      amount,
      orderRef,
      subject:        subject ?? `PrintFlow Order ${orderRef}`,
      notifyUrl,
      returnUrl,
      timeoutMinutes: 30,
    })

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** Telebirr payment notification callback */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { sign, ...rest } = body

    const valid = verifyTelebirrWebhook(rest, sign)
    if (!valid) {
      return NextResponse.json({ code: '0001', msg: 'Invalid signature' }, { status: 401 })
    }

    const { trade_status, out_trade_no } = rest

    if (trade_status === 'SUCCESS') {
      // TODO: mark order as PAID in DB
      console.log('[Telebirr] Payment confirmed:', out_trade_no)
    }

    return NextResponse.json({ code: '0000', msg: 'OK' })
  } catch (err: unknown) {
    console.error('[Telebirr callback error]', err)
    return NextResponse.json({ code: '0001', msg: 'Error' }, { status: 500 })
  }
}
