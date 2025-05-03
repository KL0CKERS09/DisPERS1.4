import { NextResponse } from 'next/server';

export async function GET() {
  const slideContent = [
    {
      title: 'SAFENET',
      text: 'An online platform designed to broadcast urgent notifications...',
      showButton: true,
    },
    {
      title: 'Slide 2',
      text: 'Second slide text...',
      showButton: false,
    },
    {
      title: 'Slide 3',
      text: 'Third slide text...',
      showButton: false,
    },
    {
      title: 'Slide 4',
      text: '',
      showButton: false,
    },
    {
      title: 'Slide 5',
      text: '',
      showButton: false,
    },
    {
      title: 'Slide 6',
      text: '',
      showButton: false,
    },
  ];

  return NextResponse.json(slideContent);
}
