import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PromoBar } from "@/components/PromoBar";
import { auth } from "@/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const headerUser = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : null;
  return (
    <>
      <PromoBar />
      <Header user={headerUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
