import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/datatable/column-header';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import UserForm from './user-form';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
};

function ActionDroupdownMenu({ data }: { data: User }) {
    const { delete: destroy, processing } = useForm();
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DialogTrigger className="block w-full">
                            <DropdownMenuItem className="text-amber-700 focus:bg-amber-700/10 focus:text-amber-700 dark:focus:bg-amber-700/20">
                                Edit user
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <AlertDialogTrigger className="block w-full">
                            <DropdownMenuItem variant="destructive">Delete user</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this account and remove data from our servers.
                            <br />
                            <span className="mt-2 block font-bold">
                                Name: <span className="font-normal">{data.name}</span>
                            </span>
                            <span className="mt-1 block font-semibold">
                                Email: <span className="font-normal">{data.email}</span>
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => destroy(`users/${data.id}`)} className={cn(buttonVariants({ variant: 'destructive' }))}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Make changes user here. Click update when you're done.</DialogDescription>
                </DialogHeader>
                <UserForm user={data} mode="edit" setDialogOpen={setDialogOpen} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="w-full" variant={'outline'}>
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="users.index" column={column} title="Name" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="ml-3">{row.original.name}</div>;
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="users.index" column={column} title="Email" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div>{row.original.email}</div>;
        },
    },
    {
        accessorKey: 'email_verified_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="users.index" column={column} title="Verified At" />
                </div>
            );
        },
        cell: ({ row }) => {
            if (row.original.email_verified_at) {
                const email_verified_at = row.original.email_verified_at;
                const date = new Date(email_verified_at);
                return <div className="text-center">{date.toLocaleString()}</div>;
            }
            return (
                <div className="text-center">
                    <Badge className="bg-amber-600">Not Verify</Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="users.index" column={column} title="Created At" />
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
                    <DataTableColumnHeader routePath="users.index" column={column} title="Updated At" />
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
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <ActionDroupdownMenu data={row.original} />
                </div>
            );
        },
    },
];
