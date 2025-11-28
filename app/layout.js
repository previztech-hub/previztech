import './globals.css'

export const metadata = {
  title: 'Previz Website',
  description: 'Previz Private Limited — Previsualization & VFX',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}
