// ⚠️ TEMPORAL: mock mientras el backend no crea conversaciones reales. Borrar cuando esté resuelto.
export const MOCK_CONVERSATIONS = [
  {
    id: 'mock-conv-1',
    otherUser: {
      _id: 'mock-other-user-1',
      full_name: 'Alex Rivers',
      display_name: 'Alex',
      avatar_url: 'https://placehold.co/100x100',
    },
    lastMessageBody: 'Hey! Ready for tomorrow?',
    lastMessageSender: 'mock-other-user-1',
  },
  {
    id: 'mock-conv-2',
    otherUser: {
      _id: 'mock-other-user-2',
      full_name: 'Sarah Chen',
      display_name: 'Sarah',
      avatar_url: 'https://placehold.co/100x100',
    },
    lastMessageBody: 'Thanks for the ride, see you!',
    lastMessageSender: 'mock-other-user-2',
  },
  {
    id: 'mock-conv-3',
    otherUser: {
      _id: 'mock-other-user-3',
      full_name: 'Marcus Peña',
      display_name: 'Marcus',
      avatar_url: 'https://placehold.co/100x100',
    },
    lastMessageBody: "Can you confirm if you're passing by the plaza?",
    lastMessageSender: 'mock-other-user-3',
  },
];
