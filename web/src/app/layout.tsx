import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Joy Division Generator",
    description: "Generate Joy Division style SVG plots",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
