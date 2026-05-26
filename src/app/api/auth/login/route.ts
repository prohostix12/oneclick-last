import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Verify fixed credentials
        if (normalizedEmail === 'admin@gmail.com' && password === 'password123456') {
            return NextResponse.json({
                success: true,
                user: {
                    email: 'admin@gmail.com',
                    name: 'Admin'
                }
            });
        }

        return NextResponse.json(
            { error: 'Invalid administrative credentials. Access denied.' },
            { status: 401 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
