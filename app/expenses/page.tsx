'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Expense, ExpensePayment, Attendee } from '@/lib/types'
import ExpenseSummary from '@/components/expenses/ExpenseSummary'
import PersonalBalance from '@/components/expenses/PersonalBalance'
import ExpenseList from '@/components/expenses/ExpenseList'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [payments, setPayments] = useState<ExpensePayment[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [attendeeId, setAttendeeId] = useState<string | undefined>()

  const supabase = createClient()

  useEffect(() => {
    fetchData()
    // Get current user from session
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-session='))
    if (sessionData) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionData.split('=')[1]))
        setAttendeeId(session.attendeeId)
      } catch (e) {
        // Handle parsing error
      }
    }
  }, [])

  const fetchData = async () => {
    try {
      const [expensesResult, paymentsResult, attendeesResult] = await Promise.all([
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('expense_payments').select('*'),
        supabase.from('attendees').select('*').order('name')
      ])

      if (expensesResult.data) setExpenses(expensesResult.data)
      if (paymentsResult.data) setPayments(paymentsResult.data)
      if (attendeesResult.data) setAttendees(attendeesResult.data)
    } catch (error) {
      console.error('Error fetching expense data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expense information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <p className="mt-2 text-gray-600">
          Track shared expenses and see what you owe or are owed
        </p>
      </div>

      <ExpenseSummary 
        expenses={expenses} 
        payments={payments}
        currentUserId={attendeeId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseList 
            expenses={expenses}
            attendees={attendees}
            currentUserId={attendeeId}
          />
        </div>
        
        <div>
          {attendeeId && (
            <PersonalBalance 
              payments={payments}
              attendees={attendees}
              currentUserId={attendeeId}
            />
          )}
        </div>
      </div>
    </div>
  )
}