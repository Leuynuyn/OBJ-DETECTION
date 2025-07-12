export default function Sidebar() {
  return (
    <div className="bg-[#172B4D]  w-60 h-full p-5 fixed">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#A7EBF2]">OBJ-DETECTION</h2>
      <nav className="flex flex-col gap-4 text-md text-white">
        <a href="/" className="hover:text-yellow-300">Dashboard</a>
        <a href="/object-detection" className="text-yellow-300 font-bold hover:text-yellow-300">Object Detetion</a>
        <a href="/history" className="hover:text-yellow-300">Lịch sử kết quả</a>
        <a href="/logs" className="hover:text-yellow-300">Lịch sử thao tác</a>
      </nav>
    </div>
  )
}
