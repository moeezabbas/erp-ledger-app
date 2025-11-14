'use client'
import { useLedger } from '@/contexts/LedgerContext'
import { DollarSign, Users, TrendingUp, FileText } from 'lucide-react'

export default function Dashboard() {
  const { summary, balanceSheet, customers } = useLedger()

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total DR Balance',
      value: `Rs. ${summary?.totalDr?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'red'
    },
    {
      title: 'Total CR Balance',
      value: `Rs. ${summary?.totalCr?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Net Position',
      value: `Rs. ${Math.abs(summary?.netPosition || 0).toLocaleString()} ${summary?.status || ''}`,
      icon: DollarSign,
      color: summary?.status === 'NET DR' ? 'red' : summary?.status === 'NET CR' ? 'green' : 'blue'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Customers */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {customers.slice(0, 5).map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
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
          </div>
        </div>
      </div>
    </div>
  )
}
