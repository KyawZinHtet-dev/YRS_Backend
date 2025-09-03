import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface WalletForm {
    wallet_id: string;
    amount: number;
    description: string;
}

interface WalletFormProps {
    wallets: {
        id: number;
        email: string;
    }[];
    next_page_url: string | null | undefined;
    mode: 'add' | 'reduce';
    setAddDialogOpen?: (open: boolean) => void;
    setReduceDialogOpen?: (open: boolean) => void;
}

const WalletForm = ({ mode, setAddDialogOpen, setReduceDialogOpen }: WalletFormProps) => {
    const [walletId, setWalletId] = useState<string | number>('');
    const { data, setData, errors, processing, post } = useForm<Required<WalletForm>>({
        wallet_id: '',
        amount: 0,
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'add') {
            post(route('wallets.balance.add'), {
                onSuccess: () => setAddDialogOpen && setAddDialogOpen(false),
            });
        } else {
            post(route('wallets.balance.reduce'), {
                onSuccess: () => setReduceDialogOpen && setReduceDialogOpen(false),
            });
        }
    };

    useEffect(() => {
        setData('wallet_id', walletId as string);
    }, [walletId, setData]);

    return (
        <div className="grid gap-4 pt-4">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Wallet</Label>
                    <Combobox title="Wallet" getSelectedValue={setWalletId} comboboxOption="email" comboboxValue="id" routePath="wallets.combobox" />
                    <InputError message={errors.wallet_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount in MMK</Label>
                    <Input
                        id="amount"
                        type="number"
                        tabIndex={2}
                        autoComplete="amount"
                        value={isNaN(data.amount) ? '' : data.amount}
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
