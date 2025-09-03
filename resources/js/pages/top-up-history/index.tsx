import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, TopUpHistory } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Top Up History',
        href: '/top-up-history',
    },
];

interface TopUpHistoryPagination {
    data: TopUpHistory[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const TopUpHistoriesIndex = ({ top_up_histories }: { top_up_histories: TopUpHistoryPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Top Up History" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={top_up_histories.data}
                        next_page_url={top_up_histories.next_page_url}
                        prev_page_url={top_up_histories.prev_page_url}
                        first_page_url={top_up_histories.first_page_url}
                        last_page_url={top_up_histories.last_page_url}
                        current_page={top_up_histories.current_page}
                        last_page={top_up_histories.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default TopUpHistoriesIndex;
