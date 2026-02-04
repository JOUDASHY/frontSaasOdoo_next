import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar isAdmin={true} />
            <div className="sm:ml-72 flex flex-col min-h-screen">
                <Navbar />
                <main className="p-4 lg:p-10 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
