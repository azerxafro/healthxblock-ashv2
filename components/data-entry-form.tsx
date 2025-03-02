"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  entityType: z.enum(["patient", "doctor", "insurance", "pharmacy"], {
    required_error: "Please select an entity type.",
  }),
  id: z.string().min(2, {
    message: "ID must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  extra1: z.string().min(1, {
    message: "This field is required.",
  }),
  extra2: z.string().optional(),
})

export default function DataEntryForm({ onSubmit }) {
  const { toast } = useToast()
  const [entityType, setEntityType] = useState("patient")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entityType: "patient",
      id: "",
      name: "",
      extra1: "",
      extra2: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/save-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Record Added Successfully",
          description: `New ${values.entityType} record has been added to the database.`,
        })

        form.reset({
          entityType: values.entityType,
          id: "",
          name: "",
          extra1: "",
          extra2: "",
        })
      } else {
        throw new Error(data.error || "Failed to save record")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${values.entityType} record: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const getFieldLabels = (type) => {
    switch (type) {
      case "patient":
        return {
          extra1: "Diagnosis",
          extra2: "Doctor",
        }
      case "doctor":
        return {
          extra1: "Specialty",
          extra2: "Hospital ID (Optional)",
        }
      case "insurance":
        return {
          extra1: "Company",
          extra2: "Amount",
        }
      case "pharmacy":
        return {
          extra1: "Medicine",
          extra2: "Dosage (Optional)",
        }
      default:
        return {
          extra1: "Field 1",
          extra2: "Field 2 (Optional)",
        }
    }
  }

  const handleEntityTypeChange = (value) => {
    setEntityType(value)
    form.setValue("entityType", value)
  }

  const labels = getFieldLabels(entityType)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="entityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-400">Entity Type</FormLabel>
              <Select onValueChange={(value) => handleEntityTypeChange(value)} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-black dark:bg-black/70 border-green-500 text-green-500">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black dark:bg-black/90 border-green-500 text-green-500">
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-green-400">Select the type of healthcare entity to add</FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-400">ID</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Enter ${entityType} ID`}
                  {...field}
                  className="bg-black dark:bg-black/70 border-green-500 text-green-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-400">{entityType === "insurance" ? "Patient ID" : "Name"}</FormLabel>
              <FormControl>
                <Input
                  placeholder={entityType === "insurance" ? "Enter patient ID" : `Enter ${entityType} name`}
                  {...field}
                  className="bg-black dark:bg-black/70 border-green-500 text-green-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extra1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-400">{labels.extra1}</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Enter ${labels.extra1.toLowerCase()}`}
                  {...field}
                  className="bg-black dark:bg-black/70 border-green-500 text-green-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extra2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-400">{labels.extra2}</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Enter ${labels.extra2.toLowerCase()}`}
                  {...field}
                  className="bg-black dark:bg-black/70 border-green-500 text-green-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-green-500 text-black hover:bg-green-400 transition-colors duration-300">
          Add to Blockchain
        </Button>
      </form>
    </Form>
  )
}