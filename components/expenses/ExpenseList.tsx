import { Expense, Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material'
import { AttachMoney, Hotel, Restaurant, DirectionsCar, SportsGolf, Description } from '@mui/icons-material'

interface ExpenseListProps {
  expenses: Expense[]
  attendees: Attendee[]
  currentUserId?: string
}

export default function ExpenseList({ expenses, attendees, currentUserId }: ExpenseListProps) {
  const getAttendee = (attendeeId: string) => {
    return attendees.find(a => a.id === attendeeId)
  }

  const calculateUserShare = (expense: Expense) => {
    if (!currentUserId || !expense.split_between_ids.includes(currentUserId)) {
      return 0
    }
    
    if (expense.split_type === 'equal') {
      return expense.total_amount / expense.split_between_ids.length
    }
    
    // For custom splits, we'd need additional data structure
    // For now, default to equal split
    return expense.total_amount / expense.split_between_ids.length
  }

  const groupedExpenses = expenses.reduce((groups, expense) => {
    const category = expense.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(expense)
    return groups
  }, {} as { [key: string]: Expense[] })

  const categoryIcons: { [key: string]: any } = {
    'Accommodation': <Hotel />,
    'Food': <Restaurant />,
    'Activities': <SportsGolf />,
    'Transportation': <DirectionsCar />,
    'Other': <Description />
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AttachMoney sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              No Expenses Yet
            </Typography>
            <Typography color="text.secondary">
              Expenses will appear here as they're added
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => (
        <Card key={category}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                {categoryIcons[category] || <Description />}
                {category}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({categoryExpenses.length} expense{categoryExpenses.length !== 1 ? 's' : ''})
                </Typography>
              </Typography>
            </Box>
            
            <Box>
              {categoryExpenses.map((expense, index) => {
                const paidBy = getAttendee(expense.paid_by_id)
                const userShare = calculateUserShare(expense)
                const isUserPayer = expense.paid_by_id === currentUserId
                const splitCount = expense.split_between_ids.length
                
                return (
                  <Box key={expense.id}>
                    <Box sx={{ px: 3, py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {expense.title}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Paid by {paidBy?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Split {splitCount} way{splitCount !== 1 ? 's' : ''} ({expense.split_type})
                            </Typography>
                          </Box>
                          {expense.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {expense.notes}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            ${expense.total_amount.toFixed(2)}
                          </Typography>
                          {currentUserId && expense.split_between_ids.includes(currentUserId) && (
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 0.5,
                                color: isUserPayer ? 'success.main' : 'error.main',
                                fontWeight: 500
                              }}
                            >
                              {isUserPayer 
                                ? `+$${(expense.total_amount - userShare).toFixed(2)} (you're owed)`
                                : `-$${userShare.toFixed(2)} (your share)`
                              }
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Show who's splitting this expense */}
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {expense.split_between_ids.map(attendeeId => {
                          const attendee = getAttendee(attendeeId)
                          if (!attendee) return null
                          
                          return (
                            <Chip
                              key={attendeeId}
                              label={attendee.name}
                              size="small"
                              color={attendeeId === currentUserId ? 'primary' : 'default'}
                              variant={attendeeId === currentUserId ? 'filled' : 'outlined'}
                            />
                          )
                        })}
                      </Box>
                    </Box>
                    {index < categoryExpenses.length - 1 && <Divider />}
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}