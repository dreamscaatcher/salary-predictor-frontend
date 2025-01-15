'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    experience_level_encoded: 0,  // Default to EN
    company_size_encoded: 0,      // Default to S
    employment_type_PT: 0,        // Default to not PT
    job_title_Data_Engineer: 0,
    job_title_Data_Manager: 0,
    job_title_Data_Scientist: 0,
    job_title_Machine_Learning_Engineer: 0
  })
  const [prediction, setPrediction] = useState(null)

  const handleExperienceChange = (value) => {
    const encodings = { 'EN': 0, 'MI': 1, 'SE': 2, 'EX': 3 }
    setFormData({ ...formData, experience_level_encoded: encodings[value] })
  }

  const handleCompanySizeChange = (value) => {
    const encodings = { 'S': 0, 'M': 1, 'L': 2 }
    setFormData({ ...formData, company_size_encoded: encodings[value] })
  }

  const handleJobTitleChange = (value) => {
    // Reset all job titles to 0
    const resetJobTitles = {
      job_title_Data_Engineer: 0,
      job_title_Data_Manager: 0,
      job_title_Data_Scientist: 0,
      job_title_Machine_Learning_Engineer: 0
    }
    
    // Set selected job title to 1
    const selectedTitle = `job_title_${value.replace(/ /g, '_')}`
    resetJobTitles[selectedTitle] = 1
    
    setFormData({ ...formData, ...resetJobTitles })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setPrediction(data.predicted_salary_usd)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Data Science Salary Predictor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="experience">Experience Level</Label>
              <Select onValueChange={handleExperienceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">Entry Level</SelectItem>
                  <SelectItem value="MI">Mid Level</SelectItem>
                  <SelectItem value="SE">Senior</SelectItem>
                  <SelectItem value="EX">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="company-size">Company Size</Label>
              <Select onValueChange={handleCompanySizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="L">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="job-title">Job Title</Label>
              <Select onValueChange={handleJobTitleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Engineer">Data Engineer</SelectItem>
                  <SelectItem value="Data Manager">Data Manager</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                className="w-4 h-4"
                onChange={(e) => setFormData({ ...formData, employment_type_PT: e.target.checked ? 1 : 0 })}
              />
              <Label>Part Time</Label>
            </div>

            <Button type="submit">Predict Salary</Button>
          </div>
        </form>

        {prediction && (
          <div className="mt-4 p-4 bg-slate-100 rounded-md">
            <h3 className="font-semibold">Predicted Salary</h3>
            <p className="text-2xl font-bold">${prediction.toLocaleString()}/year</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
