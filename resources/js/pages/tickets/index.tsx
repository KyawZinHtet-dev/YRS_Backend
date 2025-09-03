import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, Ticket } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Top Up History',
        href: '/top-up-history',
    },
];

interface TicketPagination {
    data: Ticket[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const TopUpHistoriesIndex = ({ tickets }: { tickets: TicketPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Top Up History" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={tickets.data}
                        next_page_url={tickets.next_page_url}
                        prev_page_url={tickets.prev_page_url}
                        first_page_url={tickets.first_page_url}
                        last_page_url={tickets.last_page_url}
                        current_page={tickets.current_page}
                        last_page={tickets.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default TopUpHistoriesIndex;
