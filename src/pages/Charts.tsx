"use client"

import type React from "react"
import { motion } from "framer-motion"
import { PieChart, BarChart, LineChart } from "@mui/x-charts"
import type { ChartData } from "@/types"

const Charts: React.FC = () => {
  const pieData: ChartData[] = [
    { id: "react", label: "React", value: 35, color: "#61dafb" },
    { id: "vue", label: "Vue", value: 25, color: "#4fc08d" },
    { id: "angular", label: "Angular", value: 20, color: "#dd0031" },
    { id: "svelte", label: "Svelte", value: 20, color: "#ff3e00" },
  ]

  const barData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1900 },
    { month: "Mar", users: 3000 },
    { month: "Apr", users: 5000 },
    { month: "May", users: 4200 },
    { month: "Jun", users: 6100 },
  ]

  const lineData = [
    { x: 1, y: 2 },
    { x: 2, y: 5.5 },
    { x: 3, y: 2 },
    { x: 5, y: 8.5 },
    { x: 8, y: 1.5 },
    { x: 10, y: 5 },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Charts Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Interactive charts powered by MUI X Charts</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Framework Usage</h2>
          <PieChart
            series={[
              {
                data: pieData.map((item) => ({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                  color: item.color,
                })),
              },
            ]}
            width={400}
            height={200}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Users</h2>
          <BarChart
            xAxis={[{ scaleType: "band", data: barData.map((d) => d.month) }]}
            series={[{ data: barData.map((d) => d.users) }]}
            width={400}
            height={200}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Trend</h2>
          <LineChart
            xAxis={[{ data: lineData.map((d) => d.x) }]}
            series={[
              {
                data: lineData.map((d) => d.y),
                area: true,
                color: "#3b82f6",
              },
            ]}
            width={800}
            height={300}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Charts
