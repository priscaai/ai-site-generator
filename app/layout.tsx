export const metadata = {
  title: "AI Site Generator da Pri",
  description: "Gerador de sites usando IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
