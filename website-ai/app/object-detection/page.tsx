'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import UploadBox from '@/components/UploadBox'
import DetectionResult from '@/components/DetectionResult'

export default function ObjectDetectionPage() {
  // const [file, setFile] = useState<File | null>(null)
  // const [result, setResult] = useState<string[]>([])
  // const [imagePreview, setImagePreview] = useState<string | null>(null)
  // const [ip, setIp] = useState<string>('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [ip, setIp] = useState<string>('')

  // Lấy IP của người dùng
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Unknown'))
  }, [])

  const handleResult = (url: string) => {
    setResultUrl(url)
    // Luu trữ URL kết quả để hiển thị
    const currentHistory = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
    const newEntry = {
      id: Date.now(),
      fileName: url.split('/').pop() || 'unknown',
      format: url.split('.').pop() || '',
      time: new Date().toLocaleString(),
      action: 'detect object',
      result: ['Processed successfully'], // Có thể cập nhật từ Flask nếu trả JSON
      ip: ip || 'Unknown'
    }
    const updatedHistory = [newEntry, ...currentHistory]
    localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory))
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fa]">
      <div className="w-60 shadow-lg">
        <Sidebar />
      </div>

      <main className="flex-1 p-5">
        <div className="bg-[#172B4D] shadow-md p-2 mb-6">
          <Header title="Object Detection" />
        </div>

        <div className="p-6 bg-white rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#172B4D]">Gửi ảnh hoặc video</h2>
          <UploadBox onResult={handleResult} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#172B4D]">Kết quả nhận diện</h2>
          {resultUrl ? (
            <DetectionResult resultUrl={resultUrl} />
          ) : (
            <p className="text-gray-500 italic text-center">Chưa có kết quả</p>
          )}
        </div>
      </main>
    </div>
  )
}
