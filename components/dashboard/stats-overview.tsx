'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Image, Video, Music, Box } from 'lucide-react'

export function StatsOverview() {
  const stats = [
    {
      title: 'Images Generated',
      value: '0',
      description: 'This month',
      icon: Image,
      color: 'text-blue-600'
    },
    {
      title: 'Videos Created',
      value: '0', 
      description: 'This month',
      icon: Video,
      color: 'text-green-600'
    },
    {
      title: 'Audio Files',
      value: '0',
      description: 'This month', 
      icon: Music,
      color: 'text-purple-600'
    },
    {
      title: '3D Models',
      value: '0',
      description: 'This month',
      icon: Box,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
