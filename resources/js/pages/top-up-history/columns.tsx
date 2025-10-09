import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/datatable/column-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MorphingDialogBasicImage } from '@/components/ui/morphing-dialog-basic-image';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import moment from 'moment';
import { useEffect, useState } from 'react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TopUpHistory = {
    id: number;
    transaction_id: string;
    user_id: number;
    wallet_id: number;
    amount: number;
    description: string;
    image: string;
    status: 'pending' | 'approve' | 'reject';
    approved_at: string;
    rejected_at: string;
    created_at: string;
    updated_at: string;
    user_email: string;
};

const ViewDetailDialog = ({ data }: { data: TopUpHistory }) => {
    return (
        <Dialog key={data.id}>
            <DialogTrigger asChild>
                <Button className="ml-4" variant={'outline'} size={'sm'}>
                    Details
                </Button>
            </DialogTrigger>
            <DialogContent className="w-11/12 sm:h-[70vh] sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Top Up History Details</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-5 py-2 sm:grid-cols-2 sm:py-5">
                    <div>
                        <img src={'/storage/top-up-images/' + data.image} alt={data.image} className="h-[50vh] w-full rounded-[4px] object-cover" />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Transaction ID:</p>
                            <p className="text-sm"> {data.transaction_id}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">User Email:</p>
                            <p className="text-sm"> {data.user_email}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Amount:</p>
                            <p className="text-sm"> {data.amount}MMK</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Description:</p>
                            <p className="text-sm"> {data.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Status:</p>
                            <StatusDropdown status={data.status} id={data.id} />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Approved At:</p>
                            <p className="text-sm"> {data.approved_at ? moment(data.approved_at).format('DD/MM/YYYY hh:mm A') : '-'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Rejected At:</p>
                            <p className="text-sm"> {data.rejected_at ? moment(data.rejected_at).format('DD/MM/YYYY hh:mm A') : '-'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Created At:</p>
                            <p className="text-sm"> {moment(data.created_at).format('DD/MM/YYYY hh:mm A')}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Updated At:</p>
                            <p className="text-sm"> {moment(data.updated_at).format('DD/MM/YYYY hh:mm A')}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const StatusDropdown = ({ status, id }: { status: string; id: number }) => {
    const [ddStatus, setddStatus] = useState(status);

    const handleOnChange = (value: string) => {
        switch (value) {
            case 'approve':
                router.post(route('top-up-history.approve', id));
                break;
            case 'reject':
                router.post(route('top-up-history.reject', id));
                break;
        }
    };

    useEffect(() => {
        setddStatus(status);
    }, [status]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn(
                        'w-20 capitalize',
                        ddStatus === 'pending' && 'text-orange-500 hover:text-orange-600',
                        ddStatus === 'approve' && 'text-green-500 hover:text-green-600',
                        ddStatus === 'reject' && 'text-rose-500 hover:text-rose-600',
                    )}
                    size={'sm'}
                    variant="outline"
                >
                    {status === 'approve' ? 'Approved' : status === 'reject' ? 'Rejected' : 'Pending'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={ddStatus} onValueChange={handleOnChange}>
                    <DropdownMenuRadioItem disabled className="hover:bg-accent w-full text-orange-500 focus:text-orange-600" value="pending">
                        Pending
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        disabled={ddStatus === 'approve' || ddStatus === 'reject'}
                        className="hover:bg-accent w-full text-green-500 focus:text-green-600"
                        value="approve"
                    >
                        Approve
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        disabled={ddStatus === 'approve' || ddStatus === 'reject'}
                        className="hover:bg-accent w-full text-rose-500 focus:text-rose-600"
                        value="reject"
                    >
                        Reject
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<TopUpHistory>[] = [
    {
        accessorKey: 'transaction_id',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="top-up-history.index" column={column} title="Transaction ID" />
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
                    <DataTableColumnHeader routePath="top-up-history.index" column={column} title="User Email" />
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
                    <DataTableColumnHeader routePath="top-up-history.index" column={column} title="Amount" />
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
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <div>
                    <DataTableColumnHeader routePath="top-up-history.index" column={column} title="Status" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <StatusDropdown status={row.original.status} id={row.original.id} />;
        },
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => {
            return (
                <div>
                    <MorphingDialogBasicImage src={'/storage/top-up-images/' + row.original.image} alt={row.original.image} customClass="w-10 h-10" />
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="top-up-history.index" column={column} title="Created At" />
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
                    <DataTableColumnHeader routePath="top-up-history.index" column={column} title="Updated At" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="my-1.5 text-center">{moment(row.original.updated_at).format('DD/MM/YYYY hh:mm A')}</div>;
        },
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="mr-2 flex items-center justify-center">
                    <ViewDetailDialog data={row.original} />
                </div>
            );
        },
    },
];
