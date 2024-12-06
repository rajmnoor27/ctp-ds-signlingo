export type QuizContent = {
  id: number;
  title: string;
  letters: string[];  // Letters being tested in this quiz
};

export const quizData: QuizContent[] = [
  {
    id: 1,
    title: 'Quiz 1',
    letters: ['A', 'B', 'C', 'D'],
  },
  {
    id: 2,
    title: 'Quiz 2',
    letters: ['E', 'F', 'G', 'H'],
  },
  {
    id: 3,
    title: 'Quiz 3',
    letters: ['I', 'J', 'K', 'L'],
  },
  {
    id: 4,
    title: 'Quiz 4',
    letters: ['M', 'N', 'O', 'P'],
  },
  {
    id: 5,
    title: 'Quiz 5',
    letters: ['Q', 'R', 'S', 'T'],
  },
  {
    id: 6,
    title: 'Quiz 6',
    letters: ['U', 'V', 'W', 'X'],
  },
  {
    id: 7,
    title: 'Quiz 7',
    letters: ['Y', 'Z'],
  },
]; 