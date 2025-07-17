import '@/styles/globals.css';
import Link from 'next/link';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <header>jaimervq.xyz</header>
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/resume">Resume</Link>
                    <Link href="/hobbies">Hobbies</Link>
                    <Link href="/contact">Contact</Link>
                </nav>

                <main>{children}</main>

                <footer>
                    &copy; {new Date().getFullYear()} JaimeRVQ — Built with Rust + Next.js
                </footer>
            </body>
        </html>
    );
}