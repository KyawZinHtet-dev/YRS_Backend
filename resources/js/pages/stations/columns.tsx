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
import { axios } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import StationForm from './station-form';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Station = {
    id: number;
    title: string;
    description: string;
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
};

function ActionDroupdownMenu({ data }: { data: Station }) {
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
                                Edit station
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <AlertDialogTrigger className="block w-full">
                            <DropdownMenuItem variant="destructive">Delete station</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this station and remove data from our servers.
                            <br />
                            <span className="mt-2 block font-bold">
                                Station: <span className="font-normal">{data.title}</span>
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                destroy(`stations/${data.id}`);
                                axios.storage?.clear?.();
                            }}
                            className={cn(buttonVariants({ variant: 'destructive' }))}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DialogContent className="md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Edit Station</DialogTitle>
                    <DialogDescription>Make changes station here. Click update when you're done.</DialogDescription>
                </DialogHeader>
                <StationForm mode="edit" station={data} setDialogOpen={setDialogOpen} />
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

export const columns: ColumnDef<Station>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="stations.index" column={column} title="Station" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="ml-3">{row.original.title}</div>;
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="stations.index" column={column} title="Description" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="ml-3">{row.original.description.substring(0, 50) + ' ...'}</div>;
        },
    },
    {
        accessorKey: 'Location',
        header: () => <div className="text-center">Location (Lat,Long)</div>,
        cell: ({ row }) => {
            return <div className="text-center">{`${row.original.latitude},${row.original.longitude}`}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="stations.index" column={column} title="Created At" />
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
                    <DataTableColumnHeader routePath="stations.index" column={column} title="Updated At" />
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
