'use client'

import Header from '@/components/Header'
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from 'react'

interface DetectionResult {
  id: number
  fileName: string
  time: string
  result: string[]
  imageUrl?: string
}

export default function OperationHistoryPage() {
  const [selectedItem, setSelectedItem] = useState<DetectionResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [history, setHistory] = useState<DetectionResult[]>([])

  const openModal = (item: DetectionResult) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setIsModalOpen(false)
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
    setHistory(data)
  }, [])

  return (
    <div className="flex min-h-screen bg-[#f4f6fa]">
      <div className="w-60 shadow-lg">
        <Sidebar />
      </div>
      <main className="flex-1 p-5">
        <div className="bg-[#172B4D] shadow-md p-2">
          <h1 className="text-3xl font-bold text-[#A7EBF2] text-center">
            <Header title={"Operation History"} />
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-8">
          {history.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có kết quả nào</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded shadow p-4 bg-white">
                <div className="grid flex gap-4 items-center">
                    {/* Cột hình ảnh */}
                    <div>
                    <img
                        src={item.imageUrl}
                        alt="Preview"
                        className="rounded max-h-40 w-full object-contain"
                    />
                    </div>

                    {/* Cột thông tin */}
                    <div>
                    <h2 className="font-semibold">{item.fileName}</h2>
                    <p className="text-sm text-gray-400">{item.time}</p>
                    <p className="mt-2 text-gray-400 text-sm">
                        {item.result.join(', ')}
                    </p>
                    <button
                        onClick={() => openModal(item)}
                        className="mt-3 bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                    >
Xem chi tiết
                    </button>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DetailModal isOpen={isModalOpen} onClose={closeModal} data={selectedItem} />
      </main>
    </div>
  )
}

    function DetailModal({
        isOpen,
        onClose,
        data,
        }: {
        isOpen: boolean;
        onClose: () => void;
        data: DetectionResult | null;
        }) {
        if (!isOpen || !data) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                >
                <div className="bg-white rounded-lg p-6 w-[1000px] max-h-[80vh] min-h-[60vh] overflow-y-auto shadow-xl relative">
                    <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                    >
                    ✖
                    </button>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                    {/*hình ảnh */}
                    {data.imageUrl && (
                        <div className="flex items-start">
                        <img
                            src={data.imageUrl}
                            alt="Preview"
                            className="rounded max-h-64 w-full object-contain border"
                        />
                        </div>
                    )}

                    {/*thông tin */}
                    <div className="text-sm">
                        <h2 className="text-lg font-bold mb-2">Kết Quả Nhận Diện</h2>
                        <p className="mb-1"><strong>Thời gian:</strong> {data.time}</p>
                        <p className="mb-1"><strong>Tên file:</strong> {data.fileName}</p>
                        <p className="mb-1"><strong>Số lượng đối tượng:</strong> {data.result.length}</p>
                        <div className="bg-gray-100 rounded p-4 max-h-48 overflow-y-auto text-sm">
                        <p className="font-semibold mb-2">Danh sách đối tượng</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {data.result.map((r, i) => (
                            <li key={i} className="leading-snug">
                                <span className="italic">{r}</span>
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
