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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import LeafletMap from '@/pages/stations/leaflet_map';
import { useForm } from '@inertiajs/react';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import RouteForm from './route-form';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Route = {
    id: number;
    title: string;
    description: string;
    direction: string;
    created_at: string;
    updated_at: string;
    stations: { title: string; pivot: { time: string; station_id: string }; latitude: string; longitude: string }[];
};

function ActionDroupdownMenu({ data }: { data: Route }) {
    const railway_route = {
        id: data.id,
        title: data.title,
        description: data.description,
        direction: data.direction,
        schedule: data.stations.map((station) => {
            return {
                station_id: station.pivot.station_id,
                time: station.pivot.time,
                station_title: station.title,
            };
        }),
        created_at: data.created_at,
        updated_at: data.updated_at,
    };

    const { delete: destroy, processing } = useForm();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    useEffect(() => {
        if (!dialogOpen && viewDialogOpen) {
            setTimeout(() => {
                setViewDialogOpen(false);
            }, 300);
        } else if (!dialogOpen && editDialogOpen) {
            setTimeout(() => {
                setEditDialogOpen(false);
            }, 300);
        }
    }, [dialogOpen, viewDialogOpen, editDialogOpen]);

    const centerPosition =
        data.direction === 'clockwise'
            ? new LatLng(Number(data.stations[0].latitude), Number(data.stations[0].longitude))
            : new LatLng(Number(data.stations[data.stations.length - 1].latitude), Number(data.stations[data.stations.length - 1].longitude));

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
                        <DialogTrigger onClick={() => setViewDialogOpen(true)} className="block w-full">
                            <DropdownMenuItem className="text-sky-700 focus:bg-sky-700/10 focus:text-sky-700 dark:focus:bg-sky-700/20">
                                View route
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogTrigger onClick={() => setEditDialogOpen(true)} className="block w-full">
                            <DropdownMenuItem className="text-amber-700 focus:bg-amber-700/10 focus:text-amber-700 dark:focus:bg-amber-700/20">
                                Edit route
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <AlertDialogTrigger className="block w-full">
                            <DropdownMenuItem variant="destructive">Delete route</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this route and remove data from our servers.
                            <br />
                            <span className="mt-2 block font-bold">
                                Route: <span className="font-normal">{data.title}</span>
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                destroy(`routes/${data.id}`);
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
                    <DialogTitle>{(viewDialogOpen && 'View Route') || (editDialogOpen && 'Edit Route')}</DialogTitle>
                    <DialogDescription>
                        {(viewDialogOpen && 'View route details and schedule here.') ||
                            (editDialogOpen && "Make changes route here. Click update when you're done.")}
                    </DialogDescription>
                </DialogHeader>
                {(viewDialogOpen && (
                    <div className="max-h-[500px] space-y-3 overflow-y-auto px-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between capitalize">
                                        <h3>{railway_route.title}</h3>
                                        <p
                                            className={cn(
                                                'text-sm capitalize',
                                                railway_route.direction === 'clockwise' && 'text-green-500',
                                                railway_route.direction === 'anticlockwise' && 'text-red-500',
                                            )}
                                        >
                                            {railway_route.direction}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{railway_route.description}</p>
                                <div className="mt-3 grid lg:grid-cols-2 lg:gap-x-20">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">Created At:</p>
                                        <p className="text-sm">{new Date(railway_route.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">Updated At:</p>
                                        <p className="text-sm">{new Date(railway_route.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="capitalize">Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-secondary rounded-sm border-4">
                                    <LeafletMap
                                        centerPosition={centerPosition}
                                        data={data.stations.map((d) => {
                                            return {
                                                title: d.title,
                                                latLngPosition: new LatLng(Number(d.latitude), Number(d.longitude)),
                                                time: d.pivot.time,
                                            };
                                        })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )) ||
                    (editDialogOpen && <RouteForm railway_route={railway_route} mode="edit" setDialogOpen={setDialogOpen} />)}
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

export const columns: ColumnDef<Route>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="routes.index" column={column} title="Route" />
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
                    <DataTableColumnHeader routePath="routes.index" column={column} title="Description" />
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="ml-3">{row.original.description.substring(0, 50) + ' ...'}</div>;
        },
    },
    {
        accessorKey: 'direction',
        header: ({ column }) => {
            return (
                <div className="ml-3">
                    <DataTableColumnHeader routePath="routes.index" column={column} title="Direction" />
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
                    )}
                >
                    {row.original.direction}
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-center">
                    <DataTableColumnHeader routePath="routes.index" column={column} title="Created At" />
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
                    <DataTableColumnHeader routePath="routes.index" column={column} title="Updated At" />
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
