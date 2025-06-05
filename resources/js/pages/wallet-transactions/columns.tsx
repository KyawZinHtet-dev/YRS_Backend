import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/datatable/column-header';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { AnimatedNumber } from '@/components/ui/animated-number';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WalletTransaction = {
    id: number;
    transaction_id: string;
    user_id: number;
    wallet_id: number;
    amount: number;
    description: string;
    type: 'Manual' | 'Top Up' | 'Buy Ticket';
    method: 'add' | 'reduce';
    sourceable_id: number;
    sourceable_type: string;
    created_at: string;
    updated_at: string;
    user_email: string;
};

const ViewDetailDialog = ({ data }: { data: WalletTransaction }) => {
    const [open, setOpen] = useState(false);
    const [animateValue, setAnimateValue] = useState(0);
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setAnimateValue(data.amount);
            }, 100);
        } else {
            setAnimateValue(0);
        }
    }, [open, data.amount]);

    return (
        <div className="ml-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={'outline'} size={'sm'}>
                        Details
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 mb-5">
                        <h3
                            className={cn(
                                'flex items-center justify-center gap-1 text-3xl font-semibold',
                                data.method === 'add' ? 'text-green-500' : 'text-red-500',
                            )}
                        >
                            {data.method === 'add' ? <Plus /> : <Minus />}
                            <AnimatedNumber
                                springOptions={{
                                    bounce: 0,
                                    duration: 1000,
                                }}
                                value={animateValue}
                            />
                            MMK
                        </h3>
                        <div className="mt-10 flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">Transaction ID:</p>
                                <p> {data.transaction_id}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium">From:</p>
                                {data.method === 'add' ? (
                                    <Badge
                                        className={cn(
                                            {
                                                'bg-sky-500 dark:bg-sky-600': data.type === 'Manual',
                                                'bg-purple-500 dark:bg-purple-600': data.type === 'Top Up',
                                                'bg-amber-500 dark:bg-amber-600': data.type === 'Buy Ticket',
                                            },
                                            'w-[80px] text-center',
                                        )}
                                    >
                                        {data.type}
                                    </Badge>
                                ) : (
                                    <p>{data.user_email}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium">To:</p>
                                {data.method === 'add' ? (
                                    <p>{data.user_email}</p>
                                ) : (
                                    <Badge
                                        className={cn(
                                            {
                                                'bg-sky-500 dark:bg-sky-600': data.type === 'Manual',
                                                'bg-purple-500 dark:bg-purple-600': data.type === 'Top Up',
                                                'bg-amber-500 dark:bg-amber-600': data.type === 'Buy Ticket',
                                            },
                                            'w-[80px] text-center',
                                        )}
                                    >
                                        {data.type}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium">Type:</p>
                                <Badge
                                    className={cn(
                                        {
                                            'bg-sky-500 dark:bg-sky-600': data.type === 'Manual',
                                            'bg-purple-500 dark:bg-purple-600': data.type === 'Top Up',
                                            'bg-amber-500 dark:bg-amber-600': data.type === 'Buy Ticket',
                                        },
                                        'w-[80px] text-center',
                                    )}
                                >
                                    {data.type}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium">Date:</p>
                                <p className="capitalize">{new Date(data.created_at).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium">Description:</p>
                                <p className="capitalize">{data.description}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const columns: ColumnDef<WalletTransaction>[] = [
    {
        accessorKey: 'transaction_id',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="wallet-transactions.index" column={column} title="Transaction ID" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 ml-3">{row.original.transaction_id}</div>;
        },
    },
    {
        accessorKey: 'user_email',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="wallet-transactions.index" column={column} title="User Email" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 ml-3">{row.original.user_email}</div>;
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="wallet-transactions.index" column={column} title="Amount" />
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = row.original.amount;
            const formattedCurrency = amount.toLocaleString('my-MM', {
                style: 'currency',
                currency: 'MMK',
            });
            return <div className="my-1.5">{formattedCurrency}</div>;
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <div className="ml-4">
                    <DataTableColumnHeader routePath="wallet-transactions.index" column={column} title="Type" />
                </div>
            );
        },
        cell: ({ row }) => {
            return (
                <div>
                    <Badge
                        className={cn(
                            {
                                'bg-sky-500 dark:bg-sky-600': row.original.type === 'Manual',
                                'bg-purple-500 dark:bg-purple-600': row.original.type === 'Top Up',
                                'bg-amber-500 dark:bg-amber-600': row.original.type === 'Buy Ticket',
                            },
                            'w-[80px] text-center',
                        )}
                    >
                        {row.original.type}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'method',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="wallet-transactions.index" column={column} title="Method" />
                </div>
            );
        },
        cell: ({ row }) => {
            return (
                <div>
                    <Badge
                        className={cn(
                            {
                                'bg-green-500 dark:bg-green-600': row.original.method === 'add',
                                'bg-rose-500 dark:bg-rose-600': row.original.method === 'reduce',
                            },
                            'w-[70px] text-center capitalize',
                        )}
                    >
                        {row.original.method}
                    </Badge>
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
            return <div className="my-1.5 text-center">{date.toLocaleString()}</div>;
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
            return <div className="my-1.5 text-center">{date.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            return <ViewDetailDialog data={row.original} />;
        },
    },
];
