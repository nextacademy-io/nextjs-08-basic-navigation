/* eslint-disable @next/next/no-img-element */
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
