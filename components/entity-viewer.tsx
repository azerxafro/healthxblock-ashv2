"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EntityViewer({ entities, entityType }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntities = entities.filter((entity) => {
    return Object.values(entity).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    )
  })

  const getEntityColumns = () => {
    switch (entityType) {
      case "patient":
        return ["ID", "Name", "Diagnosis", "Doctor"]
      case "doctor":
        return ["ID", "Name", "Specialty"]
      case "insurance":
        return ["ID", "Patient ID", "Company", "Amount"]
      case "pharmacy":
        return ["ID", "Name", "Medicine"]
      default:
        return Object.keys(entities[0] || {})
    }
  }

  const getEntityValues = (entity) => {
    switch (entityType) {
      case "patient":
        return [entity.id, entity.name, entity.diagnosis, entity.doctor]
      case "doctor":
        return [entity.id, entity.name, entity.specialty]
      case "insurance":
        return [entity.id, entity.patientId, entity.company, `$${entity.amount}`]
      case "pharmacy":
        return [entity.id, entity.name, entity.medicine]
      default:
        return Object.values(entity)
    }
  }

  const columns = getEntityColumns()

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-green-500" />
        <Input
          type="search"
          placeholder={`Search ${entityType}s...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black dark:bg-black/70 border-green-500 text-green-500 pl-10"
        />
      </div>

      {filteredEntities.length > 0 ? (
        <div className="border border-green-500 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-500/10 hover:bg-green-500/20">
                {columns.map((column, index) => (
                  <TableHead key={index} className="text-green-400">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.map((entity, index) => (
                <TableRow key={index} className="border-green-500/30 hover:bg-green-500/10">
                  {getEntityValues(entity).map((value, valueIndex) => (
                    <TableCell key={valueIndex} className="text-green-300">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border border-green-500/30 rounded-md">
          <p className="text-green-400">No {entityType}s found matching your search.</p>
        </div>
      )}
    </div>
  )
}