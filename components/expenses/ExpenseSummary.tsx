import { Expense, ExpensePayment } from '@/lib/types'

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
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Summary</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-blue-600">Total Expenses</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
          <div className="text-sm text-green-600">Settled</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">${totalOutstanding.toFixed(2)}</div>
          <div className="text-sm text-yellow-600">Outstanding</div>
        </div>
        
        {currentUserId && (
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">${userShare.toFixed(2)}</div>
            <div className="text-sm text-purple-600">Your Share</div>
          </div>
        )}
      </div>

      {currentUserId && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">You Paid</h4>
              <div className="text-lg font-semibold text-green-600">${userPaidAmount.toFixed(2)}</div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Your Total Share</h4>
              <div className="text-lg font-semibold text-blue-600">${userShare.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              {userPaidAmount > userShare ? (
                <span className="text-green-600 font-medium">
                  ✅ You&apos;re owed ${(userPaidAmount - userShare).toFixed(2)}
                </span>
              ) : userPaidAmount < userShare ? (
                <span className="text-red-600 font-medium">
                  💳 You owe ${(userShare - userPaidAmount).toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-600 font-medium">
                  ⚖️ You&apos;re all settled up
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}