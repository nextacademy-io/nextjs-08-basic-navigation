# Next.js Workshop: GraphQL and Clash List

In this task you'll setup the [Apollo Client](https://www.apollographql.com/docs/react) for accessing the [GraphQL](https://graphql.org) based [Clash API](https://github.com/nextacademy-io/clash-api). You'll create the _Clash List View_.

## Apollo Client Setup

Before you proceed, you might want to get familar with the [Apollo Client support for the Next.js App Router](https://github.com/apollographql/apollo-client-integrations/tree/main/packages/nextjs#apollo-client-support-for-the-nextjs-app-router).

### Install the required packages

```sh
npm install @apollo/client@latest @apollo/client-integration-nextjs graphql-tag
```

### Create the file structure

```
src/apollo
├── client
│   ├── apollo-wrapper.tsx
│   └── index.ts
└── server.ts
```

`src/apollo/client/apollo-wrapper.tsx`:

```tsx
'use client';
// ^ this file needs the "use client" pragma

import { HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: 'http://localhost:3000/graphql',
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: {
      // you can pass additional options that should be passed to `fetch` here,
      // e.g. Next.js-related `fetch` options regarding caching and revalidation
      // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
    },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { ... }}});
  });

  // use the `ApolloClient` from "@apollo/client-integration-nextjs"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/client-integration-nextjs"
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
```

`src/apollo/server.ts`:

```ts
import { HttpLink } from '@apollo/client';
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: 'http://localhost:3000/graphql',
      fetchOptions: {
        // you can pass additional options that should be passed to `fetch` here,
        // e.g. Next.js-related `fetch` options regarding caching and revalidation
        // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
      },
    }),
  });
});
```

### Update your `src/app/layout.tsx`

```tsx
import { ApolloWrapper } from '@/apollo/client';

// [...]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
```

## Apollo GraphQL for VS Code

If you haven't already installed the [Apollo GraphQL for VS Code](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo), please do so.

Place a `apollo.config.js` in the root of your project:

```js
module.exports = {
  client: {
    service: {
      name: 'clash',
      // URL to the GraphQL API
      url: 'http://localhost:3000/graphql',
    },
    // Files processed by the extension
    includes: ['src/**/*.tsx', 'src/**/*.ts'],
  },
};
```

## Setup GraphQL Codegen

In order to have generated TypeScript Types for your GraphQL Schema (and queries/ mutations used in your app), we need to install GraphQL Codegen (https://the-guild.dev/graphql/codegen/docs/getting-started)

### Installation with npm

```sh
npm i -D typescript @graphql-codegen/cli
```

### Initialization Wizard

```sh
npx graphql-code-generator init
```

Follow the questions and instructions of the Wizard carefully:

```
% npx graphql-code-generator init

    Welcome to GraphQL Code Generator!
    Answer few questions and we will setup everything for you.

? What type of application are you building? Application built with React
? Where is your schema?: (path or url) http://localhost:3000/graphql
? Where are your operations and fragments?: src/**/*.tsx
? Where to write the output: src/gql/
? Do you want to generate an introspection file? Yes
? How to name the config file? codegen.ts
? What script in package.json should run the codegen? codegen
Fetching latest versions of selected plugins...

    Config file generated at codegen.ts

      $ npm install

    To install the plugins.

      $ npm run codegen

    To run GraphQL Code Generator.
```

```sh
npm install
```

```sh
npm run codegen

> clash@0.1.0 codegen
> graphql-codegen --config codegen.ts

✔ Parse Configuration
⚠ Generate outputs
  ❯ Generate to src/gql/
    ✔ Load GraphQL schemas
    ✖
      Unable to find any GraphQL type definitions for the following pointers:
      - src/**/*.tsx
    ◼ Generate
  ❯ Generate to ./graphql.schema.json
    ✔ Load GraphQL schemas
    ✖
      Unable to find any GraphQL type definitions for the following pointers:
      - src/**/*.tsx
    ◼ Generate
```

> [!IMPORTANT]
> You might want to restart your VS Code.

## Setup Clash Api

### Clone the Clash API project

```sh
git clone https://github.com/nextacademy-io/clash-api.git
```

### Build

```sh
cd clash-api
```

```sh
npm install
```

### Start

```sh
npm start
```

You can explore the GraphQL based API at: http://localhost:3000/graphql

> [!TIP]
> You may want to familiarize yourself with the API before proceeding.

### ClashCard component

Create a ClashCard component:

```tsx
import { GetClashesQuery } from '@/gql/graphql';
import { ProfilePicture } from '../profile-picture';

export interface ClashCardProps {
  clash: GetClashesQuery['clashes'][number];
}

export const ClashCard: React.FC<ClashCardProps> = ({ clash }) => (
  <div className="border-2 border-gray-200 rounded-lg p-2 flex gap-2 flex-col shadow max-w-64 max-h-72">
    <img src={clash.pictureUrl} alt={clash.title} className="object-cover max-h-48 w-full" />
    <h2 className="border-b-2 w-full">{clash.title}</h2>
    <div className="flex flex-row gap-2 mb-2">
      {clash.participants.map((peer) => (
        <ProfilePicture key={peer.id} diameter={32} profileUrl={peer.pictureUrl} />
      ))}
    </div>
  </div>
);
```

## Query Clashes

We'd like to use our first query `GetClashes`.

`src/app/page.tsx`:

```tsx
import gql from 'graphql-tag';

const GetClashes = gql`
  query GetClashes {
    // TODO: implement me
  }
`;
```

> [!IMPORTANT]
> Make sure that code highlighting and auto completition is working.

```sh
npm run codegen
```

```tsx
const { data, loading } = useQuery<GetClashesQuery>(GetClashes);
```

## Apollo Client Devtools

Explore your application in the [Apollo Client Devtools](https://chromewebstore.google.com/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm).
