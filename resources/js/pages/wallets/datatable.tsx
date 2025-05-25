import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from '@/components/datatable/pagination';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { router } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { BanknoteArrowDown, BanknoteArrowUp, SearchIcon, Settings2, XIcon } from 'lucide-react';
import WalletForm from './wallet-form';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    next_page_url: string | null | undefined;
    prev_page_url: string | null | undefined;
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    next_page_url,
    prev_page_url,
    first_page_url,
    last_page_url,
    current_page,
    last_page,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const pageSize = route().params.paginate ?? 5;
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        initialState: {
            pagination: {
                pageSize: Number(pageSize),
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                    <CardTitle>Wallet Table</CardTitle>
                    <CardDescription>Watch your wallets here.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <TooltipProvider>
                            <Tooltip>
                                <DialogTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline">
                                            <BanknoteArrowDown />
                                        </Button>
                                    </TooltipTrigger>
                                </DialogTrigger>
                                <TooltipContent>
                                    <p>Reduce Wallet Balance</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reduce Wallet Balance</DialogTitle>
                                <DialogDescription>Reduce a user's wallet balance here.</DialogDescription>
                            </DialogHeader>
                            <WalletForm mode="reduce" />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button className="w-full" type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <TooltipProvider>
                            <Tooltip>
                                <DialogTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline">
                                            <BanknoteArrowUp />
                                        </Button>
                                    </TooltipTrigger>
                                </DialogTrigger>
                                <TooltipContent>
                                    <p>Add Wallet Balance</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Wallet Balance</DialogTitle>
                                <DialogDescription>Add a user's wallet balance here.</DialogDescription>
                            </DialogHeader>
                            <WalletForm mode="add" />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button className="w-full" type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-2 py-4">
                    <div className="relative">
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ''}
                            onChange={(e) => {
                                table.setGlobalFilter(String(e.target.value));
                                router.visit(
                                    route('wallets.index', {
                                        search: e.target.value,
                                        paginate: route().params.paginate,
                                        page: route().params.page,
                                        col: route().params.col,
                                        dir: route().params.dir,
                                    }),
                                    { preserveState: true, preserveScroll: true },
                                );
                            }}
                            className="max-w-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            {globalFilter === '' && <SearchIcon className="text-muted-foreground h-5 w-5" aria-hidden="true" />}
                            {globalFilter && (
                                <XIcon
                                    onClick={() => {
                                        table.setGlobalFilter('');
                                        router.visit(
                                            route('wallets.index', {
                                                search: '',
                                                paginate: route().params.paginate,
                                                page: route().params.page,
                                                col: route().params.col,
                                                dir: route().params.dir,
                                            }),
                                            { preserveState: true, preserveScroll: true },
                                        );
                                    }}
                                    className="text-muted-foreground h-5 w-5 cursor-pointer"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <Settings2 /> View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="block">
                <DataTablePagination
                    next_page_url={next_page_url}
                    prev_page_url={prev_page_url}
                    first_page_url={first_page_url}
                    last_page_url={last_page_url}
                    current_page={current_page}
                    last_page={last_page}
                    table={table}
                    routePath="wallets.index"
                />
            </CardFooter>
        </Card>
    );
}
