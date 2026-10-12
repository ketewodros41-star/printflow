import { NextRequest, NextResponse } from 'next/server'

/**
 * Generic webhook receiver for store integrations (Shopify, etc.)
 * Each store platform sends order notifications here.
 */
export async function POST(req: NextRequest) {
  try {
    const topic = req.headers.get('x-shopify-topic') ?? req.headers.get('x-webhook-topic')
    const body  = await req.json()

    console.log('[Webhook]', topic, JSON.stringify(body).slice(0, 200))

    if (!topic) {
      return NextResponse.json({ ok: true }) // silent accept
    }

    switch (topic) {
      case 'orders/create': {
        // New order received from Shopify / other store
        // TODO: create order in DB, trigger routing engine
        break
      }
      case 'orders/cancelled': {
        // Order cancelled in store
        // TODO: cancel matching order, notify provider
        break
      }
      case 'products/update': {
        // Product changed in store
        // TODO: sync variant pricing
        break
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[Webhook error]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
