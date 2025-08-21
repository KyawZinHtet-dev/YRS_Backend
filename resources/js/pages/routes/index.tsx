import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Route, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Routes',
        href: '/routes',
    },
];

interface RoutePagination {
    data: Route[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const RoutesIndex = ({ routes }: { routes: RoutePagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Routes" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={routes.data}
                        next_page_url={routes.next_page_url}
                        prev_page_url={routes.prev_page_url}
                        first_page_url={routes.first_page_url}
                        last_page_url={routes.last_page_url}
                        current_page={routes.current_page}
                        last_page={routes.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default RoutesIndex;
