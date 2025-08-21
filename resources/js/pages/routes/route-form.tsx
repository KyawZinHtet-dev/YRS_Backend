import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { axios } from '@/lib/axios';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import RepeatableInput from './repeatable-input';

interface RouteForm {
    title: string;
    description: string;
    direction: string;
    schedule: { station_id: string; time: string }[];
}

type RouteFormProps = {
    railway_route?: {
        id: number;
        title: string;
        description: string;
        direction: string;
        schedule: { station_id: string; time: string; station_title: string }[];
    };
    mode: 'create' | 'edit';
    setDialogOpen?: (open: boolean) => void;
};

const RouteForm = ({ railway_route, mode, setDialogOpen }: RouteFormProps) => {
    const { data, setData, post, put, reset, errors, processing } = useForm<Required<RouteForm>>({
        title: railway_route?.title ?? '',
        description: railway_route?.description ?? '',
        direction: railway_route?.direction ?? '',
        schedule: railway_route?.schedule ?? [{ station_id: '', time: '', station_title: '' }],
    });

    const [initialSchedule, setInitialSchedule] = useState(railway_route?.schedule ?? [{ station_id: '', time: '', station_title: '' }]);
    const [scheduleSubmitted, setScheduleSubmitted] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            put(route('routes.update', railway_route?.id), {
                onSuccess: () => setDialogOpen && setDialogOpen(false),
            });
            axios.storage?.clear?.();
        } else {
            post(route('routes.store'), {
                onSuccess: () => {
                    setScheduleSubmitted(true);
                    reset();
                },
            });
            axios.storage?.clear?.();
        }
    };

    useEffect(() => {
        setData('schedule', initialSchedule);
    }, [initialSchedule, setData]);

    return (
        <div className="grid gap-4">
            <form onSubmit={submit} className="space-y-6">
                <div className="max-h-[400px] space-y-6 overflow-y-auto p-1">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            tabIndex={1}
                            autoComplete="name"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            disabled={processing}
                            placeholder="Route Title"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Decription</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Route Description"
                            disabled={processing}
                            tabIndex={2}
                        ></Textarea>
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="direction">Direction</Label>
                        <Select disabled={processing} value={data.direction} onValueChange={(value) => setData('direction', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Directions</SelectLabel>
                                    <SelectItem value="clockwise">Clockwise</SelectItem>
                                    <SelectItem value="anticlockwise">Anticlockwise</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.direction} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <RepeatableInput
                            scheduleSubmitted={scheduleSubmitted}
                            setScheduleSubmitted={setScheduleSubmitted}
                            initialSchedule={initialSchedule}
                            setInitialSchedule={setInitialSchedule}
                        />
                        <InputError message={errors.schedule} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {mode === 'create' ? 'Create' : 'Update'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RouteForm;
