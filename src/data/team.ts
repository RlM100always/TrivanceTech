export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// Real team members — keep in sync with the team shown on src/pages/About.tsx.
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Md. Rakib Hossain',
    role: 'CEO & Founder',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQFVSIKpkRw5FQ/profile-displayphoto-crop_800_800/B56Z866GhOGoAI-/0/1783399738471?e=1785369600&v=beta&t=N8KW4fVDVQzNbaqcDhICasW5Lm5qRR1DQKTNRR3kePs',
  },
  {
    name: 'Md Al Habib',
    role: 'Software Engineer & AI Developer',
    image: 'https://img.aitechworlds.com/profile/ChatGPT%20Image%20Jul%209%2C%202026%2C%2011_40_57%20AM.webp',
  },
  {
    name: 'Shamshur Rahman',
    role: 'Problem Solver and Cloud Expert',
    image: 'https://avatars.githubusercontent.com/u/109974472?v=4',
  },
  {
    name: 'Abdullah Al Arman Emon',
    role: 'Software Testing Expert & Prompt Engineer',
    image: 'https://img.aitechworlds.com/profile/ChatGPT%20Image%20Jul%209%2C%202026%2C%2001_31_41%20PM.webp',
  },
];
