import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ResultsHistoryPage() {
    return (
        <div className="flex min-h-screen bg-[#f4f6fa]">
            <div className="w-60 shadow-lg ">
                <Sidebar />
            </div>
            <main className="flex-1 p-5">
                <div className="bg-[#172B4D] shadow-md p-2 ">
                    <h1 className="text-3xl font-bold text-[#A7EBF2] text-center">
                        <Header title={"Results History"} />
                    </h1>
                </div>
            <div>Results History</div>                          
        </main>
        </div>
    )
}