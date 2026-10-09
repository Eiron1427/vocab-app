import { LocalRepository } from "../repositories/local-repository";
import { SettingsService } from "../services/settings-service";
import { AuthorService } from "../services/author-service";
import { SpeechService } from "../services/speech-service";
export const localRepository = new LocalRepository();
export const settingsService = new SettingsService(localRepository);
export const authorService = new AuthorService(localRepository);
export const speechService = new SpeechService();
