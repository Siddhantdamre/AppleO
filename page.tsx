"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Eye, History, Settings, User, LogOut, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Example: Fetch stats and recent analyses from your backend
        const statsRes = await apiFetch("/api/dashboard/")
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.stats)
          setRecentAnalyses(data.recent_analyses)
        } else if (statsRes.status === 401) {
          // Not authenticated, redirect to login
          router.push("/auth/login")
        }
      } catch (err) {
        // Optionally show error toast
      }
      setLoading(false)
    }
    fetchData()
  }, [router])

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Suite Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}> <Settings className="h-4 w-4 mr-2" /> Settings </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}> <User className="h-4 w-4 mr-2" /> Profile </Button>
            <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem("authToken"); router.push("/auth/login"); }}> <LogOut className="h-4 w-4 mr-2" /> Logout </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_analyses ?? "-"}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.accuracy_rate ?? "-"}%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.active_alerts ?? "-"}</div>
              <p className="text-xs text-muted-foreground">2 high priority</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.processing_time ?? "-"}s</div>
              <p className="text-xs text-muted-foreground">Average response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start a new analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start">
                  <Link href="/disease-recognition">
                    <Shield className="mr-2 h-4 w-4" />
                    Disease Recognition
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/animal-detection">
                    <Eye className="mr-2 h-4 w-4" />
                    Animal Detection
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>Your latest AI analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnalyses.length === 0 && <div>No recent analyses found.</div>}
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          {analysis.type === "Disease Recognition" ? (
                            <Shield className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{analysis.filename}</p>
                          <p className="text-sm text-gray-500">{analysis.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge variant={analysis.result === "Normal" ? "default" : "destructive"}>
                            {analysis.result}
                          </Badge>
                          <span className="text-sm text-gray-500">{analysis.confidence}%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{analysis.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
