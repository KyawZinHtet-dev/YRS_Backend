import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { MonthOption, SummaryData, YearOption, MonthlyData } from './types';

interface RevenueChartProps {
    monthlyData: MonthlyData | null;
    selectedMonth: string;
    selectedYear: string;
    months: MonthOption[];
}

export default function RevenueChart({
    monthlyData,
    selectedMonth,
    selectedYear,
    months,
}: RevenueChartProps) {
    const monthLabel = selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label;

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>
                    {monthLabel} Total Balance Income ({selectedYear})
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
    );
}
