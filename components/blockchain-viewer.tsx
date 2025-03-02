"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Database, Clock, Hash, FileText, Cpu } from "lucide-react"

export default function BlockchainViewer({ blocks }) {
  const [expandedBlock, setExpandedBlock] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-green-500">Blockchain Ledger</h3>
        <Badge variant="outline" className="text-green-400 border-green-400">
          {blocks.length} Blocks
        </Badge>
      </div>

      <div className="relative">
        {/* Blockchain visualization line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-green-500/50 z-0"></div>

        <Accordion type="single" collapsible className="space-y-4">
          {blocks.map((block, index) => (
            <AccordionItem
              key={block.id}
              value={block.id.toString()}
              className="border border-green-500 rounded-md bg-black/90 dark:bg-black/70 relative z-10"
            >
              <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-green-500"></div>

              <AccordionTrigger className="px-4 py-2 hover:bg-green-500/10">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-green-400" />
                  <span className="text-green-400">Block #{block.id}</span>
                  {index === 0 && (
                    <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-400">Genesis</Badge>
                  )}
                  {index === blocks.length - 1 && (
                    <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-400">Latest</Badge>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 py-2 space-y-3 text-green-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-green-400">Timestamp</p>
                      <p>{formatDate(block.timestamp)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Hash className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-green-400">Hash</p>
                      <p className="font-mono text-sm break-all">{block.hash}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Hash className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-green-400">Previous Hash</p>
                      <p className="font-mono text-sm break-all">{block.previousHash}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Cpu className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-green-400">Nonce</p>
                      <p>{block.nonce}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2 border-t border-green-500/30">
                  <FileText className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-green-400">Data</p>
                    <p className="font-mono text-sm no-text-overlap">{block.data}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}