import { NextRequest, NextResponse } from 'next/server'
import { initiateChapaPayment, buildChapaRequest } from '@/lib/payments/chapa'
import { generateOrderNumber } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, email, firstName, lastName, phone, orderNumber } = body

    if (!amount || !email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const txRef = `PF-${uuidv4().replace(/-/g, '').slice(0, 12).toUpperCase()}`
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const request = buildChapaRequest({
      amount,
      email,
      firstName,
      lastName,
      phone,
      txRef,
      orderNumber: orderNumber ?? generateOrderNumber(),
      baseUrl,
    })

    const response = await initiateChapaPayment(request)

    if (response.status !== 'success' || !response.data?.checkout_url) {
      return NextResponse.json(
        { error: 'Failed to initialize Chapa payment', details: response.message },
        { status: 502 }
      )
    }

    return NextResponse.json({
      checkoutUrl: response.data.checkout_url,
      txRef,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** Chapa webhook handler */
export async function GET(req: NextRequest) {
  // Chapa redirects here after payment with ?tx_ref=...&status=...
  const txRef  = req.nextUrl.searchParams.get('tx_ref')
  const status = req.nextUrl.searchParams.get('status')

  if (status === 'success' && txRef) {
    // TODO: verify transaction, mark order as paid in DB
    return NextResponse.redirect(new URL(`/store/checkout/success?ref=${txRef}`, req.url))
  }

  return NextResponse.redirect(new URL(`/store/checkout?error=payment_failed`, req.url))
}
