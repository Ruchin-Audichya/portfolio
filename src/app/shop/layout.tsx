import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Software Licenses - Genuine Windows & Office Keys | Ruchin Audichya",
    description: "Purchase genuine lifetime Windows 10/11, Office 2021/2024, and Windows Server licenses. Fast delivery in 1-5 minutes. 30-day warranty. Trusted since 2019.",
    keywords: ["Windows license", "Office license", "Windows 10", "Windows 11", "Office 2021", "Office 2024", "genuine keys", "lifetime activation"],
    openGraph: {
        title: "Genuine Software Licenses - Windows & Office",
        description: "Lifetime activation keys with fast delivery and 30-day warranty. Trusted since 2019.",
        type: "website",
    },
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
