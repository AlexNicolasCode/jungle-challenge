import { Tokens } from "../../contexts"

export const getAccessToken = (): string | undefined => {
    const tokensStringfied = localStorage.getItem('tokens');
    if (!tokensStringfied) {
        return;
    }
    const { accessToken } = JSON.parse(tokensStringfied) as Tokens;
    return accessToken;
}
