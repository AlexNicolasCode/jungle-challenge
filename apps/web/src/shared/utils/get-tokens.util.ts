import { Tokens } from "../../contexts"

export const getTokens = (): Tokens | undefined => {
    const tokensStringfied = localStorage.getItem('tokens');
    if (!tokensStringfied) {
        return;
    }
    return JSON.parse(tokensStringfied) as Tokens;
}
