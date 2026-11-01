// Версия сайта берётся из web/package.json ("version"). Перед выпуском обновления
// поднимите номер там и допишите раздел в CHANGELOG.md в корне проекта.
import pkg from '../package.json'

export const SITE_VERSION: string = pkg.version
