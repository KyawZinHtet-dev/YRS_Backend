import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
const DateRangePicker = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    return (
        <div className="border-input relative grid grid-cols-1 gap-3 rounded-md border p-3 lg:grid-cols-2">
            <div>
                <Label htmlFor="start_date">Start Date</Label>
                <DateTimePicker value={startDate} onChange={setStartDate} yearRange={1} />
            </div>
            <div>
                <Label htmlFor="end_date">End Date</Label>
                <DateTimePicker value={endDate} onChange={setEndDate} yearRange={1} />
            </div>
        </div>
    );
};

export default DateRangePicker;
