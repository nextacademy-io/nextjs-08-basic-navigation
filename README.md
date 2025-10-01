# Next.js Workshop: Basic Navigation (App Router)

In this task you'll implement basic navigation using the [Next.js App Router](https://nextjs.org/docs/app) to create separate routes for clashes and peers. You'll refactor the existing code structure and create a navigation component for better user experience.

## App Router Setup

Before you proceed, make sure you're familiar with the [Next.js App Router fundamentals](https://nextjs.org/docs/app/building-your-application/routing) and understand how _file-based routing_ works.

### Create the route structure

Create the following file structure in your `src/app` directory:

```
src/app/
├── layout.tsx (existing)
├── page.tsx (existing - will be updated)
├── clashes/
│   └── page.tsx
└── peers/
    └── page.tsx
```

> [!TIP]
> Learn more about [creating routes](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) in the Next.js documentation.

### Refactor ClashList Component

Create a new `ClashList` component to separate concerns:

```
src/components/
├── clash-list/
│   ├── index.ts
│   ├── clash-list.tsx
│   └── clash-card/
│       ├── index.ts
│       └── clash-card.tsx
└── profile-picture/ (existing)
```

`src/components/clash-list/clash-list.tsx`:

```tsx
'use client';

import { useQuery } from '@apollo/client/react';
import gql from 'graphql-tag';
import { ClashCard } from './clash-card';
import { GetClashesQuery } from '@/gql/graphql';

const GetClashes = gql`
  query GetClashes {
    clashes {
      id
      title
      pictureUrl
      participants {
        id
        pictureUrl
      }
    }
  }
`;

export const ClashList: React.FC = () => {
  const { data, loading, error } = useQuery<GetClashesQuery>(GetClashes);

  if (loading) return <div className="p-24">Loading clashes...</div>;
  if (error) return <div className="p-24">Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data?.clashes?.map((clash) => (
        <ClashCard key={clash.id} clash={clash} />
      ))}
    </div>
  );
};
```

> [!IMPORTANT]
> Move the existing `clash-card` component from `src/components/clash-card/` to `src/components/clash-list/clash-card/` and update all import statements accordingly.

### Create App Navigation Component

Create a navigation component to handle routing between pages:

`src/components/app-navbar/app-navbar.tsx`:

```tsx
import Link from 'next/link';

export const AppNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-4">
        <Link href="/clashes" className="hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          Clashes
        </Link>
        <Link href="/peers" className="hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          Peers
        </Link>
      </div>
    </nav>
  );
};
```

`src/components/app-navbar/index.ts`:

```ts
export { AppNavbar } from './app-navbar';
```

> [!TIP]
> Learn more about the [Link component](https://nextjs.org/docs/app/api-reference/components/link) and [navigation](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating) in Next.js.

### Update Layout

Update your `src/app/layout.tsx` to include the navigation:

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/apollo/client';
import { AppNavbar } from '@/components/app-navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Clash App',
  description: 'Next.js GraphQL Workshop Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloWrapper>
          <AppNavbar />
          <main className="min-h-screen">{children}</main>
        </ApolloWrapper>
      </body>
    </html>
  );
}
```

### Configure Routes

#### Root Route (`src/app/page.tsx`)

Update the root route to redirect to clashes:

```tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/clashes');
}
```

> [!TIP]
> Learn more about [redirects](https://nextjs.org/docs/app/building-your-application/routing/redirecting) in Next.js.

#### Clashes Route (`src/app/clashes/page.tsx`)

```tsx
import { ClashList } from '@/components/clash-list';

export default function ClashesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Clashes</h1>
      <ClashList />
    </div>
  );
}
```

#### Peers Route (`src/app/peers/page.tsx`)

```tsx
export default function PeersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Peers</h1>
      <div className="text-gray-600">
        <p>Peers functionality will be implemented in the next workshop.</p>
      </div>
    </div>
  );
}
```

## Navigation Features

### Active Link Styling

Consider implementing active link styling using [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname):

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const AppNavbar: React.FC = () => {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    cn(
      'px-3 py-2 rounded transition-colors',
      pathname === href ? 'bg-gray-700 text-white' : 'hover:bg-gray-700',
    );

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-4">
        <Link href="/clashes" className={linkClass('/clashes')}>
          Clashes
        </Link>
        <Link href="/peers" className={linkClass('/peers')}>
          Peers
        </Link>
      </div>
    </nav>
  );
};
```

> [!TIP]
> Learn more about [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) and client-side navigation hooks.

## Testing Navigation

After implementing the navigation:

1. Navigate to `http://localhost:3001` - should redirect to `/clashes`
2. Click on "Clashes" link - should display the clash list
3. Click on "Peers" link - should display the peers placeholder page
4. Use browser back/forward buttons - should work correctly
5. Direct URL access - `/clashes` and `/peers` should work when accessed directly

> [!IMPORTANT]
> Make sure to test both client-side navigation (clicking links) and direct URL access to ensure your routes work properly.

## File Structure Summary

After completing this task, your file structure should look like:

```
src/
├── app/
│   ├── layout.tsx (updated)
│   ├── page.tsx (updated - redirects to /clashes)
│   ├── clashes/
│   │   └── page.tsx
│   └── peers/
│       └── page.tsx
├── components/
│   ├── app-navbar/
│   │   ├── index.ts
│   │   └── app-navbar.tsx
│   ├── clash-list/
│   │   ├── index.ts
│   │   ├── clash-list.tsx
│   │   └── clash-card/
│   │       ├── index.ts
│   │       └── clash-card.tsx
│   └── profile-picture/ (existing)
└── apollo/ (existing)
```

## Next Steps

In the next tasks, you'll implement:

- Peers listing with GraphQL queries
- Individual clash and peer detail pages using [dynamic routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- More advanced navigation patterns
