import { Expense, Attendee } from '@/lib/types'

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

  const categoryIcons: { [key: string]: string } = {
    'Accommodation': '🏨',
    'Food': '🍽️',
    'Activities': '🎯',
    'Transportation': '🚗',
    'Other': '📝'
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-center py-8">
          <span className="text-6xl">💰</span>
          <h3 className="text-lg font-medium text-gray-900 mt-4">No Expenses Yet</h3>
          <p className="text-gray-500 mt-2">Expenses will appear here as they&apos;re added</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => (
        <div key={category} className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">{categoryIcons[category] || '📝'}</span>
              {category}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({categoryExpenses.length} expense{categoryExpenses.length !== 1 ? 's' : ''})
              </span>
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {categoryExpenses.map((expense) => {
              const paidBy = getAttendee(expense.paid_by_id)
              const userShare = calculateUserShare(expense)
              const isUserPayer = expense.paid_by_id === currentUserId
              const splitCount = expense.split_between_ids.length
              
              return (
                <div key={expense.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{expense.title}</h4>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>Paid by {paidBy?.name || 'Unknown'}</p>
                        <p>Split {splitCount} way{splitCount !== 1 ? 's' : ''} ({expense.split_type})</p>
                      </div>
                      {expense.notes && (
                        <p className="mt-2 text-sm text-gray-500">{expense.notes}</p>
                      )}
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-gray-900">
                        ${expense.total_amount.toFixed(2)}
                      </div>
                      {currentUserId && expense.split_between_ids.includes(currentUserId) && (
                        <div className={`text-sm mt-1 ${
                          isUserPayer ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isUserPayer 
                            ? `+$${(expense.total_amount - userShare).toFixed(2)} (you're owed)`
                            : `-$${userShare.toFixed(2)} (your share)`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Show who's splitting this expense */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {expense.split_between_ids.map(attendeeId => {
                      const attendee = getAttendee(attendeeId)
                      if (!attendee) return null
                      
                      return (
                        <span
                          key={attendeeId}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            attendeeId === currentUserId
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {attendee.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}