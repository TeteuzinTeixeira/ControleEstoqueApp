import NavBar from "../components/navbar/navBar";
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <NavBar/>
                <main>{children}</main>
            </body>
        </html>
    );
}
