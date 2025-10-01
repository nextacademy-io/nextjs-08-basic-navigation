'use client';

'use client';

import { useQuery } from '@apollo/client/react';
import gql from 'graphql-tag';
import { ClashCard } from '@/components/clash-card';
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

export default function Home() {
  const { data, loading, error } = useQuery<GetClashesQuery>(GetClashes);

  if (loading) return <div className="p-24">Loading...</div>;
  if (error) return <div className="p-24">Error: {error.message}</div>;

  return (
    <main className="p-24 flex flex-col gap-8">
      <h1 className="text-3xl font-bold underline">Clash List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.clashes?.map((clash) => (
          <ClashCard key={clash.id} clash={clash} />
        ))}
      </div>
    </main>
  );
}
