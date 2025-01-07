import Link from 'next/link';
import './navbar.css'

export default function NavBar() {
    return (
        <nav>
            <p>
                <Link href="/">Home</Link>
            </p>
            <p>
                <Link href="/sobre">Sobre mim</Link>
            </p>
        </nav>
    );
}
