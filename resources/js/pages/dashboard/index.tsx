import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton';
import PieCharts from '@/components/dashboard/pie-charts';
import RevenueChart from '@/components/dashboard/revenue-chart';
import StatCharts from '@/components/dashboard/stat-charts';
import SummaryCards from '@/components/dashboard/summary-cards';
import { MonthlyData, MonthOption, SummaryData, YearOption } from '@/components/dashboard/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(true);

    const months: MonthOption[] = [
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
    const years: YearOption[] = Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => ({
        value: year.toString(),
        label: year.toString(),
    }));

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {
                    month: selectedMonth,
                    year: selectedYear,
                };

                const [summaryResponse, monthlyResponse] = await Promise.all([
                    axios.get('/api/dashboard/summary', { params }),
                    axios.get('/api/dashboard/monthly', { params }),
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

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <DashboardSkeleton />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DashboardHeader
                    summaryData={summaryData}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    months={months}
                    years={years}
                />

                <SummaryCards summaryData={summaryData} selectedMonth={selectedMonth} selectedYear={selectedYear} months={months} />

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <StatCharts monthlyData={monthlyData} selectedMonth={selectedMonth} selectedYear={selectedYear} months={months} />
                    <RevenueChart monthlyData={monthlyData} selectedMonth={selectedMonth} selectedYear={selectedYear} months={months} />
                </div>

                <PieCharts monthlyData={monthlyData} selectedMonth={selectedMonth} selectedYear={selectedYear} months={months} />
            </div>
        </AppLayout>
    );
}
