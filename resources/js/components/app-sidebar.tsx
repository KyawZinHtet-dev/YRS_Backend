import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookUser, CalendarArrowUp, LayoutGrid, ShieldUser, TrainFront, TrainTrack, Users, Wallet, WalletCards } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Stations',
        href: '/stations',
        icon: TrainFront,
    },
    {
        title: 'Routes',
        href: '/routes',
        icon: TrainTrack,
    },
    {
        title: 'Admin Users',
        href: '/admin-users',
        icon: ShieldUser,
    },
    {
        title: 'Ticket Inspectors',
        href: '/ticket-inspectors',
        icon: BookUser,
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Wallets',
        href: '/wallets',
        icon: Wallet,
    },
    {
        title: 'Transactions',
        href: '/wallet-transactions',
        icon: WalletCards,
    },
    {
        title: 'Top Up History',
        href: '/top-up-history',
        icon: CalendarArrowUp,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
