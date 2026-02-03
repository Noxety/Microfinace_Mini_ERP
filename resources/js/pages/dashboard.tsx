import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    userRole: string;
    canViewAllBranches: boolean;
    branches: { id: number; name: string }[];
    selectedBranch: number | null;
    forecast: { period: string; expected_amount: number }[];
    buckets: { bucket: string; bucket_key: string; amount: number }[];
    expected_inflow: number;
    expected_outflow: number;
    active_loans_count: number;
    approved_pending_count: number;
    branch_balance: number;
}

function formatPeriod(period: string): string {
    if (!period || period.length < 7) return period;
    const [y, m] = period.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(m, 10) - 1;
    return `${months[monthIndex] ?? m} ${y}`;
}

export default function Dashboard({
    canViewAllBranches,
    branches,
    selectedBranch,
    forecast,
    buckets,
    expected_inflow,
    expected_outflow,
    active_loans_count = 0,
    approved_pending_count = 0,
    branch_balance,
}: Props) {
    const lowThreshold = 1_000_000

    const status = branch_balance < 0
        ? 'danger'
        : branch_balance < lowThreshold
            ? 'warning'
            : 'healthy'

    const meta = {
        healthy: {
            label: 'Healthy',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
            icon: TrendingUp,
            badge: 'secondary',
        },
        warning: {
            label: 'Low Balance',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50 dark:bg-yellow-950/20',
            icon: AlertTriangle,
            badge: 'outline',
        },
        danger: {
            label: 'Negative Balance',
            color: 'text-red-600',
            bg: 'bg-red-50 dark:bg-red-950/20',
            icon: AlertTriangle,
            badge: 'destructive',
        },
    }[status]

    const Icon = meta.icon
    const [branchId, setBranchId] = useState<number | null>(selectedBranch);

    const totalForecast = forecast.reduce((sum, row) => sum + Number(row.expected_amount), 0);
    const totalBuckets = buckets.reduce((sum, b) => sum + Number(b.amount), 0);
    const net = Number(expected_inflow) - Number(expected_outflow);
    const healthy = net >= 0;
    const hasForecast = forecast.length > 0;
    const hasOverdue = totalBuckets > 0;

    const handleBranchChange = (value: string) => {
        const id = value === 'all' ? null : Number(value);
        setBranchId(id);
        router.get(route('dashboard'), id !== null ? { branch_id: id } : {}, { preserveState: true, preserveScroll: true });
    };

    const chartData = forecast.map((row) => ({
        month: formatPeriod(row.period),
        amount: Number(row.expected_amount),
    }));
    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Finance Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-background p-4 sm:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Finance Dashboard</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {canViewAllBranches && branchId === null
                                ? 'Overview across all branches.'
                                : `Branch: ${branches.find((b) => b.id === branchId)?.name ?? 'All'} — forecast, overdue risk, and cash position.`}
                        </p>
                    </div>

                    {/* Branch filter: admin/manager see all branches; others see current branch only */}
                    <div className="flex gap-3">
                        {canViewAllBranches ? (
                            <div className="w-48">
                                <Select onValueChange={handleBranchChange} value={branchId === null ? 'all' : branchId.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Branches</SelectItem>
                                        {branches.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="text-muted-foreground flex items-center text-sm">
                                Branch: {branches.find((b) => b.id === branchId)?.name ?? '—'}
                            </div>
                        )}

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
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-emerald-200/50 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Expected Repayment</CardTitle>
                            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">Forecasted repayments (next months)</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{totalForecast.toLocaleString()} MMK</p>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-200/50 bg-rose-50/30 dark:border-rose-900/30 dark:bg-rose-950/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-rose-800 dark:text-rose-200">Total Overdue</CardTitle>
                            <p className="text-xs text-rose-700/80 dark:text-rose-300/80">Outstanding overdue amount</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{totalBuckets.toLocaleString()} MMK</p>
                        </CardContent>
                    </Card>

                    <Card className={healthy ? 'border-emerald-200/50 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/20' : 'border-rose-200/50 bg-rose-50/30 dark:border-rose-900/30 dark:bg-rose-950/20'}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Net Cash Position</CardTitle>
                            <p className="text-xs text-muted-foreground">Inflow − planned outflow (90 days)</p>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${healthy ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                                {net.toLocaleString()} MMK
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Status: <span className={healthy ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'font-medium text-rose-600 dark:text-rose-400'}>{healthy ? 'Healthy' : 'At risk'}</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Loan Summary</CardTitle>
                            <p className="text-xs text-muted-foreground">Active and pending</p>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <p className="text-lg font-semibold">{active_loans_count} active</p>
                            <p className="text-sm text-muted-foreground">{approved_pending_count} approved (pending disbursement)</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Repayment Forecast */}
                        <Card>
                            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Repayment Forecast</CardTitle>
                                    <p className="text-xs text-muted-foreground">Expected monthly inflows from loan repayments (disbursed loans)</p>
                                </div>
                                {hasForecast && <Badge variant="secondary">Next {forecast.length} months</Badge>}
                            </CardHeader>
                            <CardContent>
                                {hasForecast ? (
                                    <>
                                        <div className="h-[260px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v).toLocaleString()}`} />
                                                    <Tooltip formatter={(v: number) => [`${Number(v).toLocaleString()} MMK`, 'Expected']} />
                                                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#0F766E" name="MMK" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <Table className="mt-4">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Month</TableHead>
                                                    <TableHead className="text-right">Expected (MMK)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {forecast.map((f) => (
                                                    <TableRow key={f.period}>
                                                        <TableCell>{formatPeriod(f.period)}</TableCell>
                                                        <TableCell className="text-right">{Number(f.expected_amount).toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                                        <p className="text-sm font-medium">No forecast data</p>
                                        <p className="mt-1 text-xs">Disbursed loans with upcoming repayments will appear here.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Overdue Risk Distribution */}
                        <Card>
                            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Overdue Risk Distribution</CardTitle>
                                    <p className="text-xs text-muted-foreground">Outstanding overdue by days past due</p>
                                </div>
                                {hasOverdue && <Badge variant="outline">Total {totalBuckets.toLocaleString()} MMK</Badge>}
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {buckets.map((b) => {
                                        const amount = Number(b.amount);
                                        const percent = totalBuckets > 0 ? Math.round((amount / totalBuckets) * 100) : 0;
                                        return (
                                            <div key={b.bucket_key} className="flex flex-col justify-between rounded-lg border bg-muted/30 p-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium">{b.bucket}</p>
                                                    <Badge variant="outline" className="text-xs">{percent}%</Badge>
                                                </div>
                                                <div className="mt-2 space-y-2">
                                                    <p className="text-lg font-semibold">{amount.toLocaleString()} MMK</p>
                                                    <Progress value={percent} className="h-2" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        {branch_balance !== null && (
                            <>
                                <Card className={` ${meta.bg}`}>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-sm font-medium">Branch Cash Balance</CardTitle>
                                        <Badge variant={meta.badge as any}>{meta.label}</Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-full p-2 ${meta.bg}`}>
                                                <Icon className={`h-5 w-5 ${meta.color}`} />
                                            </div>
                                            <p className={`text-xl font-bold ${meta.color}`}>
                                                {branch_balance?.toLocaleString()} MMK
                                            </p>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Calculated from cash ledger inflows and outflows
                                        </p>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        <Card>
                            <CardHeader className="flex items-center justify-between pb-2">
                                <CardTitle className="text-base">Cash Projection</CardTitle>
                                <Badge variant={healthy ? 'secondary' : 'destructive'}>{healthy ? 'Healthy' : 'At risk'}</Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3 dark:border-emerald-800/40 dark:bg-emerald-950/30">
                                        <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">Expected inflow (90 days)</p>
                                        <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">{Number(expected_inflow).toLocaleString()} MMK</p>
                                        <p className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-400/80">Loan repayments due</p>
                                    </div>
                                    <div className="rounded-lg border border-rose-200/60 bg-rose-50/50 p-3 dark:border-rose-800/40 dark:bg-rose-950/30">
                                        <p className="text-xs font-medium text-rose-800 dark:text-rose-200">Expected outflow</p>
                                        <p className="mt-1 text-xl font-bold text-rose-700 dark:text-rose-300">{Number(expected_outflow).toLocaleString()} MMK</p>
                                        <p className="mt-0.5 text-xs text-rose-700/80 dark:text-rose-400/80">Approved, not yet disbursed</p>
                                    </div>
                                    <div className={`rounded-lg border p-3 ${healthy ? 'border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-800/30 dark:bg-emerald-950/20' : 'border-rose-200/60 bg-rose-50/30 dark:border-rose-800/30 dark:bg-rose-950/20'}`}>
                                        <p className="text-xs font-medium text-muted-foreground">Net position</p>
                                        <p className={`mt-1 text-xl font-bold ${healthy ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                                            {(Number(expected_inflow) - Number(expected_outflow)).toLocaleString()} MMK
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">A positive net position indicates sufficient liquidity for planned disbursements.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
