import { Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { UpdateUserSchema } from '../models/schemas.js';

/**
 * GET /api/users/me - Get current user profile
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const userEmail = req.userEmail;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Get or create user profile
    let { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (error || !user) {
      // Create user profile if doesn't exist
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_id: userId,
          email: userEmail || '',
          name: '',
        })
        .select('*')
        .single();

      if (createError) {
        console.error('Create user error:', createError);
        res.status(500).json({
          success: false,
          message: 'Failed to create user profile',
        });
        return;
      }
      user = newUser;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        shippingAddress: user.shipping_address,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * PUT /api/users/me - Update current user profile
 */
export async function updateMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const input = UpdateUserSchema.parse(req.body);

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.shippingAddress !== undefined) {
      updateData.shipping_address = input.shippingAddress;
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('clerk_id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        shippingAddress: user.shipping_address,
        updatedAt: user.updated_at,
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

    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

