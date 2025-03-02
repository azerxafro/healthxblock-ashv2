"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DataEntryForm from "./data-entry-form"
import BlockchainViewer from "./blockchain-viewer"
import EntityViewer from "./entity-viewer"
import LogViewer from "./log-viewer"
import MatrixBackground from "./matrix-background"
import TransactionHistory from "./transaction-history"
import DataVerification from "./data-verification"
import { ThemeToggle } from "./theme-toggle"
import { createHash } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"

export default function HealthcareBlockchain() {
  const { toast } = useToast()
  const [patients, setPatients] = useState([
    { id: "P001", name: "Ashika", diagnosis: "Fever", doctor: "Dr. Kumuthini" },
  ])
  const [doctors, setDoctors] = useState([
    { id: "D001", name: "Dr. Kumuthini", specialty: "General Medicine" },
    { id: "D002", name: "Dr. Ramesh", specialty: "Cardiology" },
  ])
  const [insurance, setInsurance] = useState([{ id: "C001", patientId: "P001", company: "HealthInsure", amount: 5000 }])
  const [pharmacy, setPharmacy] = useState([{ id: "PH001", name: "MediCare Pharmacy", medicine: "Paracetamol" }])
  const [blocks, setBlocks] = useState([
    { id: 1, timestamp: "2025-02-27T10:00:00", previousHash: "0", hash: "0x123abc", data: "Genesis Block", nonce: 0 },
    {
      id: 2,
      timestamp: "2025-02-27T10:15:00",
      previousHash: "0x123abc",
      hash: "0x456def",
      data: "Patient P001 - Fever",
      nonce: 123,
    },
    {
      id: 3,
      timestamp: "2025-02-27T10:30:00",
      previousHash: "0x456def",
      hash: "0x789ghi",
      data: "Dr. Kumuthini - Diagnosis",
      nonce: 456,
    },
    {
      id: 4,
      timestamp: "2025-02-27T10:45:00",
      previousHash: "0x789ghi",
      hash: "0xabcdef",
      data: "HealthInsure - Claim 5000",
      nonce: 789,
    },
  ])
  const [logs, setLogs] = useState([
    "2025-02-27 10:00:00 - [INFO] - Blockchain initialized",
    "2025-02-27 10:15:00 - [INFO] - New patient record added",
    "2025-02-27 10:30:00 - [INFO] - New doctor diagnosis recorded",
    "2025-02-27 10:45:00 - [INFO] - Insurance claim processed",
  ])
  const [transactions, setTransactions] = useState([
    { id: "T001", timestamp: "2025-02-27T10:15:00", type: "Patient", data: "Added patient Ashika" },
    { id: "T002", timestamp: "2025-02-27T10:30:00", type: "Doctor", data: "Dr. Kumuthini diagnosed Fever" },
    { id: "T003", timestamp: "2025-02-27T10:45:00", type: "Insurance", data: "Processed claim for 5000" },
  ])

  const addLog = (message) => {
    const now = new Date()
    const timestamp = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]}`
    const newLog = `${timestamp} - [INFO] - ${message}`
    setLogs((prevLogs) => [...prevLogs, newLog])
  }

  const addTransaction = (type, data) => {
    const now = new Date()
    const newTransaction = {
      id: `T${transactions.length + 1}`.padStart(4, "0"),
      timestamp: now.toISOString(),
      type,
      data,
    }
    setTransactions((prev) => [...prev, newTransaction])
    return newTransaction
  }

  const addBlock = async (data, transaction) => {
    const lastBlock = blocks[blocks.length - 1]
    const newBlockId = lastBlock.id + 1
    const timestamp = new Date().toISOString()
    const previousHash = lastBlock.hash

    // Simulate mining with a random nonce
    const nonce = Math.floor(Math.random() * 10000)

    // Create a new block with hash
    const newBlock = {
      id: newBlockId,
      timestamp,
      previousHash,
      data,
      nonce,
      hash: await createHash(newBlockId, timestamp, previousHash, data, nonce),
    }

    setBlocks((prev) => [...prev, newBlock])
    addLog(`New block added: ${data}`)

    toast({
      title: "Blockchain Updated",
      description: `New block added with transaction: ${transaction.id}`,
    })

    return newBlock
  }

  const handleAddEntity = async (entityType, data) => {
    let newEntity
    let transactionData

    switch (entityType) {
      case "patient":
        newEntity = {
          id: data.id,
          name: data.name,
          diagnosis: data.extra1,
          doctor: data.extra2,
        }
        setPatients((prev) => [...prev, newEntity])
        transactionData = `Added patient ${data.name} with diagnosis ${data.extra1}`
        break

      case "doctor":
        newEntity = {
          id: data.id,
          name: data.name,
          specialty: data.extra1,
        }
        setDoctors((prev) => [...prev, newEntity])
        transactionData = `Added doctor ${data.name}, specialty: ${data.extra1}`
        break

      case "insurance":
        newEntity = {
          id: data.id,
          patientId: data.name,
          company: data.extra1,
          amount: Number.parseFloat(data.extra2) || 0,
        }
        setInsurance((prev) => [...prev, newEntity])
        transactionData = `Added insurance claim for ${data.name}, amount: ${data.extra2}`
        break

      case "pharmacy":
        newEntity = {
          id: data.id,
          name: data.name,
          medicine: data.extra1,
        }
        setPharmacy((prev) => [...prev, newEntity])
        transactionData = `Added pharmacy record for ${data.name}, medicine: ${data.extra1}`
        break
    }

    // Add transaction and block
    const transaction = addTransaction(entityType, transactionData)
    await addBlock(transactionData, transaction)

    return newEntity
  }

  const verifyBlockchain = async () => {
    for (let i = 1; i < blocks.length; i++) {
      const currentBlock = blocks[i]
      const previousBlock = blocks[i - 1]

      // Check if previous hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        toast({
          title: "Blockchain Verification Failed",
          description: `Block ${currentBlock.id} has invalid previous hash reference`,
          variant: "destructive",
        })
        return false
      }

      // Verify current block hash
      const calculatedHash = await createHash(
        currentBlock.id,
        currentBlock.timestamp,
        currentBlock.previousHash,
        currentBlock.data,
        currentBlock.nonce,
      )

      if (calculatedHash !== currentBlock.hash) {
        toast({
          title: "Blockchain Verification Failed",
          description: `Block ${currentBlock.id} has invalid hash`,
          variant: "destructive",
        })
        return false
      }
    }

    toast({
      title: "Blockchain Verification Successful",
      description: "All blocks in the chain are valid and secure",
    })

    addLog("Blockchain verification completed successfully")
    return true
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
      <MatrixBackground />

      <header className="bg-black/90 dark:bg-black/70 border-b border-green-500 py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-green-500">
            Blockchain-Enabled Healthcare Secure Data Storage
          </h1>
          <ThemeToggle />
          <div className="text-teal-400 text-center mt-1 hidden md:block">Ormond Hospitals Pvt Ltd</div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Patients</CardTitle>
                  <CardDescription className="text-green-400">Total patient records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-500">{patients.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Doctors</CardTitle>
                  <CardDescription className="text-green-400">Registered healthcare providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-500">{doctors.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Blockchain</CardTitle>
                  <CardDescription className="text-green-400">Total blocks in chain</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-500">{blocks.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Transactions</CardTitle>
                  <CardDescription className="text-green-400">Processed transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-500">{transactions.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionHistory transactions={transactions.slice(-5)} />
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <LogViewer logs={logs.slice(-5)} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data-entry">
            <Card className="bg-black/80 dark:bg-black/50 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-500">Add New Healthcare Record</CardTitle>
                <CardDescription className="text-green-400">
                  Enter details to add a new record to the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataEntryForm onSubmit={handleAddEntity} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain">
            <Card className="bg-black/80 dark:bg-black/50 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-500">Blockchain Explorer</CardTitle>
                <CardDescription className="text-green-400">View and interact with the blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <BlockchainViewer blocks={blocks} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-black/80 dark:bg-black/50 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-500">Transaction History</CardTitle>
                <CardDescription className="text-green-400">Complete record of all transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory transactions={transactions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="bg-black/80 dark:bg-black/50 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-500">Data Verification</CardTitle>
                <CardDescription className="text-green-400">Verify the integrity of the blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <DataVerification blocks={blocks} onVerify={verifyBlockchain} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityViewer entities={patients} entityType="patient" />
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityViewer entities={doctors} entityType="doctor" />
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Insurance Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityViewer entities={insurance} entityType="insurance" />
                </CardContent>
              </Card>

              <Card className="bg-black/80 dark:bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-500">Pharmacy Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityViewer entities={pharmacy} entityType="pharmacy" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-black/90 dark:bg-black/70 border-t border-green-500 py-4 px-6 text-center mt-8">
       <p className="text-white">© 2025 Dr. N.G.P. Arts and Science College, Coimbatore | Presented by Ashika. A (221CA007)</p>
      </footer>
    </div>
  )
}