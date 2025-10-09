import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/datatable/column-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = {
    id: number;
    ticket_number: string;
    type: string;
    direction: string;
    user_email: string;
    price: number;
    valid_at: string;
    expired_at: string;
    created_at: string;
    updated_at: string;
};

const ViewDetailDialog = ({ data }: { data: Ticket }) => {
    return (
        <Dialog key={data.id}>
            <DialogTrigger asChild>
                <Button className="ml-4" variant={'outline'} size={'sm'}>
                    Details
                </Button>
            </DialogTrigger>
            <DialogContent className="w-11/12">
                <DialogHeader>
                    <DialogTitle className="text-center">Ticket Details</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-between gap-5">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Ticket Number:</p>
                        <p className="text-sm"> {data.ticket_number}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">User Email:</p>
                        <p className="text-sm"> {data.user_email}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Type</p>
                        <p className={cn('text-sm capitalize', data.type === 'one_time_ticket' ? 'text-sky-600' : 'text-amber-600')}>
                            {' '}
                            {data.type.replaceAll('_', ' ')}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Direction</p>
                        <p className={cn('text-sm capitalize', data.direction === 'clockwise' ? 'text-green-500' : 'text-red-500')}>
                            {' '}
                            {data.direction}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Price</p>
                        <p className="text-sm">
                            {' '}
                            {Number(data.price).toLocaleString('my-MM', {
                                style: 'currency',
                                currency: 'MMK',
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Valid At</p>
                        <p className="text-sm"> {new Date(data.valid_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Expired At</p>
                        <p className="text-sm"> {new Date(data.expired_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Created At:</p>
                        <p className="text-sm"> {new Date(data.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Updated At:</p>
                        <p className="text-sm"> {new Date(data.updated_at).toLocaleString()}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: 'ticket_number',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="Ticket No." />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 ml-3">{row.original.ticket_number}</div>;
        },
    },
    {
        accessorKey: 'user_email',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="User Email" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 ml-3">{row.original.user_email}</div>;
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="Type" />
                </div>
            );
        },
        cell: ({ row }) => {
            return (
                <div className={cn('my-1.5 ml-3 capitalize', row.original.type === 'one_time_ticket' ? 'text-primary' : 'text-amber-600')}>
                    {row.original.type.replaceAll('_', ' ')}
                </div>
            );
        },
    },
    {
        accessorKey: 'direction',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="Direction" />
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
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="Price" />
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = row.original.price;
            const formattedCurrency = amount.toLocaleString('my-MM', {
                style: 'currency',
                currency: 'MMK',
            });
            return <div className="my-1.5">{formattedCurrency}</div>;
        },
    },
    {
        accessorKey: 'valid_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="Valid At" />
                </div>
            );
        },
        cell: ({ row }) => {
            const valid_at = row.original.valid_at;
            const date = new Date(valid_at);
            return <div className="my-1.5 text-center">{date.toLocaleString()}</div>;
        },
    },

    {
        accessorKey: 'expired_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="tickets.index" column={column} title="Expired At" />
                </div>
            );
        },
        cell: ({ row }) => {
            const expired_at = row.original.expired_at;
            const date = new Date(expired_at);
            return <div className="my-1.5 text-center">{date.toLocaleString()}</div>;
        },
    },
    // {
    //     accessorKey: 'created_at',
    //     header: ({ column }) => {
    //         return (
    //             <div className="flex items-center justify-center">
    //                 <DataTableColumnHeader routePath="tickets.index" column={column} title="Created At" />
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         const created_at = row.original.created_at;
    //         const date = new Date(created_at);
    //         return <div className="my-1.5 text-center">{date.toLocaleString()}</div>;
    //     },
    // },
    // {
    //     accessorKey: 'updated_at',
    //     header: ({ column }) => {
    //         return (
    //             <div className="flex items-center justify-center">
    //                 <DataTableColumnHeader routePath="tickets.index" column={column} title="Updated At" />
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         const updated_at = row.original.updated_at;
    //         const date = new Date(updated_at);
    //         return <div className="my-1.5 text-center">{date.toLocaleString()}</div>;
    //     },
    // },
    {
        accessorKey: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            return <div className="mr-2 flex items-center justify-center">{<ViewDetailDialog data={row.original} />}</div>;
        },
    },
];
