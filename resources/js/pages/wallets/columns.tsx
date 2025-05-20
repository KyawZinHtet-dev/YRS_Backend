'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/datatable/column-header';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Wallets = {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    balance: number;
    user: { name: string; email: string };
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<Wallets>[] = [
    {
        accessorKey: 'no',
        header: () => <div className="text-center">No.</div>,
        cell: ({ row }) => {
            let id = row.index;
            return <div className="text-center">{++id}</div>;
        },
    },
    {
        accessorKey: 'user.name',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Name" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.user.name}</div>;
        },
    },
    {
        accessorKey: 'user.email',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Email" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.user.email}</div>;
        },
    },
    {
        accessorKey: 'balance',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Balance" />
                </div>
            );
        },
        cell: ({ row }) => {
            const balance = row.original.balance;
            const formattedCurrency = balance.toLocaleString('my-MM', {
                style: 'currency',
                currency: 'MMK',
            });
            return <div className="text-center">{formattedCurrency}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Created At" />
                </div>
            );
        },
        cell: ({ row }) => {
            const created_at = row.original.created_at;
            const date = new Date(created_at);
            return <div className="text-center">{date.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Updated At" />
                </div>
            );
        },
        cell: ({ row }) => {
            const updated_at = row.original.updated_at;
            const date = new Date(updated_at);
            return <div className="text-center">{date.toLocaleString()}</div>;
        },
    },
];
