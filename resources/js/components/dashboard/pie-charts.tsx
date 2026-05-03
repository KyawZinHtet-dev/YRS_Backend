import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart } from 'recharts';
import { MonthOption, SummaryData, YearOption, MonthlyData } from './types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface PieChartsProps {
    monthlyData: MonthlyData | null;
    selectedMonth: string;
    selectedYear: string;
    months: MonthOption[];
}

export default function PieCharts({
    monthlyData,
    selectedMonth,
    selectedYear,
    months,
}: PieChartsProps) {
    const monthLabel = selectedMonth === 'all' ? 'Yearly' : months.find((m) => m.value === selectedMonth)?.label;

    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Transaction Types */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {monthLabel} Transaction Types ({selectedYear})
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
                        {monthLabel} Ticket Types ({selectedYear})
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
    );
}
