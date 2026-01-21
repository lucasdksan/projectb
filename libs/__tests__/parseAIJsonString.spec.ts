import { describe, it, expect } from "vitest";
import { parseAIJsonString } from "../parseAIJsonString";

describe("parseAIJsonString", () => {

    it("deve parsear um JSON limpo", () => {
        const result = parseAIJsonString(`{"a":1}`);
        expect(result).toEqual({ a: 1 });
    });

    it("deve parsear JSON com prefixo json", () => {
        const result = parseAIJsonString(`json { "a": 1 }`);
        expect(result).toEqual({ a: 1 });
    });

    it("deve parsear JSON com fences markdown ```json", () => {
        const result = parseAIJsonString(`
      \`\`\`json
      { "a": 1 }
      \`\`\`
    `);
        expect(result).toEqual({ a: 1 });
    });

    it("deve pegar somente o objeto mesmo com texto extra", () => {
        const result = parseAIJsonString(`
      AI RESULT: blabla
      json { "a": 1, "b": 2 }
      final text
    `);

        expect(result).toEqual({ a: 1, b: 2 });
    });

    it("retorna null quando não há objeto", () => {
        const result = parseAIJsonString("nenhum json aqui");
        expect(result).toBeNull();
    });

    it("retorna null quando falha o JSON.parse", () => {
        const result = parseAIJsonString(`{ invalid json }`);
        expect(result).toBeNull();
    });

    it("retorna null quando input é vazio", () => {
        expect(parseAIJsonString("")).toBeNull();
        expect(parseAIJsonString(null as any)).toBeNull();
        expect(parseAIJsonString(undefined as any)).toBeNull();
    });

});
