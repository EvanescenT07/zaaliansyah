import { Logo } from "@/components/layout/logo";
import { Navbar } from "@/components/layout/navbar-index";

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Logo />
      {children}
    </>
  );
}
