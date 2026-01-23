import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

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
            <div className="space-y-6">
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
                    <div className="flex gap-2">
                        <Button onClick={() => router.get(route('loans.approve', loan.id))}>Approve Loan</Button>
                    </div>
                )}

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
                                    <TableHead>Principal</TableHead>
                                    <TableHead>Interest</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Paid</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loan.schedules.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.installment_no}</TableCell>
                                        <TableCell>{row.due_date}</TableCell>
                                        <TableCell>{row.principal_due}</TableCell>
                                        <TableCell>{row.interest_due}</TableCell>
                                        <TableCell>{row.total_due}</TableCell>
                                        <TableCell>{row.paid_amount}</TableCell>
                                        <TableCell>
                                            <Badge variant={row.status === 'paid' ? 'success' : 'secondary'}>{row.status}</Badge>
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
