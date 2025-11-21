});

export const metadata: Metadata = {
  title: "Ruchin Audichya | Precision in Motion",
  description: "Orchestrating digital experiences. Portfolio of Ruchin Audichya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-accent selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
