import { NextResponse } from 'next/server'
// import { verifyToken } from './lib/auth' // Giả sử bạn có hàm này để xác minh token

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')

    // Kiểm tra nếu đường dẫn bắt đầu bằng /admin và không phải /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!token) {
            // Nếu không có token, chuyển hướng đến trang đăng nhập
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
        
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
