function getDigitsStr(str: string): number {
    let digit = ""
    for (let i = 0; i < str.length; i++) {
        if (Number.isNaN(str[i])) {
            digit += str[i]
        }
    }

    return Number(digit)
}

console.log(getDigitsStr("1 kg"))

