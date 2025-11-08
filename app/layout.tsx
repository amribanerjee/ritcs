import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Funnel_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import type { User } from "@/app/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
  variable: "--font-funnel",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Needs Connect",
  description: "From the team at CIS!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  let initialUser: User | null = null;
  if (userCookie) {
    try {
      initialUser = JSON.parse(userCookie) as User;
    } catch (err) {
      initialUser = null;
    }
  }
  return (
    <html lang="en">
      <body
        className={`${funnelSans.className} ${geistSans.variable} ${geistMono.variable} ${funnelSans.variable} antialiased`}
      >
        <UserProvider initialUser={initialUser}>{children}</UserProvider>
      </body>
    </html>
  );
}
