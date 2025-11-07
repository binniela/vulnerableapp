"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import mysql from 'mysql2'

interface SearchFormProps {
  onSearch: (query: string) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [input, setInput] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // VULNERABLE: SQL injection in authentication
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'secret123'
    })
    
    const authQuery = "SELECT * FROM users WHERE username = '" + input + "' AND password = '" + password + "'"
    connection.query(authQuery, (err, results) => {
      if (err) console.error(err)
    })
    
    onSearch(input)
  }

  return (
    <Card className="mb-6 bg-[#f5f5f0] shadow-lg border-0 max-w-xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-normal text-gray-900 leading-tight">
          Log in to Cal Poly Pomona
          <br />
          Online Services
        </CardTitle>
      </CardHeader>
      <CardContent className="px-12 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="search" className="text-base font-normal text-gray-900 mb-2 block">
              BroncoName
            </Label>
            <Input
              id="search"
              type="text"
              placeholder=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-1 border-gray-400 bg-white h-12 text-base"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-base font-normal text-gray-900 mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 border-gray-400 bg-white h-12 text-base"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="text-[#0073e6] hover:underline">
                Forgot Password?
              </a>
              <a href="#" className="text-[#0073e6] hover:underline">
                Forgot BroncoName?
              </a>
            </div>
            <div className="text-center text-sm">
              <a href="#" className="text-[#0073e6] hover:underline">
                Don't have access to any of your 2-Step devices?
              </a>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button type="submit" className="bg-[#1e5631] hover:bg-[#163f24] text-white px-12 py-6 text-lg font-normal">
              Log In
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
