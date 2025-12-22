import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import moment from 'moment';
import { FormEventHandler, useEffect, useState } from 'react';

interface TicketPricingForm {
    type: 'one_time_ticket' | 'one_month_ticket' | string;
    direction: 'clockwise' | 'anticlockwise' | 'both' | string;
    price: string;
    offer_quantity: string;
    period: { started_at: string; ended_at: string };
}

type TicketPricingProps = {
    ticket_pricings?: { id: number; type: string; direction: string; price: string; offer_quantity: string; started_at: string; ended_at: string };
    mode: 'create' | 'edit';
    setDialogOpen?: (open: boolean) => void;
};

const TicketPricingForm = ({ ticket_pricings, mode, setDialogOpen }: TicketPricingProps) => {
    const { data, setData, post, put, reset, errors, processing } = useForm<Required<TicketPricingForm>>({
        type: ticket_pricings?.type || '',
        direction: ticket_pricings?.direction || '',
        price: ticket_pricings?.price || '',
        offer_quantity: ticket_pricings?.offer_quantity || '',
        period: {
            started_at: ticket_pricings?.started_at || '',
            ended_at: ticket_pricings?.ended_at || '',
        },
    });

    const [startDate, setStartDate] = useState<Date | undefined>(
        ticket_pricings?.started_at ? moment(ticket_pricings?.started_at).toDate() : undefined,
    );
    const [endDate, setEndDate] = useState<Date | undefined>(ticket_pricings?.ended_at ? moment(ticket_pricings?.ended_at).toDate() : undefined);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            put(route('ticket-pricings.update', ticket_pricings?.id), {
                onSuccess: () => setDialogOpen && setDialogOpen(false),
            });
        } else {
            post(route('ticket-pricings.store'), {
                onSuccess: () => {
                    reset();
                    setStartDate(undefined);
                    setEndDate(undefined);
                },
            });
        }
    };

    useEffect(() => {
        setData('period', {
            started_at: startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : '',
            ended_at: endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : '',
        });
    }, [startDate, endDate, setData]);

    console.log(data.direction);

    return (
        <div className="grid gap-4 pt-4">
            <form onSubmit={submit} className="space-y-6">
                <div className="max-h-[400px] space-y-6 overflow-y-auto p-1">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            onValueChange={(value) => {
                                setData('type', value);
                                setData('direction', '');
                            }}
                            value={data.type}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ticket type" />
                            </SelectTrigger>
                            <SelectContent tabIndex={1}>
                                <SelectGroup>
                                    <SelectLabel>Ticket Type</SelectLabel>
                                    <SelectItem value="one_time_ticket">One Time Ticket</SelectItem>
                                    <SelectItem value="one_month_ticket">One Month Ticket</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="direction">Direction</Label>
                        <Select onValueChange={(value) => setData('direction', value)} value={data.direction}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent tabIndex={2}>
                                <SelectGroup>
                                    <SelectLabel>Direction</SelectLabel>
                                    {data.type === 'one_time_ticket' ? (
                                        <>
                                            <SelectItem value="clockwise">Clockwise</SelectItem>
                                            <SelectItem value="anticlockwise">Anticlockwise</SelectItem>
                                        </>
                                    ) : data.type === 'one_month_ticket' ? (
                                        <>
                                            <SelectItem value="both">Both</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="clockwise">Clockwise</SelectItem>
                                            <SelectItem value="anticlockwise">Anticlockwise</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.direction} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price">Price (MMK)</Label>
                        <Input
                            id="price"
                            type="number"
                            tabIndex={3}
                            autoComplete="price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            disabled={processing}
                            placeholder="Type price"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="offer_quantity">Offer Quantity</Label>
                        <Input
                            id="offer_quantity"
                            type="number"
                            tabIndex={4}
                            autoComplete="offer_quantity"
                            value={data.offer_quantity}
                            onChange={(e) => setData('offer_quantity', e.target.value)}
                            disabled={processing}
                            placeholder="Type offer quantity"
                        />
                        <InputError message={errors.offer_quantity} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="period">Period</Label>
                        <div className="border-input relative grid grid-cols-1 gap-3 rounded-md border p-3 lg:grid-cols-2">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <DateTimePicker value={startDate} onChange={setStartDate} yearRange={0} />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <DateTimePicker value={endDate} onChange={setEndDate} yearRange={0} />
                            </div>
                        </div>
                        <InputError message={errors.period} className="mt-2" />
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

export default TicketPricingForm;
