'use client'
import { useState } from 'react'
import { useLedger } from '@/contexts/LedgerContext'
import { Upload, X } from 'lucide-react'

export default function ExcelImport() {
  const { customers, uploadExcel } = useLedger()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile || !selectedCustomer) {
      alert('Please select both a file and a customer')
      return
    }

    setUploading(true)
    const success = await uploadExcel(selectedFile, selectedCustomer)
    setUploading(false)
    
    if (success) {
      setIsOpen(false)
      setSelectedFile(null)
      setSelectedCustomer('')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Excel
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import Excel Data</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer
                </label>
                <select
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.name} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excel File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    required
                    accept=".xlsx,.xls"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="excel-file"
                  />
                  <label
                    htmlFor="excel-file"
                    className="cursor-pointer block"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {selectedFile ? selectedFile.name : 'Choose Excel file'}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      .xlsx or .xls files only
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Import Instructions:
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• First row (headers) will be skipped</li>
                  <li>• Data should start from second row</li>
                  <li>• Columns should match transaction format</li>
                  <li>• Supported formats: Date, Description, Item, etc.</li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Import Data'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
