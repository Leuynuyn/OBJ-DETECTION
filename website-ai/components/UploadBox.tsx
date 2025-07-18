'use-client'

import React, { useState } from 'react'

interface UploadBoxProps {
    onResult: (url: string) => void
}

const UploadBox = ({ onResult }: UploadBoxProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0]
            console.log('Selected file:', selectedFile) // Debug file
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return alert('Vui lòng chọn một file!')

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file, file.name) // Đảm bảo tên file được gửi đúng
        console.log('FormData entries:', [...formData.entries()]) // Debug FormData;


        try {
            const response = await fetch('/api/upload', { // Sử dụng API route đã cấu hình trong next.config.ts
                method: 'POST',
                body: formData,
            })
            const data = await response.json()
            console.log('Server response:', data) // Debug server response
            if (data.result_url) {
                onResult(data.result_url) // Gọi callback với URL kết quả
            } else {
                alert('Error: Không nhận được URL kết quả từ server: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            alert('Lỗi khi gửi file!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4 text-sm">
                Kéo thả tệp vào đây hoặc chọn từ máy
            </p>

            <div className="flex flex-col items-center">
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
                <span className="text-gray-400 text-sm mt-2">
                    {file ? file.name : 'Chưa chọn tệp'}
                </span>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 text-base rounded-lg shadow hover:bg-blue-700 transition"
                >
                    {loading ? 'Processing...' : 'Bắt đầu nhận diện'}
                </button>
            </div>
        </div>
    )
}

export default UploadBox