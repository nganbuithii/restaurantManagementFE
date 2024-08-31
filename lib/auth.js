import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function withAuth(WrappedComponent) {
    return function AuthComponent(props) {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/admin/login');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    }
}