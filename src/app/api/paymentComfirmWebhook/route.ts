import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface LemonSqueezyWebhookPayload {
    meta: {
        event_name: string;
        custom_data?: {
            "serialized_custom_data": string
        };
    };
    data: {
        attributes: {
            status: string;
        };
    };
}

function verifyWebhookSignature(
    payload: string,
    signature: string | null,
    secret: string
): boolean {
    if (!signature) return false;

    const hmac = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    console.log(hmac);
    console.log(signature);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(hmac)
    );
}

export async function POST(request: Request) {
    try {
        const payload = await request.text();
        const signature = request.headers.get('X-Signature');
        // console.log(signature);

        // Verify webhook signature
        const isValid = verifyWebhookSignature(
            payload,
            signature,
            process.env.LEMON_SQUEEZY_WEBHOOK_SECRET_KEY || ''
        );


        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid webhook signature' },
                { status: 401 }
            );
        }

        const data: LemonSqueezyWebhookPayload = JSON.parse(payload);

        // Verify this is a successful payment event
        if (data.meta.event_name !== 'order_created' ||
            data.data.attributes.status !== 'paid') {
            return NextResponse.json(
                { error: 'Invalid webhook event' },
                { status: 400 }
            );
        }


        const serializedCustomData = data.meta.custom_data?.serialized_custom_data;
        if(serializedCustomData == undefined) {
            return NextResponse.json(
                { error: 'Custom payload passed is empty' },
                { status: 400 }
            );
        }
        const squareId = JSON.parse(serializedCustomData).squareId;

        if (!squareId) {
            return NextResponse.json(
                { error: 'No square ID provided in custom data' },
                { status: 400 }
            );
        }

        // Update the square's isPurchased status
        await prisma.square.update({
            where: {
                id: squareId
            },
            data: {
                isPurchased: true
            }
        });

        return NextResponse.json({
            message: 'Square purchase status updated successfully',
            squareId: squareId
        });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}