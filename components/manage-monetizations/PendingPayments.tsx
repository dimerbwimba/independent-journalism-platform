'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface PendingPayout {
  id: string
  paypalEmail: string | null
  fullName: string | null
  pendingPayout: number
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

interface Props {
  payouts: PendingPayout[]
}

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed'

interface PaymentState {
  status: PaymentStatus
  message?: string
}

export default function PendingPayments({ payouts }: Props) {
  const [paymentStates, setPaymentStates] = useState<Record<string, PaymentState>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleProcessPayment = async (id: string) => {
    if (!confirm('Are you sure you want to process this payment?')) return

    setIsProcessing(true)
    setSelectedId(id)
    setPaymentStates(prev => ({
      ...prev,
      [id]: { status: 'processing', message: 'Processing payment...' }
    }))
    
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (!response.ok) throw new Error('Failed to process payment')

      const data = await response.json()
      setPaymentStates(prev => ({
        ...prev,
        [id]: { 
          status: 'success',
          message: `Payment processed successfully. Transaction ID: ${data.result.payout.id}`
        }
      }))

      // Reload after 2 seconds to show success state
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error processing payment:', error)
      setPaymentStates(prev => ({
        ...prev,
        [id]: { 
          status: 'failed',
          message: 'Payment processing failed. Please try again.'
        }
      }))
    } finally {
      setIsProcessing(false)
      setSelectedId(null)
    }
  }

  const handleConfirmFailure = async (id: string, reason: string) => {
    try {
      const response = await fetch('/api/payments/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      })

      if (!response.ok) throw new Error('Failed to mark payment as failed')

      setPaymentStates(prev => ({
        ...prev,
        [id]: { 
          status: 'failed',
          message: `Payment marked as failed: ${reason}`
        }
      }))

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error marking payment as failed:', error)
      alert('Failed to update payment status')
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="divide-y divide-gray-100">
        {payouts.map((payout) => (
          <div key={payout.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {payout.user.image ? (
                  <Image
                    src={payout.user.image}
                    alt={payout.user.name || ''}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {payout.user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {payout.fullName || payout.user.name}
                  </h4>
                  <p className="text-sm text-gray-500">{payout.paypalEmail}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  ${payout.pendingPayout.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Pending Payout</p>
              </div>
            </div>

            {/* Payment Status and Actions */}
            <div className="mt-4">
              {paymentStates[payout.id]?.status === 'processing' && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <p className="text-sm text-yellow-700">
                      {paymentStates[payout.id].message}
                    </p>
                  </div>
                </div>
              )}

              {paymentStates[payout.id]?.status === 'success' && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-sm text-green-700">
                      {paymentStates[payout.id].message}
                    </p>
                  </div>
                </div>
              )}

              {paymentStates[payout.id]?.status === 'failed' && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">
                      {paymentStates[payout.id].message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {!paymentStates[payout.id]?.status && (
                  <>
                    <button
                      onClick={() => handleProcessPayment(payout.id)}
                      disabled={isProcessing && selectedId === payout.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <BanknotesIcon className="h-4 w-4 mr-1.5" />
                      Process Payment
                    </button>
                    <button
                      onClick={() => {
                        const reason = window.prompt('Please provide a reason for payment failure:')
                        if (reason) handleConfirmFailure(payout.id, reason)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircleIcon className="h-4 w-4 mr-1.5" />
                      Mark as Failed
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {payouts.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Pending Payments</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no payments waiting to be processed
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 