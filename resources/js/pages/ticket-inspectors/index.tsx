import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TicketInspector, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ticket Inspectors',
        href: '/ticket-inspectors',
    },
];

interface TicketInspectorPagination {
    data: TicketInspector[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const TicketInspectorsIndex = ({ ticket_inspectors }: { ticket_inspectors: TicketInspectorPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket Inspectors" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={ticket_inspectors.data}
                        next_page_url={ticket_inspectors.next_page_url}
                        prev_page_url={ticket_inspectors.prev_page_url}
                        first_page_url={ticket_inspectors.first_page_url}
                        last_page_url={ticket_inspectors.last_page_url}
                        current_page={ticket_inspectors.current_page}
                        last_page={ticket_inspectors.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default TicketInspectorsIndex;
