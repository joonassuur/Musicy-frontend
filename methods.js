//method to pick random value from array
export const rand = e => e[Math.floor(Math.random() * e.length)]
export const log = e => console.log(e)
export const last = e => e[e.length-1]

export const lastObj = e => {
    const values = Object.values(e);
    const last = values[values.length-1];
    return last;
}
export const firstObj = e => {
    const values = Object.values(e);
    const first = values[0];
    return first;
}
export const secondObj = e => {
    if (e !== null || undefined) {
        const values = Object.values(e);
        const second = values[1];
        return second;
    }
    else {return null}
}

export const omitLast = e => {
    return e.slice(0, e.length-1)
}
