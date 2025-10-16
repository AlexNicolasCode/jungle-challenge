import { getTokens } from "./get-tokens.util";

export const getAccessToken = (): string | undefined => {
    const tokens = getTokens();
    if (!tokens) {
        return;
    }
    return tokens.accessToken;
}
