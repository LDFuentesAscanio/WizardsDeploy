'use client';
//External libraries
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

interface UserCardProps {
  firstName: string;
  lastName: string;
  profession: string;
  avatarUrl: string;
  linkedin?: string | null;
  otherLink?: string | null;
}

export default function UserCard({
  firstName,
  lastName,
  profession,
  avatarUrl,
  linkedin,
  otherLink,
}: UserCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="relative w-full max-w-xs h-80 rounded-3xl overflow-hidden shadow-xl"
    >
      <Image
        src={avatarUrl}
        alt="User Avatar"
        fill
        className="object-cover w-full h-full"
        priority
      />

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-5 text-white">
        <h1 className="text-lg font-semibold">
          {firstName} {lastName}
        </h1>
        <p className="text-sm text-gray-200">{profession || 'No profession'}</p>

        <div className="mt-2 flex space-x-4">
          {linkedin && (
            <Link href={linkedin} target="_blank">
              <FaLinkedin className="w-6 h-6 hover:text-secondary" />
            </Link>
          )}
          {otherLink && (
            <Link href={otherLink} target="_blank">
              <FaGithub className="w-6 h-6 hover:text-secondary" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
