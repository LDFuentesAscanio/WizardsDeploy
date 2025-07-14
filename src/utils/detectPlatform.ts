import {
  FaLinkedin,
  FaGithub,
  FaGitlab,
  FaBitbucket,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaBehance,
  FaDribbble,
  FaGlobe,
} from 'react-icons/fa';

export const getPlatformIcon = (url: string) => {
  if (!url) return null;

  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`)
      .hostname;

    if (domain.includes('linkedin.com')) return FaLinkedin;
    if (domain.includes('github.com')) return FaGithub;
    if (domain.includes('gitlab.com')) return FaGitlab;
    if (domain.includes('bitbucket.org')) return FaBitbucket;
    if (domain.includes('twitter.com') || domain.includes('x.com'))
      return FaTwitter;
    if (domain.includes('facebook.com')) return FaFacebook;
    if (domain.includes('instagram.com')) return FaInstagram;
    if (domain.includes('youtube.com')) return FaYoutube;
    if (domain.includes('behance.net')) return FaBehance;
    if (domain.includes('dribbble.com')) return FaDribbble;

    return FaGlobe; // Default for other domains
  } catch {
    return null;
  }
};
