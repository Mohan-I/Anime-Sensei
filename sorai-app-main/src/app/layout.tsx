import type { Metadata } from "next";
import { Nunito_Sans, Bebas_Neue, Marck_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";

const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-nunito-sans",
    adjustFontFallback: false,
});

const bebasNeue = Bebas_Neue({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-bebas-neue",
});

const marckScript = Marck_Script({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-marck-script",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://sorai-app.vercel.app"),
    title: {
        default: "Sorai",
        template: "%s | Sorai",
    },
    description:
        "Explore, search, and organize your personal anime list. Track what you watch, your scores, and much more.",
    openGraph: {
        title: "Sorai",
        description:
            "Your personal anime tracker. Explore, search, and organize your anime list.",
        url: "https://sorai-app.vercel.app",
        siteName: "Sorai",
        images: [
            {
                url: "/icon.png",
                width: 512,
                height: 512,
                alt: "Sorai Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Sorai",
        description:
            "Your personal anime tracker. Explore, search, and organize your anime list.",
        images: ["/icon.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    },
    icons: {
        icon: "/icon.png",
        shortcut: "/icon.png",
        apple: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${nunitoSans.variable} ${bebasNeue.variable} ${marckScript.variable}`}
            suppressHydrationWarning
        >
            <body className="font-sans min-h-screen">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <AuthProvider>
                        <Navbar />
                        <AuthModal />
                        {children}
                        <Footer />
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                },
                            }}
                            richColors
                        />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
