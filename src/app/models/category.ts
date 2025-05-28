export type Category = {
    id: number;
    name: string;
    teams: string[];
    numberOfFields: number;
    displayMatrix: (string | number)[][];
};
