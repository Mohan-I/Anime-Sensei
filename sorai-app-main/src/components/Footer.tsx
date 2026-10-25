import Link from "next/link";
import { Github } from "lucide-react";

const browseLinks = [
    { label: "Home", href: "/" },
    { label: "Most Popular", href: "/browse?type=popular" },
    { label: "Seasonal Anime", href: "/browse?type=season" },
    { label: "Upcoming Anime", href: "/browse?type=upcoming" },
    { label: "Top Airing", href: "/browse?type=airing" },
];

const genreLinks = [
    { label: "Action", href: "/browse?genre=1" },
    { label: "Romance", href: "/browse?genre=22" },
    { label: "Shounen", href: "/browse?genre=27" },
    { label: "Sci-Fi", href: "/browse?genre=24" },
    { label: "Fantasy", href: "/browse?genre=10" },
];

const seasonLinks = [
    { label: "Winter", href: "/browse?type=season-archive&year=2026&season=winter" },
    { label: "Spring", href: "/browse?type=season-archive&year=2026&season=spring" },
    { label: "Summer", href: "/browse?type=season-archive&year=2026&season=summer" },
    { label: "Fall", href: "/browse?type=season-archive&year=2026&season=fall" },
];

const formatLinks = [
    { label: "ONAs", href: "/browse?type=ona" },
    { label: "OVAs", href: "/browse?type=ova" },
    { label: "Specials", href: "/browse?type=special" },
    { label: "Movies", href: "/browse?type=movies" },
];

type FooterColumn = {
    title: string;
    links: { label: string; href: string }[];
};

const columns: FooterColumn[] = [
    { title: "Browse", links: browseLinks },
    { title: "Genres", links: genreLinks },
    { title: "Season 2026", links: seasonLinks },
    { title: "Formats", links: formatLinks },
];

export default function Footer() {
    return (
        <footer
            style={{ backgroundColor: "var(--color-footer-bg)" }}
            className="text-gray-400"
        >
            {/* Main content */}
            <div className="max-w-container mx-auto px-6 md:px-10 pt-14 pb-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-3 md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span
                                className="text-3xl text-white"
                                style={{
                                    fontFamily:
                                        "var(--font-marck-script), cursive",
                                }}
                            >
                                Sorai
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 max-w-[260px] mb-4">
                            Your personal space to track, organize, and discover
                            anime. Keep control of everything you watch.
                        </p>
                        <a
                            href="https://github.com/erickdc7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white transition-colors"
                            style={{ backgroundColor: "var(--color-glass-white-06)" }}
                        >
                            <Github size={18} />
                        </a>
                    </div>

                    {/* Dynamic columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4
                                className="text-xs font-semibold uppercase tracking-widest mb-4"
                                style={{ color: "var(--color-footer-heading)" }}
                            >
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div
                className="border-t"
                style={{ borderColor: "var(--color-glass-white-08)" }}
            >
                <div className="max-w-container mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <span>
                        Powered by{" "}
                        <a
                            href="https://tenrai.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors underline underline-offset-2"
                        >
                            Tenrai API
                        </a>
                    </span>
                    <span>© 2026 Sorai. All rights reserved.</span>
                    <span className="flex items-center gap-3">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Terms of Use</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
