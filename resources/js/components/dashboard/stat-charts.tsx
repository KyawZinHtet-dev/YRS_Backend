import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { MonthOption, SummaryData, YearOption, MonthlyData } from './types';

interface StatChartsProps {
    monthlyData: MonthlyData | null;
    selectedMonth: string;
    selectedYear: string;
    months: MonthOption[];
}

export default function StatCharts({
    monthlyData,
    selectedMonth,
    selectedYear,
    months,
}: StatChartsProps) {
    const monthLabel = selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label;

    return (
        <>
            {/* User Registrations */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {monthLabel} User Registrations ({selectedYear})
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
                        {monthLabel} Ticket Sales ({selectedYear})
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
        </>
    );
}
