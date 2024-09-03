// hoc/withAuth.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const user = useSelector((state) => state.auth.user);
        const token = useSelector((state) => state.auth.token);
        const router = useRouter();

        useEffect(() => {
            if (!user && !token) {
                router.push('/admin/login');
            }
        }, [user, token, router]);

        if (!user && !token) {
            return null; // Hoặc một loader
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
