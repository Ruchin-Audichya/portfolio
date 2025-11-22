export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: "windows" | "office" | "server" | "combo";
    icon: string;
    features: string[];
    deliveryTime: string;
    warranty: string;
    popular?: boolean;
    new?: boolean;
}

export const products: Product[] = [
    {
        id: "windows-pro",
        name: "Windows 10/11 Pro",
        description: "Retail Key - Lifetime Activation",
        price: 524,
        originalPrice: 349,
        category: "windows",
        icon: "💻",
        features: [
            "Lifetime Activation",
            "100% Genuine Retail Key",
            "Instant Delivery",
            "Works on 1 PC"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days",
        popular: true
    },
    {
        id: "office-2021-pro",
        name: "Office 2021 Pro Plus",
        description: "Account Bind Key - Full Suite",
        price: 2399,
        originalPrice: 1599,
        category: "office",
        icon: "📦",
        features: [
            "Word, Excel, PowerPoint, Outlook",
            "OneNote, Publisher, Access",
            "Account Bind Security",
            "Lifetime License"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days",
        popular: true
    },
    {
        id: "office-telephone",
        name: "Office 2019/2021",
        description: "Telephone Activation Key",
        price: 900,
        originalPrice: 600,
        category: "office",
        icon: "💼",
        features: [
            "Telephone Activation Method",
            "Full Office Suite",
            "One-time Purchase",
            "No Subscription"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days"
    },
    {
        id: "office-2024",
        name: "Office 2024 Professional Plus",
        description: "Latest Version - New Arrival",
        price: 1499,
        originalPrice: 999,
        category: "office",
        icon: "📀",
        features: [
            "Latest 2024 Version",
            "All Premium Apps",
            "Enhanced AI Features",
            "Cloud Integration"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days",
        new: true
    },
    {
        id: "combo-deal",
        name: "Windows + Office 2021 Combo",
        description: "Best Value Bundle",
        price: 2699,
        originalPrice: 1799,
        category: "combo",
        icon: "🧨",
        features: [
            "Windows 10/11 Pro Key",
            "Office 2021 Pro Plus",
            "Maximum Savings",
            "Complete Productivity Suite"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days",
        popular: true
    },
    {
        id: "office-mac",
        name: "Office 2021 for Mac",
        description: "Home and Business Edition",
        price: 3900,
        originalPrice: 2600,
        category: "office",
        icon: "🍎",
        features: [
            "macOS Compatible",
            "Home & Business Apps",
            "Optimized for M1/M2/M3",
            "Native Apple Silicon"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days"
    },
    {
        id: "windows-server",
        name: "Windows Server 2019/2022",
        description: "Standard/Datacenter Edition",
        price: 1875,
        originalPrice: 1250,
        category: "server",
        icon: "🖥",
        features: [
            "Enterprise Grade",
            "Standard/Datacenter Options",
            "Unlimited VMs (Datacenter)",
            "Advanced Security"
        ],
        deliveryTime: "1-5 minutes",
        warranty: "30 days"
    }
];

export const shopInfo = {
    established: "2019",
    deliveryTime: "1-5 minutes",
    warranty: "30 days",
    paymentMethods: ["UPI", "PhonePe", "Paytm"],
    email: "ruchinaudichya09@gmail.com",
    guarantees: [
        "100% Genuine Keys",
        "Lifetime Activation",
        "Fast Delivery",
        "Account-Safe Bind Option",
        "Bulk Discounts Available",
        "Trusted Since 2019"
    ]
};
