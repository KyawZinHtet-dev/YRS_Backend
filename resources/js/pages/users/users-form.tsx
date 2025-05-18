import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface UserForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

type UserFormProps = {
    user?: { id: number; name: string; email: string };
    mode: 'create' | 'edit';
    setDialogOpen?: (open: boolean) => void;
};

const UsersForm = ({ user, mode, setDialogOpen }: UserFormProps) => {
    const { data, setData, post, put, reset, errors, processing } = useForm<Required<UserForm>>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            put(route('users.update', user?.id), {
                onSuccess: () => setDialogOpen && setDialogOpen(false),
                onError: () => reset('password', 'password_confirmation'),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => reset(),
                onError: () => reset('password', 'password_confirmation'),
            });
        }
    };

    return (
        <div className="grid gap-4 pt-4">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Full name"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        tabIndex={2}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">{mode === 'create' ? 'Password' : 'New password'}</Label>
                    <Input
                        id="password"
                        type="password"
                        required={mode === 'create'}
                        tabIndex={3}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        disabled={processing}
                        placeholder={mode === 'create' ? 'Password' : 'New password'}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">{mode === 'create' ? 'Confirm password' : 'Confirm new password'}</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required={mode === 'create'}
                        tabIndex={4}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        disabled={processing}
                        placeholder={mode === 'create' ? 'Confirm password' : 'Confirm new password'}
                    />
                    <InputError message={errors.password_confirmation} />
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

export default UsersForm;
