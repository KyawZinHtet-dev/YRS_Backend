import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { TimePicker } from '@/components/ui/datetime-picker';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const RepeatableInputFields = ({
    scheduleSubmitted,
    handleRemove,
    initialAmoutOfFields,
    index,
    station_title,
    station_id,
    time,
    selectedFieldValues,
}: {
    scheduleSubmitted: boolean;
    selectedFieldValues: React.Dispatch<
        React.SetStateAction<{
            station_id: string;
            time: string;
            index: number | undefined;
        }>
    >;
    handleRemove: () => void;
    initialAmoutOfFields: number;
    station_id: string | number;
    station_title?: string;
    time: Date | undefined;
    index: number | undefined;
}) => {
    const [selectedStation, setSelectedStation] = useState<string | number>(station_id);
    const [selectedTime, setSelectedTime] = useState<Date | undefined>(time);

    useEffect(() => {
        if (scheduleSubmitted) {
            setSelectedStation('');
            setSelectedTime(undefined);
        } else {
            selectedFieldValues({
                station_id: selectedStation as string,
                time: selectedTime
                    ? selectedTime.toLocaleTimeString('en-MM', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                          timeZone: 'Asia/Yangon',
                      })
                    : '',
                index,
            });
        }
    }, [selectedFieldValues, selectedStation, selectedTime, index, scheduleSubmitted]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="border-input relative grid grid-cols-1 gap-3 rounded-md border p-3 lg:grid-cols-2"
        >
            <div>
                <Label>Station</Label>
                <Combobox
                    defaultValue={{ station_id: station_id, station_title: station_title ?? '' }}
                    formSubmitted={scheduleSubmitted}
                    title="Station"
                    getSelectedValue={setSelectedStation}
                    comboboxOption="title"
                    comboboxValue="id"
                    routePath="routes.combobox"
                />
            </div>
            <div>
                <Label>Time</Label>
                <TimePicker date={selectedTime} onChange={setSelectedTime} />
            </div>
            {initialAmoutOfFields > 1 && index! > 0 && (
                <Button
                    variant="outline"
                    size={'sm'}
                    className="text-destructive-foreground hover:text-destructive-foreground absolute top-[-0.5rem] right-[-0.5rem]"
                    onClick={handleRemove}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </motion.div>
    );
};

export default RepeatableInputFields;
