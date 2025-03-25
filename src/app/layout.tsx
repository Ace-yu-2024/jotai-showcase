import { GlobalStateWrapper } from './GlobalStateWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="zh">
      <body>
        {children}
        <GlobalStateWrapper />
      </body>
    </html>
  );
}