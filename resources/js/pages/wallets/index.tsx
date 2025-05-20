import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, Wallets } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallets',
        href: '/wallets',
    },
];

const WalletsIndex = ({ wallets }: { wallets: Wallets[] }) => {
    // const formattedData = wallets.map((wallet) => ({
    //     ...wallet,
    //     user_name: wallet.user.name,
    //     user_email: wallet.user.email,
    // }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wallets" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable columns={columns} data={wallets} />
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsIndex;
