'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/datatable/column-header';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AdminUsers = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
};

function ActionDroupdownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className="text-orange-800 focus:bg-orange-800/10 focus:text-orange-800 dark:focus:bg-orange-800/20">
                    Edit admin user
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Delete admin user</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<AdminUsers>[] = [
    {
        accessorKey: 'no',
        header: () => <div className="text-center">No.</div>,
        cell: ({ row }) => {
            let id = row.index;
            return <div className="text-center">{++id}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Name" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.name}</div>;
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader column={column} title="Email" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.email}</div>;
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
    {
        accessorKey: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: () => {
            return (
                <div className="text-center">
                    <ActionDroupdownMenu />
                </div>
            );
        },
    },
];
