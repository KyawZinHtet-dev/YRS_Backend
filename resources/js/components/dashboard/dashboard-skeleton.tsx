import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardSkeleton() {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            {/* Header with Filter Skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                <div className="flex w-full items-center gap-3 sm:w-auto">
                    <div className="h-6 w-6 shrink-0 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-4"></div>
                    <div className="h-10 flex-1 animate-pulse rounded bg-gray-200 sm:w-32"></div>
                    <div className="h-10 flex-1 animate-pulse rounded bg-gray-200 sm:w-20"></div>
                </div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {/* Two column charts skeleton */}
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] animate-pulse rounded bg-gray-200"></div>
                        </CardContent>
                    </Card>
                ))}
                {/* Full width chart skeleton */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] animate-pulse rounded bg-gray-200"></div>
                    </CardContent>
                </Card>
            </div>

            {/* Pie Charts Skeleton */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] animate-pulse rounded bg-gray-200"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
