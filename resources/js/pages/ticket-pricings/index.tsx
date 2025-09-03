import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TicketPricing, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ticket Pricings',
        href: '/ticket-pricings',
    },
];

interface TicketPricingPagination {
    data: TicketPricing[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const TicketPricingsIndex = ({ ticket_pricings }: { ticket_pricings: TicketPricingPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket Pricings" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={ticket_pricings.data}
                        next_page_url={ticket_pricings.next_page_url}
                        prev_page_url={ticket_pricings.prev_page_url}
                        first_page_url={ticket_pricings.first_page_url}
                        last_page_url={ticket_pricings.last_page_url}
                        current_page={ticket_pricings.current_page}
                        last_page={ticket_pricings.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default TicketPricingsIndex;
