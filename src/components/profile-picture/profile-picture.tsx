import Image from 'next/image';

export interface ProfilePictureProps {
  diameter?: number; // In pixels
  profileUrl?: string; // URL of the profile picture
  onClick?: (profileUrl: string) => void; // Optional click handler
}

export function ProfilePicture({
  diameter = 100,
  profileUrl = 'https://randomuser.me/api/portraits/men/1.jpg',
  onClick,
}: ProfilePictureProps): React.ReactNode {
  return (
    <div className="profile-picture max-w-fit" onClick={() => onClick?.(profileUrl)}>
      <Image
        src={profileUrl}
        alt="Profile Picture"
        width={diameter}
        height={diameter}
        className="rounded-full object-cover hover:opacity-70 transition-opacity duration-300 hover:cursor-pointer"
      />
    </div>
  );
}
