function getDigitsStr(str: any): number {
    let digit = ""
    const rev_str = str.split('').reverse()

    for (let i = 0; i < rev_str.length; ++i) {
        if (!isNaN(Number(str[i]))) {
            digit += str[i]
        }
    }
    return Number(digit)
}

export default getDigitsStr
