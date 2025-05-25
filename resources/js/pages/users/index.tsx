import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { User, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface UserPagination {
    data: User[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const UsersIndex = ({ users }: { users: UserPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={users.data}
                        next_page_url={users.next_page_url}
                        prev_page_url={users.prev_page_url}
                        first_page_url={users.first_page_url}
                        last_page_url={users.last_page_url}
                        current_page={users.current_page}
                        last_page={users.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default UsersIndex;
