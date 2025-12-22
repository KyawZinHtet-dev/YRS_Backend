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
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import TicketPricingForm from './ticket-pricing-form';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TicketPricing = {
    id: number;
    type: string;
    price: string;
    direction: string;
    offer_quantity: string;
    remain_quantity: string;
    started_at: string;
    ended_at: string;
    created_at: string;
    updated_at: string;
};

function ActionDroupdownMenu({ data }: { data: TicketPricing }) {
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
                                Edit ticket pricing
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <AlertDialogTrigger className="block w-full">
                            <DropdownMenuItem variant="destructive">Delete ticket pricing</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this ticket pricing and remove data from our servers.
                            <br />
                            <span className="mt-2 block font-bold">
                                Ticket Type: <span className="font-normal">{data.type}</span>
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => destroy(`ticket-pricings/${data.id}`)}
                            className={cn(buttonVariants({ variant: 'destructive' }))}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DialogContent className="md:max-w-[600px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Edit Ticket Pricing</DialogTitle>
                    <DialogDescription>Make changes ticket pricing here. Click update when you're done.</DialogDescription>
                </DialogHeader>
                {<TicketPricingForm ticket_pricings={data} mode="edit" setDialogOpen={setDialogOpen} />}
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

export const columns: ColumnDef<TicketPricing>[] = [
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader column={column} routePath="ticket-pricings.index" title="Type" />
                </div>
            );
        },
        cell: ({ row }) => {
            return (
                <div className={cn('ml-3 capitalize', row.original.type === 'one_time_ticket' ? 'text-primary' : 'text-amber-600')}>
                    {row.original.type.replaceAll('_', ' ')}
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Price" />
                </div>
            );
        },
        cell: ({ row }) => {
            const price = Number(row.original.price);
            const formattedCurrency = price.toLocaleString('my-MM', {
                style: 'currency',
                currency: 'MMK',
            });
            return <div className="text-center">{formattedCurrency}</div>;
        },
    },
    {
        accessorKey: 'direction',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Direction" />
                </div>
            );
        },
        cell: ({ row }) => {
            return (
                <div
                    className={cn(
                        'ml-3 capitalize',
                        row.original.direction === 'clockwise' && 'text-green-500',
                        row.original.direction === 'anticlockwise' && 'text-red-500',
                        row.original.direction === 'both' && 'text-amber-500',
                    )}
                >
                    {row.original.direction}
                </div>
            );
        },
    },
    {
        accessorKey: 'offer_quantity',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Offer Quantity" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.offer_quantity} Pcs</div>;
        },
    },
    {
        accessorKey: 'remain_quantity',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Remain Quantity" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.remain_quantity} Pcs</div>;
        },
    },
    {
        accessorKey: 'started_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Started At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{moment(row.original.started_at).format('DD/MM/YYYY hh:mm A')}</div>;
        },
    },
    {
        accessorKey: 'ended_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Ended At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{moment(row.original.ended_at).format('DD/MM/YYYY hh:mm A')}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Created At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{moment(row.original.created_at).format('DD/MM/YYYY hh:mm A')}</div>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="ticket-pricings.index" column={column} title="Updated At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center">{moment(row.original.updated_at).format('DD/MM/YYYY hh:mm A')}</div>;
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
