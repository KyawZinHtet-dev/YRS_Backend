import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { MonthOption, SummaryData, YearOption, MonthlyData } from './types';

interface DashboardHeaderProps {
    summaryData: SummaryData | null;
    selectedMonth: string;
    setSelectedMonth: (value: string) => void;
    selectedYear: string;
    setSelectedYear: (value: string) => void;
    months: MonthOption[];
    years: YearOption[];
}

export default function DashboardHeader({
    summaryData,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    months,
    years,
}: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                {summaryData?.isFiltered && summaryData?.filterMonth && (
                    <p className="text-muted-foreground mt-1 text-sm">Filtered for: {summaryData.filterMonth}</p>
                )}
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
                <Calendar className="text-muted-foreground h-6 w-6 shrink-0 sm:h-4 sm:w-4" />
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="flex-1 sm:w-[140px]">
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
                    <SelectTrigger className="flex-1 sm:w-[100px]">
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
    );
}
