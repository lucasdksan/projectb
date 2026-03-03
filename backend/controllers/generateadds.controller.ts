import { GenerateAddsDTO } from "../schemas/generateadds.schema";
import { GenerateAddsService } from "../services/generateadds.service";

export const GenerateAddsController = {
    async generateAdds(dto: GenerateAddsDTO) {
        return await GenerateAddsService.generateAdds(dto);
    }
}