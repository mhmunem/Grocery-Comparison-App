// An ugly hack to deal with the fact that the front end code is a mess.
export function getUnit(str: number): string {
    let unit = ((str as unknown) as string)
    if (unit[-1] === 'g') {
        if (unit[-2] === 'k') {
            unit = 'kg'
        } else {
            unit = 'g'
        }
    } else if (unit[-2] === 'l') {
        if (unit[-2] === 'm') {
            unit = 'ml'
        } else {
            unit = 'l'
        }
    } else if (unit[-1] === 'k') {
        unit = 'pk'
    } else {
        unit = 'ea'
    }

    return unit
}

export function getDigitsStr(str: any): number {
    let digit = ""
    const rev_str = str.split('').reverse()

    for (let i = 0; i < rev_str.length; ++i) {
        if (!isNaN(Number(str[i]))) {
            digit += str[i]
        }
    }

    return Number(digit)
}
