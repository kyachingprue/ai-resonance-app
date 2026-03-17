'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Skeleton } from '@/components/ui/skeleton';

import {
  OrganizationSwitcher,
  UserButton,
  useClerk,
  ClerkLoaded,
  ClerkLoading,
} from '@clerk/nextjs';

import {
  type LucideIcon,
  Home,
  LayoutGrid,
  AudioLines,
  Volume2,
  Settings,
  Headphones,
} from 'lucide-react';

import Link from 'next/link';

import { UsageContainer } from '@/features/billing/components/usage-container';
import { VoiceCreateDialog } from '@/features/voices/components/voice-create-dialog';

import { useState } from 'react';

interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavSectionProps {
  label?: string;
  items: MenuItem[];
  pathname: string;
}

function NavSection({ label, items, pathname }: NavSectionProps) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-[13px] uppercase text-muted-foreground">
          {label}
        </SidebarGroupLabel>
      )}

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={!!item.url}
                isActive={
                  item.url
                    ? item.url === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.url)
                    : false
                }
                onClick={item.onClick}
                tooltip={item.title}
                className="h-9 px-3 py-2 text-[13px] tracking-tight font-medium border border-transparent data-[active=true]:border-border data-[active=true]:shadow-[0px_1px_1px_0px_rgba(44,54,53,0.03),inset_0px_0px_0px_2px_white]"
              >
                {item.url ? (
                  item.url.startsWith('mailto') ? (
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  ) : (
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  )
                ) : (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  const clerk = useClerk();

  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  const mainMenuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      url: '/',
      icon: Home,
    },
    {
      title: 'Explore voices',
      url: '/voices',
      icon: LayoutGrid,
    },
    {
      title: 'Text to speech',
      url: '/text-to-speech',
      icon: AudioLines,
    },
    {
      title: 'Voice cloning',
      icon: Volume2,
      onClick: () => setVoiceDialogOpen(true),
    },
  ];

  const othersMenuItems: MenuItem[] = [
    {
      title: 'Settings',
      icon: Settings,
      onClick: () => clerk.openOrganizationProfile(),
    },
    {
      title: 'Help and support',
      url: 'mailto:business@codewithantonio.com',
      icon: Headphones,
    },
  ];

  return (
    <>
      <VoiceCreateDialog
        open={voiceDialogOpen}
        onOpenChange={setVoiceDialogOpen}
      />

      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-col gap-4 pt-4">
          {/* LOGO */}
          <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
            <Image
              src="/logo.svg"
              alt="Resonance"
              width={24}
              height={24}
              className="rounded-sm"
            />

            <span className="group-data-[collapsible=icon]:hidden font-semibold text-lg tracking-tighter text-foreground">
              Resonance
            </span>

            <SidebarTrigger className="ml-auto lg:hidden" />
          </div>

          {/* ORG SWITCHER FIX */}
          <SidebarMenu>
            <SidebarMenuItem>
              <ClerkLoading>
                <Skeleton className="h-8.5 w-full rounded-md border bg-white" />
              </ClerkLoading>

              <ClerkLoaded>
                <OrganizationSwitcher
                  hidePersonal
                  appearance={{
                    elements: {
                      rootBox: 'w-full group-data-[collapsible=icon]:w-auto',

                      organizationSwitcherTrigger:
                        'w-full justify-between bg-white border border-border rounded-md pl-1 pr-2 py-1',

                      organizationPreview: 'gap-2',

                      organizationPreviewAvatarBox: 'size-6 rounded-sm',

                      organizationPreviewTextContainer:
                        'text-xs tracking-tight font-medium group-data-[collapsible=icon]:hidden',

                      organizationSwitcherTriggerIcon:
                        'size-4 group-data-[collapsible=icon]:hidden',
                    },
                  }}
                />
              </ClerkLoaded>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <div className="border-b border-dashed border-border" />

        <SidebarContent>
          <NavSection items={mainMenuItems} pathname={pathname} />

          <NavSection
            label="Others"
            items={othersMenuItems}
            pathname={pathname}
          />
        </SidebarContent>

        <div className="border-b border-dashed border-border" />

        <SidebarFooter className="gap-3 py-3">
          <UsageContainer />

          <SidebarMenu>
            <SidebarMenuItem>
              {/* USER BUTTON FIX */}
              <ClerkLoading>
                <Skeleton className="h-8.5 w-full rounded-md border bg-white" />
              </ClerkLoading>

              <ClerkLoaded>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      rootBox: 'w-full group-data-[collapsible=icon]:w-auto',

                      userButtonTrigger:
                        'w-full justify-between bg-white border border-border rounded-md pl-1 pr-2 py-1',

                      userButtonOuterIdentifier:
                        'text-[13px] font-medium group-data-[collapsible=icon]:hidden',

                      userButtonAvatarBox: 'size-6',
                    },
                  }}
                />
              </ClerkLoaded>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
