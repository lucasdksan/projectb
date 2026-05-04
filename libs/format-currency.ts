/** Valores monetários são armazenados em centavos (inteiro). */
export function formatCurrencyFromCents(cents: number): string {
    return (cents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

/** Converte valor em reais (número do formulário) para centavos. */
export function reaisToCents(reais: number): number {
    return Math.round(reais * 100);
}

/** Exibe valor em reais a partir de centavos, sem símbolo R$ (ex.: inputs). */
export function centsToReaisInputString(cents: number): string {
    return (cents / 100).toFixed(2);
}
