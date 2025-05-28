export type Category = {
    id: number; // Unique identifier for the category
    name: string;
    teams: string[];
    displayMatrix: (string | number)[][];
};
