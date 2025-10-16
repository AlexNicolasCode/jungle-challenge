export const calculateExpireAt = (expiresIn: string): Date => {
    const now = new Date();
    const regex = /^(\d+)([dswm])$/i;
    const match = expiresIn.match(regex);
    if (!match) {
      throw new Error("Invalid format. Use '3d', '3s', '3w' ou '3m'.");
    }
    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const unitMap: Record<string, (date: Date, value: number) => void> = {
      s: (date, value) => date.setSeconds(date.getSeconds() + value),
      m: (date, value) => date.setMinutes(date.getMinutes() + value),
      d: (date, value) => date.setDate(date.getDate() + value),
      w: (date, value) => date.setDate(date.getDate() + value * 7),
    };
    if (!unitMap[unit]) {
      throw new Error("Unidade inválida. Use 's', 'm', 'd' ou 'w'.");
    }
    unitMap[unit](now, amount);
    return now;
}