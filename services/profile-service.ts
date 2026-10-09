import type { ProfileRepository } from "../repositories/profile-repository";
export class ProfileService {
    constructor(private readonly repository: ProfileRepository) { }
    getOverview() { return this.repository.getProfile().toView(); }
}
