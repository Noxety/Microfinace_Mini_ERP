import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import DisburseLoanDialog from './components/DisburseLoanDialog';
import PayInstallmentDialog from './components/PayInstallmentDialog';

export default function LoanShow({ loan }) {
    const statusColor =
        {
            pending: 'secondary',
            approved: 'success',
            disbursed: 'primary',
            closed: 'outline',
        }[loan.status] ?? 'secondary';

    console.log(loan);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Loans',
            href: '/loans',
        },
        {
            title: 'Loans Details ' + loan.loan_no,
            href: '/loans ' + loan.id,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loans Detail" />
            <div className="space-y-6 p-4">
                {/* Loan Summary */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Loan Summary</CardTitle>
                        <Badge variant={statusColor}>{loan.status}</Badge>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div>
                            <p className="text-muted-foreground">Loan No</p>
                            <p className="font-medium">{loan.loan_no}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Customer</p>
                            <p className="font-medium">{loan.customer.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Branch</p>
                            <p className="font-medium">{loan.branch?.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Principal</p>
                            <p className="font-medium">{loan.principal_amount}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Interest Rate</p>
                            <p className="font-medium">{loan.interest_rate}%</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Term</p>
                            <p className="font-medium">{loan.term} months</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{loan.start_date}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p className="font-medium">{loan.creator?.name}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                {loan.status === 'pending' && (
                    <div className="flex gap-2 justify-end">
                        <Button onClick={() => router.get(route('loans.approve', loan.id))}>Approve Loan</Button>
                    </div>
                )}
                {loan.status === 'approved' && <DisburseLoanDialog loan={loan} />}
                {loan.status === 'disbursed' && <span className="text-muted-foreground text-sm">Disbursed on {loan.disbursed_at}</span>}
                {/* Repayment Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle>Repayment Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Paid</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loan.schedules.map((s: any) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.installment_no}</TableCell>
                                        <TableCell>{s.due_date}</TableCell>
                                        <TableCell>{s.total_due.toLocaleString()}</TableCell>
                                        <TableCell>{s.paid_amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={s.status === 'paid' ? 'success' : s.status === 'overdue' ? 'destructive' : 'secondary'}>
                                                {s.status} {s.overdue_days > 0 && <Badge variant="destructive">{s.overdue_days} days overdue</Badge>}{' '}
                                                {s.penalty_amount > 0 && (
                                                    <p className="text-xs text-red-600">Penalty: {s.penalty_amount.toLocaleString()} MMK</p>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {loan.status === 'disbursed' && s.status !== 'paid' && <PayInstallmentDialog schedule={s} />}
                                        </TableCell>
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
