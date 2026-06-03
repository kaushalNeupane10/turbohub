import Navbar from "@/components/user/layout/Navbar";
export default function layout({children} : {children: React.ReactNode}) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      
    </>
  );
}
