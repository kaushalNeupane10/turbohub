import Navbar from "@/components/user/layout/Navbar";
import Footer from "@/components/user/layout/Footer";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
