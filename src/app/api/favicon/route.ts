import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const faviconPath = join(process.cwd(), 'public', 'favicon.ico');
    const faviconBuffer = await readFile(faviconPath);
    
    return new NextResponse(faviconBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    // Fallback: return a simple SVG favicon
    const fallbackSvg = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <rect width="16" height="16" rx="4" fill="#7C3AED"/>
      <text x="8" y="12" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="white">O</text>
    </svg>`;
    
    return new NextResponse(fallbackSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }
}