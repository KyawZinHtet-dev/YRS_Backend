import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, CreditCard, DollarSign, Ticket, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface SummaryData {
    totalUsers: number;
    newUsersThisMonth: number;
    totalTickets: number;
    ticketsThisMonth: number;
    activeTickets: number;
    expiredTickets: number;
    totalRevenue: number;
    revenueThisMonth: number;
    totalTransactions: number;
    transactionsThisMonth: number;
    totalTopUps: number;
    topUpsThisMonth: number;
    pendingTopUps: number;
    isFiltered?: boolean;
    filterMonth?: string;
    selectedYear?: string;
    selectedMonth?: string;
}

interface MonthlyData {
    userRegistrations: Array<{ label: string; count: number }>;
    ticketSales: Array<{ label: string; count: number; revenue: number }>;
    monthlyRevenue: Array<{ label: string; manual: number; top_up: number; buy_ticket: number }>;
    transactionTypes: Array<{ type: string; count: number }>;
    ticketTypes: Array<{ type: string; count: number }>;
    transactionMethods: Array<{ method: string; count: number }>;
}

export default function Dashboard() {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(true);

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => ({
        value: year.toString(),
        label: year.toString(),
    }));

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const summaryParams = {
                    month: selectedMonth !== 'all' ? selectedMonth : null,
                    year: selectedYear,
                };

                const monthlyParams = {
                    month: selectedMonth !== 'all' ? selectedMonth : null,
                    year: selectedYear,
                };

                const [summaryResponse, monthlyResponse] = await Promise.all([
                    axios.get('/api/dashboard/summary', { params: summaryParams }),
                    axios.get('/api/dashboard/monthly', { params: monthlyParams }),
                ]);

                setSummaryData(summaryResponse.data);
                setMonthlyData(monthlyResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth, selectedYear]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MM', {
            style: 'currency',
            currency: 'MMK',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    {/* Header with Filter Skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-10 w-20 animate-pulse rounded bg-gray-200"></div>
                        </div>
                    </div>

                    {/* Summary Cards Skeleton */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((i) => (
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
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
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
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px] animate-pulse rounded bg-gray-200"></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header with Filter */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                        {summaryData?.isFiltered && <p className="text-muted-foreground mt-1 text-sm">Filtered for: {summaryData.filterMonth}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Months</SelectItem>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year.value} value={year.value}>
                                        {year.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summaryData?.totalUsers !== undefined ? summaryData.totalUsers.toLocaleString() : '0'}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {summaryData?.totalUsers === 0 && summaryData?.isFiltered
                                    ? 'No users in selected period'
                                    : selectedMonth === 'all'
                                      ? `+${summaryData?.newUsersThisMonth || 0} in ${selectedYear}`
                                      : `+${summaryData?.newUsersThisMonth || 0} in ${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ticket Sale</CardTitle>
                            <Ticket className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summaryData?.totalTickets !== undefined ? summaryData.totalTickets.toLocaleString() : '0'}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {summaryData?.totalTickets === 0 && summaryData?.isFiltered
                                    ? 'No tickets in selected period'
                                    : selectedMonth === 'all'
                                      ? `+${summaryData?.ticketsThisMonth || 0} in ${selectedYear}`
                                      : `+${summaryData?.ticketsThisMonth || 0} in ${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Balance Income</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summaryData?.totalRevenue !== undefined ? formatCurrency(summaryData.totalRevenue) : '$0'}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {summaryData?.totalRevenue === 0 && summaryData?.isFiltered
                                    ? 'No income in selected period'
                                    : selectedMonth === 'all'
                                      ? `+${formatCurrency(summaryData?.revenueThisMonth || 0)} in ${selectedYear}`
                                      : `+${formatCurrency(summaryData?.revenueThisMonth || 0)} in ${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                            <CreditCard className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summaryData?.totalTransactions !== undefined ? summaryData.totalTransactions.toLocaleString() : '0'}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {summaryData?.totalTransactions === 0 && summaryData?.isFiltered
                                    ? 'No transactions in selected period'
                                    : selectedMonth === 'all'
                                      ? `+${summaryData?.transactionsThisMonth || 0} in ${selectedYear}`
                                      : `+${summaryData?.transactionsThisMonth || 0} in ${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    {/* User Registrations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label} User Registrations (
                                {selectedYear})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <LineChart data={monthlyData?.userRegistrations}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="label" />
                                    <YAxis allowDecimals={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Users"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Ticket Sales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label} Ticket Sales (
                                {selectedYear})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <LineChart data={monthlyData?.ticketSales}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="label" />
                                    <YAxis allowDecimals={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        name="Tickets"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Monthly Revenue & Top-ups - Full Width */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label} Total Balance Income (
                                {selectedYear})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[400px] w-full">
                                <BarChart data={monthlyData?.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="label" />
                                    <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="manual" fill="#0088FE" name="Manual" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="top_up" fill="#00C49F" name="Top Up" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="buy_ticket" fill="#FFBB28" name="Buy Ticket" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    {/* Transaction Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label} Transaction Types (
                                {selectedYear})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <PieChart>
                                    <Pie
                                        data={monthlyData?.transactionTypes}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ payload, percent }) => {
                                            const cleanCount = payload?.count || 0;
                                            const cleanPercent = percent || 0;
                                            return `${payload?.type || ''}: ${cleanCount} (${(cleanPercent * 100).toFixed(1)}%)`;
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="type"
                                    >
                                        {monthlyData?.transactionTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Ticket Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label} Ticket Types (
                                {selectedYear})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <PieChart>
                                    <Pie
                                        data={monthlyData?.ticketTypes}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ payload, percent }) => {
                                            const cleanCount = payload?.count || 0;
                                            const cleanPercent = percent || 0;
                                            return `${payload?.type || ''}: ${cleanCount} (${(cleanPercent * 100).toFixed(1)}%)`;
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="type"
                                    >
                                        {monthlyData?.ticketTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
