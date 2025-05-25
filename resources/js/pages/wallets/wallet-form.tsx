import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface WalletForm {
    wallet_id: number;
    amount: number;
    description: string;
}

type UserFormProps = {
    mode: 'add' | 'reduce';
    setDialogOpen?: (open: boolean) => void;
};

const WalletForm = ({ mode }: UserFormProps) => {
    const { data, setData, errors, processing } = useForm<Required<WalletForm>>({
        wallet_id: 0,
        amount: 0,
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // if (mode === 'edit') {
        //     put(route('users.update', user?.id), {
        //         onSuccess: () => setDialogOpen && setDialogOpen(false),
        //         onError: () => reset('password', 'password_confirmation'),
        //     });
        // } else {
        //     post(route('users.store'), {
        //         onSuccess: () => reset(),
        //         onError: () => reset('password', 'password_confirmation'),
        //     });
        // }
    };

    return (
        <div className="grid gap-4 pt-4">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount in MMK</Label>
                    <Input
                        id="amount"
                        type="number"
                        required
                        tabIndex={2}
                        autoComplete="amount"
                        value={data.amount}
                        onChange={(e) => setData('amount', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Amount in MMK"
                        min={0}
                    />
                    <InputError message={errors.amount} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        required
                        tabIndex={3}
                        autoComplete="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        disabled={processing}
                        placeholder="Description"
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {mode === 'add' ? 'Add' : 'Reduce'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default WalletForm;
