import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AdminUser, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Users',
        href: '/admin-users',
    },
];

interface AdminUserPagination {
    data: AdminUser[];
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    next_page_url?: string | null | undefined;
    prev_page_url?: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

const AdminUsersIndex = ({ admin_users }: { admin_users: AdminUserPagination }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Users" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={admin_users.data}
                        next_page_url={admin_users.next_page_url}
                        prev_page_url={admin_users.prev_page_url}
                        first_page_url={admin_users.first_page_url}
                        last_page_url={admin_users.last_page_url}
                        current_page={admin_users.current_page}
                        last_page={admin_users.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default AdminUsersIndex;
