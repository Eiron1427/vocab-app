import { AdminService } from "../services/admin-service";
import { ShopService } from "../services/shop-service";
import { LocalRepository } from "../repositories/local-repository";
import { SettingsService } from "../services/settings-service";
import { AuthorService } from "../services/author-service";
import { SpeechService } from "../services/speech-service";
export const localRepository = new LocalRepository();
export const adminService = new AdminService(localRepository);
export const settingsService = new SettingsService(localRepository);
export const authorService = new AuthorService(localRepository);
export const speechService = new SpeechService();

export const shopService = new ShopService(localRepository);
