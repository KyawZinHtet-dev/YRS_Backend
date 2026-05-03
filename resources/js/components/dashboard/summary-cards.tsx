import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Ticket, Users } from 'lucide-react';
import { MonthOption, SummaryData, YearOption, MonthlyData } from './types';

interface SummaryCardsProps {
    summaryData: SummaryData | null;
    selectedMonth: string;
    selectedYear: string;
    months: MonthOption[];
}

export default function SummaryCards({
    summaryData,
    selectedMonth,
    selectedYear,
    months,
}: SummaryCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MM', {
            style: 'currency',
            currency: 'MMK',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPeriodLabel = () => {
        if (selectedMonth === 'all') {
            return `in ${selectedYear}`;
        }
        const monthLabel = months.find((m) => m.value === selectedMonth)?.label;
        return `in ${monthLabel} ${selectedYear}`;
    };

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                            : `+${summaryData?.newUsersThisMonth || 0} ${getPeriodLabel()}`}
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
                            : `+${summaryData?.ticketsThisMonth || 0} ${getPeriodLabel()}`}
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
                            : `+${formatCurrency(summaryData?.revenueThisMonth || 0)} ${getPeriodLabel()}`}
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
                            : `+${summaryData?.transactionsThisMonth || 0} ${getPeriodLabel()}`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
