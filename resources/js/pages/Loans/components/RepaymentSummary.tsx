import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RepaymentSummary({ loan }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Repayment Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4 text-sm">
                <div><strong>Total Loan:</strong> {loan.amount}</div>
                <div><strong>Paid:</strong> {loan.total_paid}</div>
                <div><strong>Outstanding:</strong> {loan.outstanding}</div>
                <div><strong>Status:</strong> {loan.status}</div>
            </CardContent>
        </Card>
    )
}
