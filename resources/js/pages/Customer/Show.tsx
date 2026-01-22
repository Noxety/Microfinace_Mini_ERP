import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
type Props = {
    customer: any;
};

export default function CustomersShow({ customer }: Props) {
    const address = customer.addresses?.[0];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Customers', href: '/customers' },
        { title: 'View Customer', href: `/customers/${customer.id}` },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Details" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{customer.name}</h1>
                        <p className="text-muted-foreground text-sm">Customer No: {customer.customer_no}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.visit(route('customers.edit', customer.id))}>
                            Edit
                        </Button>
                        <Button variant="secondary" onClick={() => router.visit(route('customers.index'))}>
                            Back
                        </Button>
                    </div>
                </div>

                {/* Customer Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <Info label="NRC" value={customer.nrc} />
                        <Info label="Gender" value={customer.gender} />
                        <Info label="Phone" value={customer.phone} />
                        <Info label="Email" value={customer.email ?? '-'} />
                        <Info label="Date of Birth" value={customer.dob} />
                        <Info label="Occupation" value={customer.occupation} />
                        <Info label="Monthly Income" value={`${customer.monthly_income} MMK`} />
                        <Info label="Remark" value={customer.remark ?? '-'} />
                    </CardContent>
                </Card>

                {/* Credit Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Credit Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <Info label="Credit Level" value={customer.credit_level?.name} />
                        <Info label="Limit Expired At" value={customer.limit_expired_at} />
                        <Info label="Branch" value={`${customer.branch?.name} (${customer.branch?.location?.name})`} />
                        <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge variant="outline">Active</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p>{address?.address_line ?? '-'}</p>
                        <p className="text-muted-foreground">
                            {address?.township}, {address?.district}, {address?.region}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

/* Small reusable component */
function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium">{value || '-'}</p>
        </div>
    );
}
