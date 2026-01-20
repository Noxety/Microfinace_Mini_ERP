import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CableIcon, Coins, Key, LayoutGrid, LocateIcon, Settings, Shield, StoreIcon, User2, UserCircle, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth.user;
    console.log(user);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Add PMS navigation items
    // const pmsNavItems: NavItem[] = [
    //     {
    //         title: 'Projects',
    //         href: '/projects',
    //         icon: Briefcase,
    //     },
    //     {
    //         title: 'Tasks',
    //         href: '/tasks',
    //         icon: Folder,
    //     },
    // ];

    // Add admin navigation items
    const adminNavItems: NavItem[] = [
        {
            title: 'Users',
            href: '/users',
            icon: Users,
        },
        {
            title: 'Roles',
            href: '/roles',
            icon: Shield,
        },
        {
            title: 'Permissions',
            href: '/permissions',
            icon: Key,
        },
    ];
    const CustomerNavItem: NavItem[] = [
        {
            title: 'Credit Limits',
            href: '/creditlevels',
            icon: Coins,
        },
        {
            title: 'Customers',
            href: '/customers',
            icon: UserCircle,
        },
    ];
    const masterNavItems: NavItem[] = [
        {
            title: 'Currency',
            href: '/currencies',
            icon: Coins,
        },
        {
            title: 'Departments',
            href: '/departments',
            icon: CableIcon,
        },
        {
            title: 'Locations',
            href: '/locations',
            icon: LocateIcon,
        },
        {
            title: 'Branches',
            href: '/branches',
            icon: StoreIcon,
        },
    ];
    const footerNavItems: NavItem[] = [];

    const navGroups: NavGroup[] = [];

    // All users can access PMS features
    // navGroups.push({
    //     title: 'Project Management',
    //     items: pmsNavItems,
    // });

    // Only admins can access admin features
    if (user.roles?.includes('admin')) {
        navGroups.push({
            title: 'Master Setup',
            items: masterNavItems,
            icon: Settings,
        });
        navGroups.push({
            title: 'Customers Setup',
            items: CustomerNavItem,
            icon: User2,
        });
        navGroups.push({
            title: 'Administration',
            items: adminNavItems,
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
