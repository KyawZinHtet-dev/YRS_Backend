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

const TicketInspectorsIndex = ({ ticket_inspectors }: { ticket_inspectors: TicketInspector[] }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket Inspectors" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable columns={columns} data={ticket_inspectors} />
                </div>
            </div>
        </AppLayout>
    );
};

export default TicketInspectorsIndex;
