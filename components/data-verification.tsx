"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react"

export default function DataVerification({ blocks, onVerify }) {
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [tamperMode, setTamperMode] = useState(false)
  const [tamperedData, setTamperedData] = useState("")

  const handleVerify = async () => {
    const result = await onVerify()
    setVerificationStatus(result)
  }

  const handleSelectBlock = (block) => {
    setSelectedBlock(block)
    setTamperedData(block.data)
  }

  const handleTamperToggle = () => {
    setTamperMode(!tamperMode)
    if (selectedBlock) {
      setTamperedData(selectedBlock.data)
    }
  }

  const simulateTamper = async () => {
    // This is just a simulation for educational purposes
    const tamperedBlocks = [...blocks]
    const blockIndex = tamperedBlocks.findIndex((b) => b.id === selectedBlock.id)

    if (blockIndex !== -1) {
      // Create a tampered block with invalid hash
      const tamperedBlock = {
        ...tamperedBlocks[blockIndex],
        data: tamperedData,
        // We don't update the hash, which makes it invalid
      }

      tamperedBlocks[blockIndex] = tamperedBlock

      // Show verification failure
      setVerificationStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-medium text-green-500">Blockchain Verification</h3>
          </div>

          <p className="text-green-400 text-sm">
            Verify the integrity of the blockchain by checking that all blocks are properly linked and that the data has
            not been tampered with.
          </p>

          <Button onClick={handleVerify} className="bg-green-500 text-black hover:bg-green-400 transition-colors duration-300">
            Verify Blockchain
          </Button>

          {verificationStatus !== null && (
            <div
              className={`
              p-4 rounded-md mt-4 flex items-center space-x-2
              ${verificationStatus ? "bg-green-500/20 border border-green-500/50" : "bg-red-500/20 border border-red-500/50"}
            `}
            >
              {verificationStatus ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  <span className="text-green-400">Blockchain verified successfully! All blocks are valid.</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                  <span className="text-red-400">Verification failed! The blockchain has been tampered with.</span>
                </>
              )}
            </div>
          )}
        </div>

        <Card className="flex-1 bg-black/80 dark:bg-black/70 border-green-500">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-green-500">Simulation Tools</h4>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Educational
              </Badge>
            </div>

            <p className="text-sm text-green-400">
              For educational purposes, you can simulate tampering with the blockchain data to see how verification
              works.
            </p>

            <div className="space-y-2">
              <div className="text-sm text-green-400">Select a block to tamper with:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {blocks.map((block) => (
                  <Button
                    key={block.id}
                    variant="outline"
                    size="sm"
                    className={`
                      border-green-500 text-green-500 hover:bg-green-500/10
                      ${selectedBlock?.id === block.id ? "bg-green-500/20" : ""}
                    `}
                    onClick={() => handleSelectBlock(block)}
                  >
                    Block #{block.id}
                  </Button>
                ))}
              </div>
            </div>

            {selectedBlock && (
              <div className="space-y-2 pt-2 border-t border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-400">Block #{selectedBlock.id} Data:</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                    onClick={handleTamperToggle}
                  >
                    {tamperMode ? "Cancel" : "Tamper"}
                  </Button>
                </div>

                {tamperMode ? (
                  <div className="space-y-2">
                    <textarea
                      value={tamperedData}
                      onChange={(e) => setTamperedData(e.target.value)}
                      className="w-full h-20 bg-black dark:bg-black/90 border border-yellow-500 text-yellow-500 p-2 rounded-md"
                    />
                    <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 transition-colors duration-300" onClick={simulateTamper}>
                      Simulate Tampered Data
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 border border-green-500/30 rounded-md bg-black/50 dark:bg-black/30">
                    <code className="text-green-400 text-sm break-all">{selectedBlock.data}</code>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="border border-green-500/30 rounded-md p-4 bg-black/50 dark:bg-black/30">
        <h4 className="text-md font-medium mb-2 text-green-500">How Blockchain Verification Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-green-400">1. Hash Checking</div>
            <p className="text-green-300">
              Each block contains a hash that is calculated based on its contents. If the data changes, the hash will be
              different.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="font-medium text-green-400">2. Chain Verification</div>
            <p className="text-green-300">
              Each block contains the hash of the previous block, creating a chain. This ensures blocks cannot be
              modified or reordered.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}