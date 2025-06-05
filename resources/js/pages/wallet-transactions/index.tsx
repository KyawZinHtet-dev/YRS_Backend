import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, WalletTransaction } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/wallet-transactions',
    },
];

interface WalletTransactionPagination {
    data: WalletTransaction[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const WalletTransactionsIndex = ({ wallet_transactions }: { wallet_transactions: WalletTransactionPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={wallet_transactions.data}
                        next_page_url={wallet_transactions.next_page_url}
                        prev_page_url={wallet_transactions.prev_page_url}
                        first_page_url={wallet_transactions.first_page_url}
                        last_page_url={wallet_transactions.last_page_url}
                        current_page={wallet_transactions.current_page}
                        last_page={wallet_transactions.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletTransactionsIndex;
