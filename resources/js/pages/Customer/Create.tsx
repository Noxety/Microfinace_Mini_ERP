import AddressForm from '@/components/AddressForm';
import InputError from '@/components/input-error';
import NRCForm from '@/components/NRCForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Role {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

interface Props {
    branches: any;
    creditlevel: any;
}

export default function CustomersCreate({ branches, creditlevel }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: '/customers',
        },
        {
            title: 'Customers Create',
            href: '/customers/create',
        },
    ];
    const [gender, setGender] = useState(['Male', 'Female', 'Other']);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nrc: '',
        gender: '',
        remark: '',
        occupation: '',
        phone: '',
        address: '',
        date_of_birth: '',
        monthly_income: '',
        creditlevel: '',
        branch: '',
        limit_expired_at: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Customer created successfully.', {
                    position: 'top-center',
                    duration: 3000,
                });
                reset();
            },
            onError: () => {
                toast.error('Error creating Customer. Please check the form.', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
        });
    };
    const [NRCCodeSelect, setNRCCodeSelect] = useState<any>();
    const [NRCPlaceSelect, setNRCPlaceSelect] = useState<any>();
    const [NRCTypeSelect, setNRCTypeSelect] = useState<any>();
    const [NRCCode, setNRCCode] = useState<any>();
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [township, setTownship] = useState('');
    useEffect(() => {
        // Extract values from existedNRC if present
        if (data.nrc) {
            const match = data.nrc.match(/^(\d+)\/(\w+)\((\w+)\)(\d+)$/);
            if (match) {
                if (NRCCodeSelect !== match[1]) setNRCCodeSelect(match[1]);
                if (NRCPlaceSelect !== match[2]) setNRCPlaceSelect(match[2]);
                if (NRCTypeSelect !== match[3]) setNRCTypeSelect(match[3]);
                if (NRCCode !== match[4]) setNRCCode(match[4]);
            }
        }
    }, [data.nrc]);

    const handleNRCFormUpdate = (nrcData: any) => {
        setData('nrc', nrcData);
    };
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Customers" />

                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="my-4">
                        <h1 className="text-2xl font-bold">Create New Customers</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customers Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Full name"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nrcNumber" className="text-sm font-bold">
                                        NRC
                                    </Label>
                                    <NRCForm
                                        NRCCodeSelect={NRCCodeSelect}
                                        setNRCCodeSelect={setNRCCodeSelect}
                                        NRCPlaceSelect={NRCPlaceSelect}
                                        setNRCPlaceSelect={setNRCPlaceSelect}
                                        NRCTypeSelect={NRCTypeSelect}
                                        setNRCTypeSelect={setNRCTypeSelect}
                                        NRCCode={NRCCode}
                                        setNRCCode={setNRCCode}
                                        language={'en'}
                                        onUpdate={handleNRCFormUpdate}
                                    />
                                    <InputError message={errors.nrc} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        disabled={processing}
                                        placeholder="Phone number"
                                    />
                                    <InputError message={errors.phone} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.date_of_birth} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender </Label>
                                    <Select
                                        value={data.gender ? String(data.gender) : undefined}
                                        onValueChange={(value) => setData('gender', value)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {gender.map((role) => (
                                                <SelectItem key={role} value={String(role).toLowerCase()}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.gender} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="occupation">Occupation </Label>
                                    <Input
                                        id="occupation"
                                        type="text"
                                        required
                                        value={data.occupation}
                                        onChange={(e) => setData('occupation', e.target.value)}
                                        disabled={processing}
                                        placeholder="Occupation ( Job )"
                                    />
                                    <InputError message={errors.occupation} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="monthly_income">Income (Monthly)</Label>

                                    <div className="relative">
                                        <Input
                                            id="monthly_income"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            required
                                            value={data.monthly_income}
                                            disabled={processing}
                                            placeholder="XXXXX"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setData('monthly_income', value);
                                            }}
                                            className="pr-14"
                                        />
                                        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
                                            MMK
                                        </span>
                                    </div>

                                    <InputError message={errors.monthly_income} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="branch">Branch</Label>

                                    <Select
                                        value={data.branch ? String(data.branch) : undefined}
                                        onValueChange={(value) => setData('branch', Number(value))}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select branch" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch.id} value={String(branch.id)}>
                                                    {branch.name} ({branch.location?.name})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.branch} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="creditlevel">Credit Level</Label>

                                    <Select
                                        value={data.creditlevel ? String(data.creditlevel) : undefined}
                                        onValueChange={(value) => setData('creditlevel', Number(value))}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {creditlevel.map((creditlevel) => (
                                                <SelectItem key={creditlevel.id} value={String(creditlevel.id)}>
                                                    {creditlevel.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.creditlevel} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="limit_expired_at">Limit Expire Date</Label>
                                    <Input
                                        id="limit_expired_at"
                                        type="date"
                                        value={data.limit_expired_at}
                                        onChange={(e) => setData('limit_expired_at', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.limit_expired_at} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="remark">Remark</Label>
                                    <Textarea
                                        id="remark"
                                        value={data.remark}
                                        onChange={(e) => setData('remark', e.target.value)}
                                        disabled={processing}
                                        rows={3}
                                    />
                                    <InputError message={errors.remark} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address" className="text-sm font-bold">
                                        Address
                                    </Label>
                                    <AddressForm
                                        region={region}
                                        setRegion={setRegion}
                                        district={district}
                                        setDistrict={setDistrict}
                                        township={township}
                                        setTownship={setTownship}
                                        onUpdate={(address) => setData('address', address)}
                                    />
                                    <InputError message={errors.address} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.visit(route('customers.index'))} disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Create Customer
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
