import RouteProtector from "./RouteProtector";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RouteProtector>{children}</RouteProtector>
      </body>
    </html>
  );
}
