export const MATCH_MATRICES: Record<number, Record<number, number[][]>> = {
    5: {
        1: [
            // matrix for 5 teams, 1 field
            [1, 2, 3],
            [1, 4, 5],
            [4, 2, 3],
            [1, 2, 5],
            [4, 5, 3]
        ],
        2: [
            // matrix for 5 teams, 2 field
            [2, 3, 4],
            [5, 1, 2],
            [3, 4, 5],
            [1, 2, 3],
            [4, 5, 1]
        ]
    },
    6: {
        1: [
            // ...matrix for 6 teams, 1 field...
            [1, 2, 3],
            [1, 4, 5],
            [4, 2, 3],
            [1, 2, 5],
            [1, 2, 5],
            [4, 5, 3]
        ],
        2: [
            // ...matrix for 6 teams, 2 fields...
            [1, 2, 3],
            [1, 4, 5],
            [4, 2, 3],
            [1, 2, 5],
            [1, 2, 5],
            [4, 5, 3]
        ]
    },
    // Add more team sizes as needed
};