'use client'
import { useLedger } from '@/contexts/LedgerContext'
import { DollarSign, Users, TrendingUp, FileText, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { summary, balanceSheet, customers, fetchCustomers, fetchBalanceSheet, fetchSummary, loading } = useLedger()
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshData = () => {
    fetchCustomers()
    fetchBalanceSheet()
    fetchSummary()
    setLastUpdated(new Date())
  }

  useEffect(() => {
    const interval = setInterval(refreshData, 30000) // Auto-refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'blue',
      change: '+0%'
    },
    {
      title: 'Total DR Balance',
      value: `Rs. ${summary?.totalDr?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'red',
      change: ''
    },
    {
      title: 'Total CR Balance',
      value: `Rs. ${summary?.totalCr?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'green',
      change: ''
    },
    {
      title: 'Net Position',
      value: `Rs. ${Math.abs(summary?.netPosition || 0).toLocaleString()}`,
      subtitle: summary?.status || 'BALANCED',
      icon: DollarSign,
      color: summary?.status === 'NET DR' ? 'red' : summary?.status === 'NET CR' ? 'green' : 'blue',
      change: ''
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className={`text-sm font-medium ${
                    stat.subtitle === 'NET DR' ? 'text-red-600' : 
                    stat.subtitle === 'NET CR' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Customers & Balance Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {customers.slice(0, 5).map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      customer.color === 'brown' ? 'bg-yellow-600' :
                      customer.color === 'blue' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{customer.status}</span>
                </div>
              ))}
              {customers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No customers found</p>
              )}
            </div>
          </div>
        </div>

        {/* Balance Sheet Preview */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Balance Sheet Preview</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {balanceSheet.slice(0, 5).map((balance, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium text-gray-900">{balance.customerName}</span>
                  <div className="text-right">
                    <p className="font-semibold">Rs. {parseFloat(balance.balance).toLocaleString()}</p>
                    <p className={`text-sm ${
                      balance.drCr === 'DR' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {balance.drCr}
                    </p>
                  </div>
                </div>
              ))}
              {balanceSheet.length === 0 && (
                <p className="text-center text-gray-500 py-4">No balance data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
