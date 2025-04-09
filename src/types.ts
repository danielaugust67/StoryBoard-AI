export type Genre = 'fantasi' | 'horor' | 'misteri' | 'romantis' | 'petualangan';

export type Choice = {
  text: string;
  options: string[];
};

export type Outcome = {
  text: string;
  impact: number;
};

export type GameState = {
  genre: Genre | null;
  currentStep: number;
  choices: number[];
  karma: number;
  storyTitle: string;
  opening: string;
  conflict: string;
  currentChoice: Choice | null;
  currentOutcome: Outcome | null;
  isGenerating: boolean;
  isComplete: boolean;
  ending: string | null;
};