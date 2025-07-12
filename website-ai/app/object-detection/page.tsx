'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ObjectDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImagePreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = () => {
    if (!file) return alert('Vui lòng chọn một file!')
    setTimeout(() => {
      setResult([
        'Object: person - 98%',
        'Object: car - 87%',
        'Object: dog - 78%',
      ])
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fa]">
      <div className="w-60 shadow-lg ">
        <Sidebar />
      </div>

      <main className="flex-1 p-5">
        {/* Header */}
        <div className="bg-[#172B4D] shadow-md p-6 ">
          <h1 className="text-3xl font-bold text-[#A7EBF2] text-center">
            Upload & Xử lý ảnh / video
          </h1>
        </div>
        <div className='p-10'>
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 borde mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#172B4D]">Gửi ảnh hoặc video</h2>

          {/* Custom upload box */}
          <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg mb-4 text-center">
            <p className="text-gray-400 mb-4 text-sm">Kéo thả tệp vào đây hoặc chọn từ máy</p>

            <div className=" items-center justify-center ">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border border-black px-4 py-1 bg-gray-200 text-black text-sm rounded hover:bg-gray-300 transition"
              >
                Chọn tệp
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <span className="text-gray-400 text-sm  ml-[1%]">
                {file ? file.name : 'No file chosen'}
              </span>
            </div>

            {/* Nút xử lý nằm trong khung gạch */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 text-base rounded-lg shadow hover:bg-blue-700 transition"
              >
                Bắt đầu xử lý
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4  text-[#172B4D]">Kết quả nhận diện</h2>

          {imagePreview && (
            <div className="flex justify-center mb-6">
              <img
                src={imagePreview}
                alt="Kết quả"
                className="w-auto max-h-64 border rounded shadow"
              />
            </div>
          )}

          <div className="bg-gray-50 p-5 rounded-lg min-h-[120px]">
            {result.length === 0 ? (
              <p className="text-gray-500 italic text-center">Chưa có kết quả</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-gray-800">
                {result.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
