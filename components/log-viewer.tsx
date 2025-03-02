"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "lucide-react"

export default function LogViewer({ logs }) {
  const [showAllLogs, setShowAllLogs] = useState(false)

  const displayLogs = showAllLogs ? logs : logs.slice(-5)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-medium text-green-500">System Logs</h3>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400">
          {logs.length} Entries
        </Badge>
      </div>

      <ScrollArea className="h-[300px] border border-green-500/50 rounded-md p-4 bg-black/80 dark:bg-black/50">
        <div className="space-y-2">
          {displayLogs.map((log, index) => (
            <div key={index} className="font-mono text-sm border-l-2 border-green-500 pl-3 py-1">
              {log.includes("[INFO]") ? (
                <span className="text-green-400">{log}</span>
              ) : log.includes("[WARNING]") ? (
                <span className="text-yellow-400">{log}</span>
              ) : log.includes("[ERROR]") ? (
                <span className="text-red-400">{log}</span>
              ) : (
                <span>{log}</span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {logs.length > 5 && (
        <Button
          variant="outline"
          className="w-full border-green-500 text-green-500 hover:bg-green-500/10 transition-colors duration-300"
          onClick={() => setShowAllLogs(!showAllLogs)}
        >
          {showAllLogs ? "Show Recent Logs" : "Show All Logs"}
        </Button>
      )}
    </div>
  )
}