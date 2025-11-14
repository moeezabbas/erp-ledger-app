'use client'
import { useState } from 'react'
import { useLedger } from '@/contexts/LedgerContext'
import { Plus, Search, Filter } from 'lucide-react'

export default function Transactions() {
  const {
    transactions,
    selectedCustomer,
    loading,
    createTransaction
  } = useLedger()

  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    item: '',
    weightQty: '',
    rate: '',
    transactionType: 'Sale',
    paymentMethod: 'Cash',
    bankName: '',
    chequeNo: '',
    drCr: 'Debit',
    amount: ''
  })

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!selectedCustomer) {
      alert('Please select a customer first')
      return
    }

    const transactionData = {
      ...newTransaction,
      customerName: selectedCustomer.name,
      amount: newTransaction.amount || calculateAmount()
    }

    const success = await createTransaction(transactionData)
    if (success) {
      setShowAddTransaction(false)
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        item: '',
        weightQty: '',
        rate: '',
        transactionType: 'Sale',
        paymentMethod: 'Cash',
        bankName: '',
        chequeNo: '',
        drCr: 'Debit',
        amount: ''
      })
    }
  }

  const calculateAmount = () => {
    const weight = parseFloat(newTransaction.weightQty) || 0
    const rate = parseFloat(newTransaction.rate) || 0
    return (weight * rate).toFixed(2)
  }

  const items = [
    'Chilled Gots', 'Chilled Scrape', 'Guides', 'Chilled Rolls',
    'Fire Bricks', 'H Oil', 'Magnese', 'Chrome',
    'Black Scrape', 'White Scrape', 'Toka Scrape', 'Pig Scrape'
  ]

  if (!selectedCustomer) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-gray-600">Please select a customer to view transactions</h2>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">{selectedCustomer.name}</p>
        </div>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Customer Summary */}
      {selectedCustomer.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <p className="text-sm text-gray-600">Total Debit</p>
            <p className="text-xl font-bold text-red-600">
              Rs. {selectedCustomer.summary.totalDebit?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <p className="text-sm text-gray-600">Total Credit</p>
            <p className="text-xl font-bold text-green-600">
              Rs. {selectedCustomer.summary.totalCredit?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <p className="text-sm text-gray-600">Final Balance</p>
            <p className="text-xl font-bold text-blue-600">
              Rs. {selectedCustomer.summary.finalBalance?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-xl font-bold ${
              selectedCustomer.summary.finalDRCR === 'DR' ? 'text-red-600' : 'text-green-600'
            }`}>
              {selectedCustomer.summary.finalDRCR}
            </p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.N</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight/Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DR/CR</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.sn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.weightQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {transaction.debit ? `Rs. ${parseFloat(transaction.debit).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {transaction.credit ? `Rs. ${parseFloat(transaction.credit).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    Rs. {parseFloat(transaction.balance).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.drCr === 'DR' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.drCr}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    required
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item</label>
                  <select
                    value={newTransaction.item}
                    onChange={(e) => setNewTransaction({...newTransaction, item: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Item</option>
                    {items.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight/Qty</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.weightQty}
                    onChange={(e) => setNewTransaction({...newTransaction, weightQty: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.rate}
                    onChange={(e) => setNewTransaction({...newTransaction, rate: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                  <select
                    value={newTransaction.transactionType}
                    onChange={(e) => setNewTransaction({...newTransaction, transactionType: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Payment Received - Cash">Payment Received - Cash</option>
                    <option value="Payment Received - Bank">Payment Received - Bank</option>
                    <option value="Payment Given - Cash">Payment Given - Cash</option>
                    <option value="Payment Given - Bank">Payment Given - Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    value={newTransaction.paymentMethod}
                    onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Jazzcash">Jazzcash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    value={newTransaction.bankName}
                    onChange={(e) => setNewTransaction({...newTransaction, bankName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cheque Number</label>
                  <input
                    type="text"
                    value={newTransaction.chequeNo}
                    onChange={(e) => setNewTransaction({...newTransaction, chequeNo: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">DR/CR</label>
                  <select
                    value={newTransaction.drCr}
                    onChange={(e) => setNewTransaction({...newTransaction, drCr: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount || calculateAmount()}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
