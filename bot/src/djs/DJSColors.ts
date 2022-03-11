import { ColorResolvable } from 'discord.js';

type COLOR_KEY = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

/* https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812 */
export default {
	INFO: '#3498DB',
	SUCCESS: '#2ECC71',
	WARNING: '#FFFF00',
	ERROR: '#E74C3C',
} as Record<COLOR_KEY, ColorResolvable>;
