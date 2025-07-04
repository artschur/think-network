import type React from 'react';
import type { Metadata } from 'next';
import { ClerkProvider, SignInButton, SignedOut } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { ModeToggle } from '@/components/theme-toggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Think Network',
  description: 'Social media for thinkers',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark:text-white`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
              <main className="w-full min-h-full flex flex-col items-center">
                <nav className="sticky top-0 h-14 bg-background z-10 border-b w-full flex items-center justify-between px-4">
                  <SidebarTrigger />
                  <SignedOut>
                    <SignInButton mode="modal" />
                  </SignedOut>
                  <ModeToggle />
                </nav>
                <AppSidebar />
                <div className="w-full px-8 py-4 md:px-8 md:py-8">{children}</div>
              </main>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
