import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withLoading = (WrappedComponent) => {
    return (props) => {
        const [isLoading, setIsLoading] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const handleStart = () => setIsLoading(true);
            const handleComplete = () => setIsLoading(false);

            const routerEvents = router.events;
            if (routerEvents) {
                routerEvents.on('routeChangeStart', handleStart);
                routerEvents.on('routeChangeComplete', handleComplete);
                routerEvents.on('routeChangeError', handleComplete);

                return () => {
                    routerEvents.off('routeChangeStart', handleStart);
                    routerEvents.off('routeChangeComplete', handleComplete);
                    routerEvents.off('routeChangeError', handleComplete);
                };
            }
        }, [router]);

        if (isLoading) {
            return <Loading />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withLoading;