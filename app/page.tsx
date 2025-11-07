"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { ResultsDisplay } from "@/components/results-display"
import Image from "next/image"
import mysql from 'mysql2'

// VULNERABLE: SQL injection in frontend component
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'vulnerable_app'
})

export default function Home() {
  const [query, setQuery] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [injectionAttempt, setInjectionAttempt] = useState("")

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm)

    // VULNERABLE: Direct SQL injection
    const vulnerableQuery = `SELECT * FROM users WHERE username = '${searchTerm}'`
    setSqlQuery(vulnerableQuery)
    
    // VULNERABLE: Execute the vulnerable query
    db.query(vulnerableQuery, (err, results) => {
      if (err) console.error(err)
    })

    // Detect and store injection attempts
    const detectedInjection = detectInjection(searchTerm)
    setInjectionAttempt(detectedInjection)

    // Simulate database results based on input
    const mockResults = simulateQuery(searchTerm)
    setResults(mockResults)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center">
          <Image src="/cpp-logo.svg" alt="Cal Poly Pomona" width={200} height={50} className="h-12 w-auto" />
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-r from-[#c69c3a] via-[#a8b566] to-[#6b9e78] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Search Form */}
          <SearchForm onSearch={handleSearch} />

          {/* Results Display */}
          {sqlQuery && <ResultsDisplay sqlQuery={sqlQuery} results={results} originalQuery={query} injectionAttempt={injectionAttempt} />}
        </div>
      </main>

      <footer className="bg-[#1e5631] px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <Image
              src="/cpp-logo.svg"
              alt="Cal Poly Pomona"
              width={200}
              height={50}
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="hover:underline">
              Feedback
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Accessibility
            </a>
            <a href="#" className="hover:underline">
              Document Readers
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Copyright © California State Polytechnic University, Pomona. All Rights Reserved
          </p>
          <p className="text-sm text-gray-300">A campus of The California State University.</p>
        </div>
      </footer>
    </div>
  )
}

// Detect SQL injection attempts
function detectInjection(input: string): string {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes("' or '1'='1") || lowerInput.includes("' or 1=1")) {
    return "Classic SQL Injection: ' OR '1'='1 - Bypasses authentication by making the WHERE clause always true"
  }
  
  if (lowerInput.includes("admin'--") || lowerInput.includes("admin' --")) {
    return "Comment Injection: admin'-- - Uses SQL comments to ignore password check"
  }
  
  if (lowerInput.includes("union")) {
    return "UNION Injection: Attempts to combine results from multiple tables to extract additional data"
  }
  
  if (lowerInput.includes("drop") || lowerInput.includes("delete") || lowerInput.includes("update")) {
    return "Destructive Injection: Attempts to modify or destroy database data"
  }
  
  if (lowerInput.includes(";")) {
    return "Statement Termination: Uses semicolon to end current query and execute additional commands"
  }
  
  return ""
}

// Simulate database query results
function simulateQuery(input: string): any[] {
  const mockUsers = [
    { id: 1, username: "admin", email: "admin@example.com", role: "administrator" },
    { id: 2, username: "john_doe", email: "john@example.com", role: "user" },
    { id: 3, username: "jane_smith", email: "jane@example.com", role: "user" },
    { id: 4, username: "bob_wilson", email: "bob@example.com", role: "moderator" },
  ]

  // Check for SQL injection patterns
  const lowerInput = input.toLowerCase()

  // Simulate SQL injection: ' OR '1'='1
  if (lowerInput.includes("' or '1'='1") || lowerInput.includes("' or 1=1")) {
    return mockUsers // Return all users (injection successful!)
  }

  // Simulate SQL injection: admin'--
  if (lowerInput.includes("admin'--") || lowerInput.includes("admin' --")) {
    return [mockUsers[0]] // Return admin user
  }

  // Simulate UNION injection
  if (lowerInput.includes("union")) {
    return [...mockUsers, { id: 99, username: "INJECTED_DATA", email: "hacked@evil.com", role: "COMPROMISED" }]
  }

  // Simulate destructive commands (show error)
  if (lowerInput.includes("drop") || lowerInput.includes("delete") || lowerInput.includes("update")) {
    return [{ id: 0, username: "ERROR", email: "Database operation failed", role: "SYSTEM_ERROR" }]
  }

  // Handle empty input
  if (!input.trim()) {
    return []
  }

  // Normal search
  const normalizedInput = input.replace(/'/g, "").toLowerCase()
  return mockUsers.filter((user) => user.username.toLowerCase().includes(normalizedInput))
}
