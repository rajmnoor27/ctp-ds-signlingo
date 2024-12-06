export type LessonContent = {
  id: number;
  title: string;
  letters: string[];
  description: string;
};

export const lessonData: LessonContent[] = [
  {
    id: 1,
    title: 'Lesson 1',
    letters: ['A', 'B', 'C', 'D'],
    description: 'Learn the first set of ASL alphabet letters: A, B, C, and D',
  },
  {
    id: 2,
    title: 'Lesson 2',
    letters: ['E', 'F', 'G', 'H'],
    description: 'Learn ASL alphabet letters: E, F, G, and H',
  },
  {
    id: 3,
    title: 'Lesson 3',
    letters: ['I', 'J', 'K', 'L'],
    description: 'Learn ASL alphabet letters: I, J, K, and L',
  },
  {
    id: 4,
    title: 'Lesson 4',
    letters: ['M', 'N', 'O', 'P'],
    description: 'Learn ASL alphabet letters: M, N, O, and P',
  },
  {
    id: 5,
    title: 'Lesson 5',
    letters: ['Q', 'R', 'S', 'T'],
    description: 'Learn ASL alphabet letters: Q, R, S, and T',
  },
  {
    id: 6,
    title: 'Lesson 6',
    letters: ['U', 'V', 'W', 'X'],
    description: 'Learn ASL alphabet letters: U, V, W, and X',
  },
  {
    id: 7,
    title: 'Lesson 7',
    letters: ['Y', 'Z'],
    description: 'Learn the final ASL alphabet letters: Y and Z',
  },
];
