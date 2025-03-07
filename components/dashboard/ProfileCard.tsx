// components/dashboard/ProfileCard.tsx
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotifyProfile } from "@/types/types";

interface ProfileCardProps {
  profile: SpotifyProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Welcome, {profile.display_name}</CardTitle>
        <CardDescription>Here is a quick glimpse of your spotify profile</CardDescription>
      </CardHeader>
      <CardContent>
        {profile.images?.[0]?.url ? (
          <Image
            src={profile.images[0].url}
            alt="Profile"
            width={100}
            height={100}
            priority
            className="rounded-lg"
          />
        ) : (
          <Image
            src={'https://res.cloudinary.com/dstyssopl/image/upload/v1741248395/default-profile-pic_swvgmz.jpg'}
            alt="Profile"
            width={100}
            height={100}
            priority
            className="rounded-lg"
          />
        )}
        <Badge variant={"default"} className="capitalize mt-2">{profile.product}</Badge>
        <p>Email: {profile.email}</p>
        <p>Spotify ID: {profile.id}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant={'secondary'}>
          <Link href={profile.external_urls.spotify} target="_blank">
            Check out my Profile on Spotify
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileCard;