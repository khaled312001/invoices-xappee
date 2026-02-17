import Header from "@/components/header/header";
import "../globals.css";
import Footer from "@/components/footer/footer";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-[var(--container-height)] w-full py-4 px-10 ">
        {children}
      </div>
      <Footer />
    </>
  );
}
