import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { entityType, id, name, extra1, extra2 } = await request.json()

    switch (entityType) {
      case "patient":
        await prisma.patient.create({
          data: {
            id,
            name,
            diagnosis: extra1,
            doctorId: extra2 || null,
          },
        })
        break
      case "doctor":
        await prisma.doctor.create({
          data: {
            id,
            name,
            specialty: extra1,
            hospitalId: extra2 || null,
          },
        })
        break
      case "insurance":
        await prisma.insuranceClaim.create({
          data: {
            id,
            patientId: name,
            company: extra1,
            amount: parseFloat(extra2 || "0"),
          },
        })
        break
      case "pharmacy":
        await prisma.pharmacyRecord.create({
          data: {
            id,
            name,
            medicine: extra1,
            dosage: extra2 || null,
          },
        })
        break
      default:
        throw new Error("Invalid entity type")
    }

    return NextResponse.json({ success: true, message: `Saved ${entityType} record` })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany()
    const doctors = await prisma.doctor.findMany()
    const insuranceClaims = await prisma.insuranceClaim.findMany()
    const pharmacyRecords = await prisma.pharmacyRecord.findMany()
    return NextResponse.json({ patients, doctors, insuranceClaims, pharmacyRecords })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}