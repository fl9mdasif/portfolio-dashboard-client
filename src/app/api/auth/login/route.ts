
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // --- MOCK USER VALIDATION ---
    // In a real application, you would fetch the user from DynamoDB
    // and use a library like 'bcrypt' to compare the hashed password.
    if (email !== 'admin@portfolio.com' || password !== 'password') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // --- JWT CREATION ---
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const alg = 'HS256';

    const jwt = await new SignJWT({ email, role: 'admin' })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('2h') // Token expires in 2 hours
      .sign(secret);

    // --- SET SECURE COOKIE ---
    (await
          // --- SET SECURE COOKIE ---
          cookies()).set({
      name: 'session',
      value: jwt,
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/', // The cookie is available for all paths
      sameSite: 'strict', // Helps prevent CSRF attacks
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}