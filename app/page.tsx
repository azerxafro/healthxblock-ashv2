"use client"

import { useState, useEffect } from "react"
import DataEntryForm from "@/components/data-entry-form"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default function Home() {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [insuranceClaims, setInsuranceClaims] = useState([])
  const [pharmacyRecords, setPharmacyRecords] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const patientsData = await prisma.patient.findMany()
        const doctorsData = await prisma.doctor.findMany()
        const insuranceData = await prisma.insuranceClaim.findMany()
        const pharmacyData = await prisma.pharmacyRecord.findMany()
        setPatients(patientsData)
        setDoctors(doctorsData)
        setInsuranceClaims(insuranceData)
        setPharmacyRecords(pharmacyData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (entityType, values) => {
    // This function is already handled in DataEntryForm, but you can add additional logic here if needed
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-500">HealthXBlock Dashboard</h1>
      <DataEntryForm onSubmit={handleSubmit} />
      {/* Display saved entries */}
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-400">Patients</h2>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <div key={patient.id} className="p-4 bg-black/20 border border-green-500 rounded-md mb-2 text-green-400">
                ID: {patient.id}, Name: {patient.name}, Diagnosis: {patient.diagnosis}, Doctor: {patient.doctorId || "N/A"}
              </div>
            ))
          ) : (
            <p className="text-green-400">No patients found.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-400">Doctors</h2>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor.id} className="p-4 bg-black/20 border border-green-500 rounded-md mb-2 text-green-400">
                ID: {doctor.id}, Name: {doctor.name}, Specialty: {doctor.specialty}, Hospital ID: {doctor.hospitalId || "N/A"}
              </div>
            ))
          ) : (
            <p className="text-green-400">No doctors found.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-400">Insurance Claims</h2>
          {insuranceClaims.length > 0 ? (
            insuranceClaims.map((claim) => (
              <div key={claim.id} className="p-4 bg-black/20 border border-green-500 rounded-md mb-2 text-green-400">
                ID: {claim.id}, Patient ID: {claim.patientId}, Company: {claim.company}, Amount: ${claim.amount}
              </div>
            ))
          ) : (
            <p className="text-green-400">No insurance claims found.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-400">Pharmacy Records</h2>
          {pharmacyRecords.length > 0 ? (
            pharmacyRecords.map((record) => (
              <div key={record.id} className="p-4 bg-black/20 border border-green-500 rounded-md mb-2 text-green-400">
                ID: {record.id}, Name: {record.name}, Medicine: {record.medicine}, Dosage: {record.dosage || "N/A"}
              </div>
            ))
          ) : (
            <p className="text-green-400">No pharmacy records found.</p>
          )}
        </div>
      </div>
    </div>
  )
}