import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Station, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stations',
        href: '/stations',
    },
];

interface StationPagination {
    data: Station[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const StationsIndex = ({ stations }: { stations: StationPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stations" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={stations.data}
                        next_page_url={stations.next_page_url}
                        prev_page_url={stations.prev_page_url}
                        first_page_url={stations.first_page_url}
                        last_page_url={stations.last_page_url}
                        current_page={stations.current_page}
                        last_page={stations.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default StationsIndex;
