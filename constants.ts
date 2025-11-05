import { Project, SurveyQuestion } from './types';

export const INITIAL_PROJECTS: Project[] = [];

// Default survey questions based on UX research best practices.
// These will be used as a fallback if no questions are found in the database.
export const INITIAL_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'd1b2c3a4-1111-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:00:00Z',
    label: 'How satisfied are you with our app?',
    type: 'rating',
    description: 'Rate your overall satisfaction on a scale of 1 to 5 stars.',
    required: true,
    display_order: 1,
  },
  {
    id: 'd1b2c3a4-2222-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:01:00Z',
    label: 'How easy was it to navigate the app today?',
    type: 'rating',
    description: 'Rate the ease of finding what you were looking for.',
    required: true,
    display_order: 2,
  },
    {
    id: 'd1b2c3a4-5555-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:04:00Z',
    label: 'Rate our app design’s visual appeal.',
    type: 'rating',
    description: 'How visually pleasing do you find the interface?',
    required: true,
    display_order: 3,
  },
  {
    id: 'd1b2c3a4-3333-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:02:00Z',
    label: 'Which feature do you use most, and why?',
    type: 'textarea',
    description: 'Let us know which part of the app is most valuable to you.',
    required: true,
    placeholder: 'Describe the feature you use most and what makes it valuable to you...',
    display_order: 4,
  },
  {
    id: 'd1b2c3a4-6666-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:05:00Z',
    label: 'What would you change to improve your experience?',
    type: 'textarea',
    description: 'What single improvement would most enhance your experience?',
    required: true,
    placeholder: 'Tell us about one thing we could do better...',
    display_order: 5,
  },
  {
    id: 'd1b2c3a4-4444-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:03:00Z',
    label: 'Did you encounter any issues or bugs?',
    type: 'textarea',
    description: 'Please be as specific as possible.',
    required: false,
    placeholder: 'Describe any problems you ran into...',
    display_order: 6,
  },
  {
    id: 'd1b2c3a4-8888-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:07:00Z',
    label: 'What device and OS are you using?',
    type: 'text',
    required: false,
    placeholder: 'e.g., iPhone 15, Android 14',
    display_order: 7,
  },
  {
    id: 'd1b2c3a4-9999-4b1e-a2e7-0a1b2c3d4e5f',
    created_at: '2023-10-27T10:08:00Z',
    label: 'Any other feedback?',
    type: 'textarea',
    description: 'Share any final thoughts, ideas, or comments you have.',
    required: false,
    placeholder: 'Your feedback is valuable to us...',
    display_order: 8,
  },
];