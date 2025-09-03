import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { response } = usePage<SharedData>().props;
    useEffect(() => {
        if (response) {
            if (response.status === 'success') {
                toast.success(response.message, { description: response.description });
            } else {
                toast.error(response.message, { description: response.description });
            }
        }
    }, [response]);
    return (
        <>
            <Toaster richColors expand={true} position="top-right" />
            {children}
        </>
    );
}
