import AuthLayoutTemplate from '@/layouts/auth/auth-card-layout';
import RootLayout from './root-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <RootLayout>
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </RootLayout>
    );
}
