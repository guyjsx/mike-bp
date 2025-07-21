import { ExpensePayment, Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Avatar, Button, Alert } from '@mui/material'
import { AccountBalance, TrendingUp, TrendingDown, CheckCircle, ContentCopy } from '@mui/icons-material'

interface PersonalBalanceProps {
  payments: ExpensePayment[]
  attendees: Attendee[]
  currentUserId: string
}

export default function PersonalBalance({ payments, attendees, currentUserId }: PersonalBalanceProps) {
  // Calculate what the user owes to each person
  const owedToOthers = payments
    .filter(p => p.from_attendee_id === currentUserId && !p.is_paid)
    .reduce((balances, payment) => {
      const toPersonId = payment.to_attendee_id
      if (!balances[toPersonId]) {
        balances[toPersonId] = 0
      }
      balances[toPersonId] += Number(payment.amount)
      return balances
    }, {} as { [key: string]: number })

  // Calculate what others owe the user
  const owedByOthers = payments
    .filter(p => p.to_attendee_id === currentUserId && !p.is_paid)
    .reduce((balances, payment) => {
      const fromPersonId = payment.from_attendee_id
      if (!balances[fromPersonId]) {
        balances[fromPersonId] = 0
      }
      balances[fromPersonId] += Number(payment.amount)
      return balances
    }, {} as { [key: string]: number })

  const totalOwed = Object.values(owedToOthers).reduce((sum, amount) => sum + amount, 0)
  const totalOwedToUser = Object.values(owedByOthers).reduce((sum, amount) => sum + amount, 0)
  const netBalance = totalOwedToUser - totalOwed

  const getAttendee = (attendeeId: string) => {
    return attendees.find(a => a.id === attendeeId)
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AccountBalance sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Your Balance
          </Typography>
        </Box>
        
        {/* Net balance */}
        <Alert
          severity={netBalance > 0 ? 'success' : netBalance < 0 ? 'error' : 'info'}
          icon={netBalance > 0 ? <TrendingUp /> : netBalance < 0 ? <TrendingDown /> : <CheckCircle />}
          sx={{ mb: 3 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
            </Typography>
            <Typography variant="body2">
              {netBalance > 0 
                ? 'You are owed this amount' 
                : netBalance < 0 
                  ? 'You owe this amount'
                  : 'You\'re all settled up!'
              }
            </Typography>
          </Box>
        </Alert>

        {/* What you owe others */}
        {Object.keys(owedToOthers).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
              You Owe:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(owedToOthers).map(([personId, amount]) => {
                const person = getAttendee(personId)
                if (!person) return null
                
                return (
                  <Card key={personId} sx={{ bgcolor: 'error.50', border: 1, borderColor: 'error.200' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'error.light', color: 'error.contrastText', width: 32, height: 32 }}>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {person.name}
                            </Typography>
                            {person.venmo_handle && (
                              <Typography variant="caption" color="text.secondary">
                                Venmo: {person.venmo_handle}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                            ${amount.toFixed(2)}
                          </Typography>
                          {person.venmo_handle && (
                            <Button
                              size="small"
                              startIcon={<ContentCopy />}
                              onClick={() => navigator.clipboard.writeText(person.venmo_handle!)}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Copy Venmo
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Box>
        )}

        {/* What others owe you */}
        {Object.keys(owedByOthers).length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
              Others Owe You:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(owedByOthers).map(([personId, amount]) => {
                const person = getAttendee(personId)
                if (!person) return null
                
                return (
                  <Card key={personId} sx={{ bgcolor: 'success.50', border: 1, borderColor: 'success.200' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'success.light', color: 'success.contrastText', width: 32, height: 32 }}>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {person.name}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                          ${amount.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Box>
        )}

        {totalOwed === 0 && totalOwedToUser === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography color="text.secondary">
              No outstanding balances
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}