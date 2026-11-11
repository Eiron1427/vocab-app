import { AdminModel } from "@/models/admin";
import { LocalRepository } from "@/repositories/local-repository";
import type { Review } from "@/types/admin";
export class AdminService {
    constructor(private readonly repository: LocalRepository) { }
    review(id: string, expected: string, decision: Review["decision"], note: string) {
        this.repository.update(state => AdminModel.review(state, id, expected, decision, note));
    }
}
