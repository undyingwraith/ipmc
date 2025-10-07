// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export function getLanguageFlag(lang: string) {
	switch (lang) {
		// Dutch, Flemish
		case 'nl':
		case 'nld':
			return '🇳🇱';
		// English
		case 'en':
		case 'eng':
			return '🇬🇧';
		// French
		case 'fr':
		case 'fra':
			return '🇫🇷';
		// German
		case 'de':
		case 'deu':
			return '🇩🇪';
		// Japanese
		case 'ja':
		case 'jpn':
			return '🇯🇵';
		// Spanish
		case 'es':
		case 'spa':
			return '🇪🇸';
		// Unknown
		default:
			return lang;
	}
}
