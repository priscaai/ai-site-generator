export const metadata = {
  title: "Gerador de Sites com IA",
  description: "Crie um site automaticamente usando IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
