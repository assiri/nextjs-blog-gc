import Image from "next/image";
import Link from "next/link";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = (
    <header>
      <div className="text-center bg-slate-800 p-8 my-6 rounded-md">
        <Image
          src="/logo.png"
          width={40}
          height={40}
          className="mx-auto"
          alt={"logo"}
        />
        <Link
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          href="/inv"
        >
          Invoice فواتير
        </Link>
        <Link href="/">
          <h1 className="text-2xl text-white font-bold mt-4">IaTeam's Blog</h1>
        </Link>
        <p className="text-slate-300">🤟 Welcome to my tech blog. 💻</p>
      </div>
    </header>
  );

  const footer = (
    <footer>
      <div className="border-t border-slate-400 mt-12 py-6 text-center text-slate-400">
        <h3>Designed by IaTeam</h3>
      </div>
    </footer>
  );

  return (
    <html>
      <head />
      <body>
        <div className="mx-auto  max-w-2xl px-6">
          {header}
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
