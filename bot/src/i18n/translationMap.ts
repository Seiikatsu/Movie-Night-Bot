import { Locale } from 'discord-api-types/v10';
import { PartialRecord } from '../@types/PartialRecord';
import deDe from './translations/de_DE.json';
import enUs from './translations/en_US.json';

type TextAtlas = {
	[key: string]: string;
};

const TranslationMap: PartialRecord<Locale, TextAtlas> = {
	[Locale.German]: deDe as TextAtlas,
	[Locale.EnglishUS]: enUs as TextAtlas,
};

export default TranslationMap;
