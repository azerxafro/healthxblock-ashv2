"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionHistory({ transactions }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = Object.values(transaction).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const matchesFilter = filter === "all" || transaction.type.toLowerCase() === filter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-green-500" />
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black dark:bg-black/70 border-green-500 text-green-500 pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-green-500" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-black dark:bg-black/70 border-green-500 text-green-500">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-black dark:bg-black/90 border-green-500 text-green-500">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="pharmacy">Pharmacy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="border border-green-500 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-500/10 hover:bg-green-500/20">
                <TableHead className="text-green-400">ID</TableHead>
                <TableHead className="text-green-400">Timestamp</TableHead>
                <TableHead className="text-green-400">Type</TableHead>
                <TableHead className="text-green-400">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction, index) => (
                <TableRow key={index} className="border-green-500/30 hover:bg-green-500/10">
                  <TableCell className="font-mono text-green-300">{transaction.id}</TableCell>
                  <TableCell className="text-green-300">{formatDate(transaction.timestamp)}</TableCell>
                  <TableCell className="text-green-300">
                    <span
                      className={`
                      px-2 py-1 rounded-full text-xs
                      ${transaction.type === "Patient" ? "bg-blue-500/20 text-blue-400" : ""}
                      ${transaction.type === "Doctor" ? "bg-purple-500/20 text-purple-400" : ""}
                      ${transaction.type === "Insurance" ? "bg-yellow-500/20 text-yellow-400" : ""}
                      ${transaction.type === "Pharmacy" ? "bg-red-500/20 text-red-400" : ""}
                    `}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-green-300 no-text-overlap">{transaction.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border border-green-500/30 rounded-md">
          <p className="text-green-400">No transactions found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}