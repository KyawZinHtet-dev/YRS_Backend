import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import RepeatableInputFields from './repeatable-input-fields';
const RepeatableInput = ({
    initialSchedule,
    setInitialSchedule,
    scheduleSubmitted,
    setScheduleSubmitted,
}: {
    scheduleSubmitted: boolean;
    setScheduleSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    initialSchedule: { station_id: string; time: string; station_title: string }[];
    setInitialSchedule: React.Dispatch<React.SetStateAction<{ station_id: string; time: string; station_title: string }[]>>;
}) => {
    const [initialFields, setInitialFields] = useState(initialSchedule);
    const [selectedFieldValues, setSelectedFieldValues] = useState<{ station_id: string; time: string; index: number | undefined }>({
        station_id: '',
        time: '',
        index: undefined,
    });
    const handleAdd = () => {
        setInitialFields([...initialFields, { station_id: '', time: '', station_title: '' }]);
    };
    const handleRemove = (index: number) => {
        const newFields = initialFields.filter((_, i) => i !== index);
        setInitialFields(newFields);
    };

    useEffect(() => {
        if (scheduleSubmitted) {
            setInitialFields([{ station_id: '', time: '', station_title: '' }]);
            setSelectedFieldValues({ station_id: '', time: '', index: undefined });
            setScheduleSubmitted(false);
        } else {
            initialFields.map((field, index) => {
                if (index === selectedFieldValues.index) {
                    field.station_id = selectedFieldValues.station_id;
                    field.time = selectedFieldValues.time;
                }
            });
            setInitialSchedule(initialFields);
        }
    }, [initialFields, selectedFieldValues, setInitialSchedule, initialSchedule, scheduleSubmitted, setScheduleSubmitted]);

    return (
        <div className="border-input rounded-md border p-3">
            <div className="space-y-4">
                {initialFields.map((field, index) => (
                    <RepeatableInputFields
                        key={index}
                        handleRemove={() => handleRemove(index)}
                        index={index}
                        station_title={field.station_title}
                        station_id={field.station_id}
                        time={field.time ? moment(field.time, 'HH:mm').toDate() : undefined}
                        scheduleSubmitted={scheduleSubmitted}
                        selectedFieldValues={setSelectedFieldValues}
                        initialAmoutOfFields={initialFields.length}
                    />
                ))}
            </div>
            <div className="mt-2 mr-1 flex justify-end">
                <Button onClick={handleAdd} type="button" size={'sm'} variant="outline">
                    <Plus className="h-4 w-4" /> Add Schedule
                </Button>
            </div>
        </div>
    );
};

export default RepeatableInput;
