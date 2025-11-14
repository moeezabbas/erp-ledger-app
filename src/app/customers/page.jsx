'use client'
import { useState } from 'react'
import { useLedger } from '@/contexts/LedgerContext'
import { Search, Plus, Upload, Download } from 'lucide-react'

export default function Customers() {
  const { 
    customers, 
    loading, 
    fetchCustomerTransactions, 
    createCustomer,
    uploadExcel 
  } = useLedger()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showUploadExcel, setShowUploadExcel] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    openingBalance: 0,
    color: 'none'
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadCustomer, setUploadCustomer] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCustomer = async (e) => {
    e.preventDefault()
    const success = await createCustomer(newCustomer)
    if (success) {
      setShowAddCustomer(false)
      setNewCustomer({ name: '', openingBalance: 0, color: 'none' })
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile || !uploadCustomer) {
      alert('Please select a file and customer')
      return
    }

    const success = await uploadExcel(selectedFile, uploadCustomer)
    if (success) {
      setShowUploadExcel(false)
      setSelectedFile(null)
      setUploadCustomer('')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadExcel(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </button>
          <button
            onClick={() => setShowAddCustomer(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => fetchCustomerTransactions(customer.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                customer.color === 'brown' ? 'bg-yellow-600' :
                customer.color === 'blue' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Sheet: {customer.sheetName}</p>
              <p>Status: {customer.status}</p>
              <p>Created: {new Date(customer.createdDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCustomer.openingBalance}
                  onChange={(e) => setNewCustomer({...newCustomer, openingBalance: parseFloat(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <select
                  value={newCustomer.color}
                  onChange={(e) => setNewCustomer({...newCustomer, color: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">No Color</option>
                  <option value="brown">Brown/Yellow (Dealers)</option>
                  <option value="blue">Blue (Banks)</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Excel Modal */}
      {showUploadExcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Import Excel Data</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select
                  required
                  value={uploadCustomer}
                  onChange={(e) => setUploadCustomer(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer.name}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Excel File</label>
                <input
                  type="file"
                  required
                  accept=".xlsx,.xls"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload Excel file with transaction data. First row will be skipped.
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Import Data
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadExcel(false)}
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
