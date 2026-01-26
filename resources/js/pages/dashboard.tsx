import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title } from 'chart.js';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

interface Props {
    userRole: string;
    branches: { id: number; name: string }[];
    selectedBranch: number;
    forecast: { period: string; expected_amount: number }[];
    buckets: { bucket: string; amount: number }[];
    expected_inflow: number;
    expected_outflow: number;
}

export default function Dashboard({ userRole, branches, selectedBranch, forecast, buckets, expected_inflow, expected_outflow }: Props) {
    const [branchId, setBranchId] = useState<number>(selectedBranch);

    const totalForecast = forecast.reduce((sum, row) => sum + Number(row.expected_amount), 0);
    const totalBuckets = buckets.reduce((sum, b) => sum + Number(b.amount), 0);
    const net = Number(expected_inflow) - Number(expected_outflow);
    const healthy = net >= 0;

    // Handler to filter by branch
    const handleBranchChange = (value: string) => {
        const id = Number(value);
        setBranchId(id);

        // Reload dashboard with new branch
        router.get(route('dashboard'), { branch_id: id }, { preserveState: true, preserveScroll: true });
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Cash Flow Projection' },
        },
    };
    // Prepare data for Repayment Forecast chart
    const chartData = forecast.map((row) => ({
        month: row.period,
        amount: Number(row.expected_amount),
    }));
    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Finance Dashboard" />

            <div className="bg-background flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Finance Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Branch-level forecast, overdue risk, and cash position at a glance.</p>
                    </div>

                    {/* Branch Filter + Period (optional) */}
                    <div className="flex gap-3">
                        <div className="w-48">
                            <Select onValueChange={handleBranchChange} defaultValue={branchId.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((b) => (
                                        <SelectItem key={b.id} value={b.id.toString()}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Optional: time range filter for forecast */}
                        {/* 
        <div className="w-40">
          <Select onValueChange={handlePeriodChange} defaultValue={period}>
            <SelectTrigger>
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Next 3 months</SelectItem>
              <SelectItem value="6m">Next 6 months</SelectItem>
              <SelectItem value="12m">Next 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        */}
                    </div>
                </div>

                {/* Summary KPIs */}
                <section className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Expected Repayment</CardTitle>
                            <p className="text-muted-foreground text-xs">Sum of forecasted loan repayments in the selected period.</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{totalForecast.toLocaleString()} MMK</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Overdue</CardTitle>
                            <p className="text-muted-foreground text-xs">Outstanding overdue principal across risk buckets.</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-destructive text-2xl font-semibold">{totalBuckets.toLocaleString()} MMK</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Net Cash Position</CardTitle>
                            <p className="text-muted-foreground text-xs">Current cash available after expected inflows and outflows.</p>
                        </CardHeader>
                        <CardContent>
                            <p className={`('text-2xl font-semibold', healthy ? 'text-emerald-600' : 'text-destructive')`}>
                                {net.toLocaleString()} MMK
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Status: <span className={healthy ? 'text-emerald-600' : 'text-destructive'}>{healthy ? 'Healthy' : 'At risk'}</span>
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left (Forecast & Overdue) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Repayment Forecast */}
                        <Card>
                            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Repayment Forecast</CardTitle>
                                    <p className="text-muted-foreground text-xs">Expected monthly inflows from loan repayments.</p>
                                </div>
                                <Badge variant="secondary">Next {forecast.length} months</Badge>
                            </CardHeader>
                            <CardContent>
                                {/* Chart */}
                                <div className="h-[260px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toLocaleString()} MMK`} />
                                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} MMK`} />
                                            <Bar
                                                dataKey="amount"
                                                radius={[6, 6, 0, 0]}
                                                fill="#0F766E" // teal for inflows
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Table */}
                                <Table className="mt-4">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Month</TableHead>
                                            <TableHead className="text-right">Expected amount (MMK)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {forecast.map((f) => (
                                            <TableRow key={f.period}>
                                                <TableCell>{f.period}</TableCell>
                                                <TableCell className="text-right">{Number(f.expected_amount).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Overdue Risk Distribution */}
                        <Card>
                            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Overdue Risk Distribution</CardTitle>
                                    <p className="text-muted-foreground text-xs">Breakdown of overdue portfolio by risk bucket.</p>
                                </div>
                                <Badge variant="outline">Total {totalBuckets.toLocaleString()} MMK</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {buckets.map((b) => {
                                        const amount = Number(b.amount);
                                        const percent = totalBuckets > 0 ? Math.round((amount / totalBuckets) * 100) : 0;

                                        return (
                                            <div key={b.bucket} className="bg-muted/40 flex flex-col justify-between rounded-lg border p-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium">{b.bucket}</p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {percent}%
                                                    </Badge>
                                                </div>
                                                <div className="mt-2 space-y-2">
                                                    <p className="text-lg font-semibold">{amount.toLocaleString()} MMK</p>
                                                    <Progress value={percent} />
                                                    <p className="text-muted-foreground text-[11px]">Share of total overdue.</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right (Cash Projection) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Cash Projection</CardTitle>
                                    <p className="text-muted-foreground text-xs">Expected cash movement over the selected period.</p>
                                </div>
                                <Badge variant={healthy ? 'secondary' : 'destructive'}>{healthy ? 'Healthy' : 'Risk'}</Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-lg border bg-emerald-50/60 p-3">
                                        <p className="text-xs font-medium text-emerald-800">Expected inflow</p>
                                        <p className="mt-1 text-xl font-semibold text-emerald-700">{Number(expected_inflow).toLocaleString()} MMK</p>
                                        <p className="mt-1 text-[11px] text-emerald-900/70">Loan repayments.</p>
                                    </div>

                                    <div className="rounded-lg border bg-rose-50/70 p-3">
                                        <p className="text-xs font-medium text-rose-800">Expected outflow</p>
                                        <p className="mt-1 text-xl font-semibold text-rose-700">{Number(expected_outflow).toLocaleString()} MMK</p>
                                        <p className="mt-1 text-[11px] text-rose-900/70">Planned disbursements.</p>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg border p-3">
                                        <p className="text-muted-foreground text-xs font-medium">Net position</p>
                                        <p className={`('mt-1 text-xl font-semibold', healthy ? 'text-emerald-700' : 'text-destructive')`}>
                                            {(Number(expected_inflow) - Number(expected_outflow)).toLocaleString()} MMK
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-[11px]">Inflow − outflow.</p>
                                    </div>
                                </div>

                                {/* Optional: small trend hint */}
                                {/* 
            <p className="text-xs text-muted-foreground">
              Tip: A positive net position over consecutive months indicates a comfortable liquidity buffer.
            </p>
            */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
