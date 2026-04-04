import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonthFilterProps {
    selectedMonth: string;
    selectedYear: string;
    onMonthChange: (month: string) => void;
    onYearChange: (year: string) => void;
}

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
const years = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => ({
    value: year.toString(),
    label: year.toString()
}));

export default function MonthFilter({ selectedMonth, selectedYear, onMonthChange, onYearChange }: MonthFilterProps) {
    return (
        <div className="flex gap-2 items-center">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
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
            
            <Select value={selectedYear} onValueChange={onYearChange}>
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
    );
}
