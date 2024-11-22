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
      <main className="flex-grow overflow-y-scroll w-full max-w-[1280px] m-auto my-3">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">

        <p className="flex items-center gap-1 text-current">
          <span className="text-default-600">Built with ❤️ by </span>
          <Link
            isExternal
            href="https://komal.codes"
            title="nextui.org homepage"
          >
            <span className="text-primary">Komal Tolambia</span>
          </Link>
        </p>
      </footer>
    </div>
  );
}
