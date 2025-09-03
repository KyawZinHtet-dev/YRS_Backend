import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, Wallet } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallets',
        href: '/wallets',
    },
];

interface WalletPaginagion {
    data: Wallet[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const WalletsIndex = ({ wallets }: { wallets: WalletPaginagion }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wallets" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={wallets.data}
                        wallets={wallets.data}
                        next_page_url={wallets.next_page_url}
                        prev_page_url={wallets.prev_page_url}
                        first_page_url={wallets.first_page_url}
                        last_page_url={wallets.last_page_url}
                        current_page={wallets.current_page}
                        last_page={wallets.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsIndex;
