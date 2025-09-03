import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { axios } from '@/lib/axios';
import { useForm } from '@inertiajs/react';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import LeafletMap from './leaflet_map';

interface StationForm {
    title: string;
    description: string;
    location: string;
}

type StationFormProps = {
    station?: { id: number; title: string; description: string; latitude: string; longitude: string };
    mode: 'create' | 'edit';
    setDialogOpen?: (open: boolean) => void;
};

const StationForm = ({ station, mode, setDialogOpen }: StationFormProps) => {
    const { data, setData, post, put, reset, errors, processing } = useForm<Required<StationForm>>({
        title: station?.title ?? '',
        description: station?.description ?? '',
        location: `${station?.latitude ?? ''},${station?.longitude ?? ''}`,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            put(route('stations.update', station?.id), {
                onSuccess: () => setDialogOpen && setDialogOpen(false),
            });
            axios.storage?.clear?.();
        } else {
            post(route('stations.store'), {
                onSuccess: () => {
                    reset();
                    setLatLngPosition(null);
                },
            });
            axios.storage?.clear?.();
        }
    };

    const [latLngPosition, setLatLngPosition] = useState<LatLng | null>(() => {
        if (station) {
            return new LatLng(Number(station?.latitude), Number(station?.longitude));
        }
        return null;
    });
    useEffect(() => {
        setData('location', latLngPosition ? `${latLngPosition?.lat.toFixed(5)},${latLngPosition?.lng.toFixed(5)}` : '');
    }, [latLngPosition, setData]);

    return (
        <div className="grid gap-4">
            <form onSubmit={submit} className="space-y-6">
                <div className="max-h-[400px] space-y-6 overflow-y-auto">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            disabled={processing}
                            placeholder="Station Title"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Decription</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Station Description"
                            disabled={processing}
                            tabIndex={2}
                        ></Textarea>
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="loaction">Location</Label>
                        <Input
                            id="location"
                            type="text"
                            tabIndex={3}
                            required={mode === 'create'}
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            disabled={processing}
                            placeholder="Station Location"
                        />
                        <InputError message={errors.location} />
                        <div className="border-secondary rounded-sm border-4">
                            <LeafletMap
                                centerPosition={latLngPosition}
                                setLatLngPosition={setLatLngPosition}
                                data={[{ title: data.title ? data.title : '', latLngPosition: latLngPosition }]}
                            />
                        </div>
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

export default StationForm;
