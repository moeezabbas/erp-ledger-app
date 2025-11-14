'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const LedgerContext = createContext()

export const useLedger = () => {
  const context = useContext(LedgerContext)
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider')
  }
  return context
}

export const LedgerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([])
  const [balanceSheet, setBalanceSheet] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [transactions, setTransactions] = useState([])

  const API_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}?method=getCustomers`)
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.customers)
      } else {
        toast.error('Failed to fetch customers')
      }
    } catch (error) {
      toast.error('Error fetching customers')
    } finally {
      setLoading(false)
    }
  }

  // Fetch balance sheet
  const fetchBalanceSheet = async () => {
    try {
      const response = await fetch(`${API_URL}?method=getBalanceSheet`)
      const data = await response.json()
      
      if (data.success) {
        setBalanceSheet(data.balances)
      }
    } catch (error) {
      console.error('Error fetching balance sheet:', error)
    }
  }

  // Fetch DR/CR summary
  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}?method=getDRCRSummary`)
      const data = await response.json()
      
      if (data.success) {
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  // Fetch customer transactions
  const fetchCustomerTransactions = async (customerName) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}?method=getCustomerTransactions&customerName=${encodeURIComponent(customerName)}`)
      const data = await response.json()
      
      if (data.success) {
        setTransactions(data.transactions)
        setSelectedCustomer({
          name: customerName,
          summary: data.summary
        })
      } else {
        toast.error('Failed to fetch transactions')
      }
    } catch (error) {
      toast.error('Error fetching transactions')
    } finally {
      setLoading(false)
    }
  }

  // Create new transaction
  const createTransaction = async (transactionData) => {
    try {
      const params = new URLSearchParams(transactionData)
      const response = await fetch(`${API_URL}?method=createTransaction&${params}`)
      const data = await response.json()
      
      if (data.success) {
        toast.success('Transaction created successfully')
        // Refresh data
        fetchCustomers()
        fetchBalanceSheet()
        fetchSummary()
        if (selectedCustomer) {
          fetchCustomerTransactions(selectedCustomer.name)
        }
        return true
      } else {
        toast.error(data.error || 'Failed to create transaction')
        return false
      }
    } catch (error) {
      toast.error('Error creating transaction')
      return false
    }
  }

  // Create new customer
  const createCustomer = async (customerData) => {
    try {
      const params = new URLSearchParams(customerData)
      const response = await fetch(`${API_URL}?method=createCustomer&${params}`)
      const data = await response.json()
      
      if (data.success) {
        toast.success('Customer created successfully')
        fetchCustomers()
        return true
      } else {
        toast.error(data.error || 'Failed to create customer')
        return false
      }
    } catch (error) {
      toast.error('Error creating customer')
      return false
    }
  }

  // Upload Excel file
  const uploadExcel = async (file, customerName) => {
    try {
      const reader = new FileReader()
      
      return new Promise((resolve) => {
        reader.onload = async (e) => {
          try {
            const base64Data = e.target.result.split(',')[1]
            const params = new URLSearchParams({
              method: 'uploadExcel',
              fileName: file.name,
              customerName: customerName,
              fileData: base64Data
            })

            const response = await fetch(`${API_URL}?${params}`)
            const data = await response.json()
            
            if (data.success) {
              toast.success(`Excel imported successfully: ${data.totalTransactions} transactions`)
              fetchCustomers()
              resolve(true)
            } else {
              toast.error(data.error || 'Failed to import Excel')
              resolve(false)
            }
          } catch (error) {
            toast.error('Error processing Excel file')
            resolve(false)
          }
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      toast.error('Error reading Excel file')
      return false
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchCustomers()
    fetchBalanceSheet()
    fetchSummary()

    const interval = setInterval(() => {
      fetchCustomers()
      fetchBalanceSheet()
      fetchSummary()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const value = {
    customers,
    balanceSheet,
    summary,
    transactions,
    selectedCustomer,
    loading,
    fetchCustomers,
    fetchBalanceSheet,
    fetchSummary,
    fetchCustomerTransactions,
    createTransaction,
    createCustomer,
    uploadExcel,
    setSelectedCustomer
  }

  return (
    <LedgerContext.Provider value={value}>
      {children}
    </LedgerContext.Provider>
  )
}
