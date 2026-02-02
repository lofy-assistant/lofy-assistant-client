import AppNavbar from "@/components/app-navbar";
import Footer from "@/components/brochure/home/footer";

export default function BrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
