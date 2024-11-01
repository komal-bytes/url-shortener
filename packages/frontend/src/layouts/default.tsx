import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
  page,
  setPage
}: {
  children: React.ReactNode;
  page: string;
  setPage: Function
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar page={page} setPage={setPage} />
      <main className="flex-grow overflow-y-scroll my-3 w-screen">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Built with by ❤️</span>
          <p className="text-primary">Komal Tolambia</p>
        </Link>
      </footer>
    </div>
  );
}
