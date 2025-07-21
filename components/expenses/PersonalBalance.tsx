import { ExpensePayment, Attendee } from '@/lib/types'

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
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Balance</h3>
      
      {/* Net balance */}
      <div className={`text-center p-6 rounded-lg mb-6 ${
        netBalance > 0 
          ? 'bg-green-50 border border-green-200' 
          : netBalance < 0 
            ? 'bg-red-50 border border-red-200'
            : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className={`text-3xl font-bold ${
          netBalance > 0 ? 'text-green-600' : netBalance < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
        </div>
        <p className={`text-sm mt-1 ${
          netBalance > 0 ? 'text-green-600' : netBalance < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {netBalance > 0 
            ? 'You are owed this amount' 
            : netBalance < 0 
              ? 'You owe this amount'
              : 'You\'re all settled up!'
          }
        </p>
      </div>

      {/* What you owe others */}
      {Object.keys(owedToOthers).length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">You Owe:</h4>
          <div className="space-y-3">
            {Object.entries(owedToOthers).map(([personId, amount]) => {
              const person = getAttendee(personId)
              if (!person) return null
              
              return (
                <div key={personId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{person.name}</p>
                      {person.venmo_handle && (
                        <p className="text-xs text-gray-600">Venmo: {person.venmo_handle}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">${amount.toFixed(2)}</div>
                    {person.venmo_handle && (
                      <button
                        onClick={() => navigator.clipboard.writeText(person.venmo_handle!)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        Copy Venmo
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* What others owe you */}
      {Object.keys(owedByOthers).length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Others Owe You:</h4>
          <div className="space-y-3">
            {Object.entries(owedByOthers).map(([personId, amount]) => {
              const person = getAttendee(personId)
              if (!person) return null
              
              return (
                <div key={personId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{person.name}</p>
                  </div>
                  <div className="text-lg font-bold text-green-600">${amount.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {totalOwed === 0 && totalOwedToUser === 0 && (
        <div className="text-center py-6">
          <span className="text-6xl">✅</span>
          <p className="text-gray-600 mt-2">No outstanding balances</p>
        </div>
      )}
    </div>
  )
}