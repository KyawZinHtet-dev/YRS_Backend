import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/datatable/column-header';
import moment from 'moment';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Wallet = {
    id: number;
    user_id: number;
    balance: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<Wallet>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="wallets.index" column={column} title="User Name" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 ml-3">{row.original.name}</div>;
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="wallets.index" column={column} title="User Email" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5">{row.original.email}</div>;
        },
    },
    {
        accessorKey: 'balance',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="wallets.index" column={column} title="Balance" />
                </div>
            );
        },
        cell: ({ row }) => {
            const balance = row.original.balance;
            const formattedCurrency = balance.toLocaleString('my-MM', {
                style: 'currency',
                currency: 'MMK',
            });
            return <div className="my-1.5">{formattedCurrency}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="wallets.index" column={column} title="Created At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 text-center">{moment(row.original.created_at).format('DD/MM/YYYY hh:mm A')}</div>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="wallets.index" column={column} title="Updated At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 text-center">{moment(row.original.updated_at).format('DD/MM/YYYY hh:mm A')}</div>;
        },
    },
];
