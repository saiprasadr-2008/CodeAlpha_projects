import type { Deck, Difficulty, Flashcard } from '../types';

export const DECK_SEEDS: Omit<Deck, 'createdAt'>[] = [
  { id: 'deck-java', name: 'Java Fundamentals', subject: 'Java', color: 'violet' },
  { id: 'deck-math', name: 'Maths: Core Concepts', subject: 'Mathematics', color: 'blue' },
  { id: 'deck-ai', name: 'AI Essentials', subject: 'Artificial Intelligence', color: 'mint' },
  { id: 'deck-general', name: 'Curiosity Cabinet', subject: 'General Knowledge', color: 'amber' },
];

type CardSeed = [string, string, string, Difficulty, string?];
const CARD_SEEDS: Record<string, CardSeed[]> = {
  'deck-java': [
    ['What is the difference between JDK, JRE, and JVM?', 'JVM executes bytecode; JRE bundles the JVM with runtime libraries; JDK includes the JRE plus development tools such as the compiler.', 'A quick memory cue: run, runtime, build.', 'Easy'],
    ['What does the `final` keyword mean for a Java variable?', 'A final variable can be assigned only once. For a reference, the reference cannot be reassigned, although the referenced object may still be mutable.', 'Think of the reference as a fixed label, not necessarily a frozen object.', 'Medium'],
    ['How does `equals()` differ from `==` when comparing objects?', '`==` checks whether two references point to the same object. `equals()` checks logical equality when a class overrides it.', 'String overrides equals() to compare character content.', 'Medium'],
    ['What is method overloading?', 'Defining multiple methods with the same name but different parameter lists in the same class. The compiler resolves the call at compile time.', 'Return type alone cannot distinguish overloaded methods.', 'Easy'],
    ['Why should a `HashMap` key keep a stable `hashCode()`?', 'Hash-based collections use hashCode to find a bucket and equals to find a matching key. Mutating key fields used by these methods can make an entry unreachable.', 'The equals/hashCode contract requires equal objects to have equal hash codes.', 'Hard'],
    ['What is the purpose of a Java interface?', 'An interface defines a contract of methods and constants that implementing classes agree to provide. Modern interfaces may also include default and static methods.', 'Interfaces help separate what a type can do from how it does it.', 'Easy'],
  ],
  'deck-math': [
    ['What is the quadratic formula for ax² + bx + c = 0?', 'x = (−b ± √(b² − 4ac)) / 2a, where a ≠ 0.', 'The discriminant b² − 4ac tells you how many real roots exist.', 'Easy'],
    ['What does the derivative of a function represent geometrically?', 'The slope of the function’s tangent line at a point; it describes the instantaneous rate of change.', 'For position over time, the derivative is velocity.', 'Medium'],
    ['What is the Pythagorean theorem?', 'For a right triangle with legs a and b and hypotenuse c: a² + b² = c².', 'Use it only when the triangle includes a right angle.', 'Easy'],
    ['How do you find the mean of a data set?', 'Add all values and divide by the number of values.', 'The mean is sensitive to outliers, unlike the median.', 'Easy'],
    ['What is the slope-intercept form of a straight line?', 'y = mx + b, where m is the slope and b is the y-intercept.', 'Slope is rise divided by run.', 'Easy'],
    ['What is the probability of two independent events both occurring?', 'Multiply their individual probabilities: P(A and B) = P(A) × P(B).', 'Independence means one event does not change the probability of the other.', 'Medium'],
  ],
  'deck-ai': [
    ['What is supervised learning?', 'A machine-learning approach that learns a mapping from labeled examples, where each training input is paired with a target output.', 'Classification and regression are common supervised tasks.', 'Easy'],
    ['What is overfitting?', 'When a model learns training-set details and noise too closely, performing well on training data but poorly on unseen data.', 'Regularization and a validation set can help detect or reduce it.', 'Medium'],
    ['What does a token represent in a language model?', 'A unit of text—such as a word, part of a word, or punctuation mark—used by the model’s tokenizer.', 'Tokens are not always complete words.', 'Easy'],
    ['What is the role of an activation function in a neural network?', 'It introduces non-linearity, enabling a network to represent complex relationships beyond a stack of linear transformations.', 'ReLU and sigmoid are familiar examples.', 'Medium'],
    ['What is a confusion matrix used for?', 'It summarizes predicted versus actual classes, making true positives, false positives, true negatives, and false negatives visible.', 'Precision and recall can be calculated from it.', 'Medium'],
    ['Why can a larger training data set improve a model?', 'More representative examples can help the model estimate patterns more reliably and generalize better, provided the data is relevant and well prepared.', 'More data does not automatically fix bias or poor labels.', 'Hard'],
  ],
  'deck-general': [
    ['Which planet has the most prominent ring system?', 'Saturn.', 'Jupiter, Uranus, and Neptune also have rings, but Saturn’s are brightest and easiest to observe.', 'Easy'],
    ['What is the capital city of Japan?', 'Tokyo.', 'Tokyo became the imperial capital in the 19th century.', 'Easy'],
    ['What is the chemical symbol for gold?', 'Au.', 'It comes from the Latin word aurum.', 'Easy'],
    ['Which ocean is the largest on Earth?', 'The Pacific Ocean.', 'It covers more area than all of Earth’s land combined.', 'Easy'],
    ['What is the process by which plants convert light into chemical energy?', 'Photosynthesis.', 'Plants use light, water, and carbon dioxide to make sugars and release oxygen.', 'Medium'],
    ['How many sides does a hexagon have?', 'Six.', 'The prefix “hexa-” means six.', 'Easy'],
  ],
};

export function createSeedDecks(now = new Date()): Deck[] {
  const createdAt = now.toISOString();
  return DECK_SEEDS.map((deck) => ({ ...deck, createdAt }));
}

export function createSeedCards(now = new Date()): Flashcard[] {
  const base = now.getTime();
  return Object.entries(CARD_SEEDS).flatMap(([deckId, cards]) =>
    cards.map(([question, answer, explanation, difficulty], index) => {
      const repetitions = index === 0 && deckId === 'deck-java' ? 4 : index === 2 && deckId === 'deck-ai' ? 3 : 0;
      const offsetDays = index % 3 === 0 ? -1 : index % 3 === 1 ? 0 : index + 1;
      return {
        id: `${deckId}-card-${String(index + 1).padStart(2, '0')}`,
        deckId,
        question,
        answer,
        subject: DECK_SEEDS.find((item) => item.id === deckId)?.subject ?? 'General',
        difficulty,
        explanation,
        createdAt: new Date(base - 14 * 86_400_000).toISOString(),
        nextReviewAt: new Date(base + offsetDays * 86_400_000).toISOString(),
        intervalDays: repetitions > 0 ? 10 : 0,
        easeFactor: 2.5,
        repetitions,
        lapses: 0,
        reviewLog: [],
      };
    }),
  );
}
