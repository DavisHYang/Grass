/**
 * Restricts the range of a number from
 * [0, 1]
 * @param i the number to clamp
 * @returns the result of clamping i 
 */
export const clamp = (x : number) : number => {
    return Math.min(Math.max(x, 0.0), 1.0);
}