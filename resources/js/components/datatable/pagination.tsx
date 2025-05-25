import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    next_page_url: string | null | undefined;
    prev_page_url: string | null | undefined;
    first_page_url: string | null | undefined;
    last_page_url: string | null | undefined;
    current_page: number | null | undefined;
    last_page: number | null | undefined;
    routePath: string;
}

export function DataTablePagination<TData>({
    table,
    next_page_url,
    prev_page_url,
    first_page_url,
    last_page_url,
    current_page,
    last_page,
    routePath,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="xs:flex-row xs:items-center xs:justify-start flex w-full flex-col items-start justify-center gap-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                        router.visit(
                            route(routePath, {
                                page: route().params.page || 1,
                                paginate: value,
                                col: route().params.col,
                                dir: route().params.dir,
                                search: route().params.search,
                            }),
                            {
                                preserveState: true,
                                preserveScroll: true,
                            },
                        );
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="xs:flex-row xs:items-center xs:justify-end flex w-full flex-col items-end justify-center gap-2">
                <div className="flex items-center justify-center text-sm font-medium">
                    Page {last_page} of {current_page}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => first_page_url && router.visit(first_page_url, { preserveScroll: true, preserveState: true })}
                        disabled={!prev_page_url}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => prev_page_url && router.visit(prev_page_url, { preserveScroll: true, preserveState: true })}
                        disabled={!prev_page_url}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => next_page_url && router.visit(next_page_url, { preserveScroll: true, preserveState: true })}
                        disabled={!next_page_url}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => last_page_url && router.visit(last_page_url, { preserveScroll: true, preserveState: true })}
                        disabled={!next_page_url}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
