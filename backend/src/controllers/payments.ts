import { Request, Response } from 'express';
import { createPaymentIntent, getPaymentIntent } from '../services/stripe.js';
import { z } from 'zod';

const CreatePaymentIntentSchema = z.object({
  amount: z.number().positive().max(100000),
  currency: z.string().default('usd'),
});

/**
 * POST /api/payments/create-intent - Create a Stripe payment intent
 */
export async function createIntent(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const input = CreatePaymentIntentSchema.parse(req.body);

    const paymentIntent = await createPaymentIntent(input.amount, input.currency, {
      userId,
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: error,
      });
      return;
    }

    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error && error.message.includes('not configured')
        ? 'Payment processing is not configured'
        : 'Failed to create payment intent',
    });
  }
}

/**
 * GET /api/payments/intent/:id - Get payment intent status
 */
export async function getIntentStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const paymentIntent = await getPaymentIntent(id);

    if (!paymentIntent) {
      res.status(404).json({
        success: false,
        message: 'Payment intent not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
      },
    });
  } catch (error) {
    console.error('Get payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment intent',
    });
  }
}

