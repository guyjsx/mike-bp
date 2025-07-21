import { Expense, ExpensePayment } from '@/lib/types'
import { Card, CardContent, Typography, Box, Grid, Alert } from '@mui/material'
import { AttachMoney, CheckCircle, Schedule, Person, AccountBalance, CreditCard } from '@mui/icons-material'

interface ExpenseSummaryProps {
  expenses: Expense[]
  payments: ExpensePayment[]
  currentUserId?: string
}

export default function ExpenseSummary({ expenses, payments, currentUserId }: ExpenseSummaryProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.total_amount), 0)
  const totalPaid = payments.filter(p => p.is_paid).reduce((sum, payment) => sum + Number(payment.amount), 0)
  const totalOutstanding = payments.filter(p => !p.is_paid).reduce((sum, payment) => sum + Number(payment.amount), 0)
  
  const userPaidAmount = expenses
    .filter(e => e.paid_by_id === currentUserId)
    .reduce((sum, expense) => sum + Number(expense.total_amount), 0)
  
  const userShare = expenses
    .filter(e => currentUserId && e.split_between_ids.includes(currentUserId))
    .reduce((sum, expense) => {
      const share = Number(expense.total_amount) / expense.split_between_ids.length
      return sum + share
    }, 0)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AttachMoney sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Expense Summary
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50' }}>
              <AttachMoney sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ${totalExpenses.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="primary.main">
                Total Expenses
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50' }}>
              <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                ${totalPaid.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="success.main">
                Settled
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50' }}>
              <Schedule sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                ${totalOutstanding.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="warning.main">
                Outstanding
              </Typography>
            </Card>
          </Grid>
          
          {currentUserId && (
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.50' }}>
                <Person sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  ${userShare.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="secondary.main">
                  Your Share
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>

        {currentUserId && (
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CreditCard sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    You Paid
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  ${userPaidAmount.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccountBalance sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Your Total Share
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ${userShare.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            
            <Alert
              severity={userPaidAmount > userShare ? 'success' : userPaidAmount < userShare ? 'warning' : 'info'}
              icon={userPaidAmount > userShare ? <CheckCircle /> : userPaidAmount < userShare ? <CreditCard /> : <AccountBalance />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {userPaidAmount > userShare ? (
                  `You're owed $${(userPaidAmount - userShare).toFixed(2)}`
                ) : userPaidAmount < userShare ? (
                  `You owe $${(userShare - userPaidAmount).toFixed(2)}`
                ) : (
                  'You\'re all settled up'
                )}
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}