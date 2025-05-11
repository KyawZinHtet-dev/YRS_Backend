import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AdminUsers, columns } from './columns';
import { DataTable } from './datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Users',
        href: '/admin-users',
    },
];

const AdminUsersIndex = ({ admin_users }: { admin_users: AdminUsers[] }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Users" />
            <div className="relative h-full">
                <div className="absolute size-full overflow-x-hidden p-4">
                    <DataTable columns={columns} data={admin_users} />
                </div>
            </div>
        </AppLayout>
    );
};

export default AdminUsersIndex;
