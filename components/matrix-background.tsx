"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function MatrixBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!@#$%^&*()".split("")
    const fontSize = 16
    const columns = canvas.width / fontSize

    const drops = Array(Math.ceil(columns)).fill(1)

    const drawMatrix = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Adjust color based on theme
      ctx.fillStyle = theme === "dark" ? "#0f0" : "rgba(0, 128, 0, 0.7)"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = characters[Math.floor(Math.random() * characters.length)]

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down
        drops[i]++
      }
    }

    const interval = setInterval(drawMatrix, 33) // ~30 FPS

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-60 dark:opacity-80" />
}