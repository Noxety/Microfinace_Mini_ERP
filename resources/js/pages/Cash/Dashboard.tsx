import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
export default function CashDashboard() {
    const { ledgers, branches, filters, totals } = usePage().props as any;
    console.log(totals);

    function updateFilter(key: string, value: any) {
        router.get(route('cash.dashboard'), { ...filters, [key]: value }, { preserveState: true });
    }
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Loan Cash Dashboard',
            href: '/cash-dashboard',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loan Cash Dashboard" />
            <div className="space-y-6 p-4">
                {/* Totals */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Inflow</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold text-emerald-500">{parseFloat(totals.inflow).toLocaleString()}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Outflow</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold text-rose-600">{parseFloat(totals.outflow).toLocaleString()}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">{totals.balance.toLocaleString()}</CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Select value={filters.branch_id ?? ''} onValueChange={(v) => updateFilter('branch_id', v || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Branches" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">All Branches</SelectItem>
                                {branches.map((b: any) => (
                                    <SelectItem key={b.id} value={String(b.id)}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filters.type ?? ''} onValueChange={(v) => updateFilter('type', v || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">All</SelectItem>
                                <SelectItem value="inflow">Inflow</SelectItem>
                                <SelectItem value="outflow">Outflow</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input type="date" value={filters.from_date ?? ''} onChange={(e) => updateFilter('from_date', e.target.value)} />

                        <Input type="date" value={filters.to_date ?? ''} onChange={(e) => updateFilter('to_date', e.target.value)} />
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cash Ledger</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-end">Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledgers.data.map((row: any) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{dayjs(row.transaction_date).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell>{row.branch.name}</TableCell>
                                        <TableCell>
                                            <span
                                                className={row.type === 'inflow' ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}
                                            >
                                                {row.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">{row.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-end">{row.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
