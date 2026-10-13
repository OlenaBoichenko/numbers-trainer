import { createContext, useContext } from 'react';
import type { ContentType, CurrencyCode } from '../types';

/** Language of the interface (independent of the training language). */
export type Locale = 'en' | 'fr' | 'ru';

export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'fr', label: 'FR' },
  { value: 'ru', label: 'RU' },
];

const en = {
  pageTitle: 'Numbers Listening Trainer',

  // Top controls
  themeToLight: 'Switch to light theme',
  themeToDark: 'Switch to dark theme',
  themeLight: 'Light theme',
  themeDark: 'Dark theme',
  interfaceLanguage: 'Interface language',

  // Shared
  contentTypes: {
    numbers: { title: 'Numbers', hint: 'Integers and decimals' },
    dates: { title: 'Dates', hint: 'Calendar dates' },
    currency: { title: 'Currency', hint: 'Money amounts' },
  } as Record<ContentType, { title: string; hint: string }>,
  paused: 'Paused',
  finish: 'Finish',
  timeLeft: 'Time left',
  minutesShort: (n: number) => `${n} min`,
  secondsShort: (n: string | number) => `${n} s`,

  // Settings screen
  appTitle: 'Numbers Trainer',
  appSubtitle:
    'Train your ear for numbers, dates and money amounts. The app reads out a random value - write down what you hear and check it against the correct answer.',
  speechUnsupported:
    'Your browser does not support speech synthesis (Web Speech API). Try opening the site in Chrome, Edge or Safari.',
  voiceMissing:
    'No voice was found in your browser for the selected language. Try another browser or install the corresponding system voice.',
  trainingLanguage: 'Training language',
  englishVariant: 'English variant',
  englishVariantAria: 'English variant',
  englishVariantHint: (example: string) =>
    `Affects the voice, the use of “and” in numbers and the date format (${example}).`,
  trainingMode: 'Training mode',
  modeDictation: 'Dictation',
  modeDictationHint: 'Continuous dictation of values for the whole session',
  modeStepByStep: 'One at a time with check',
  modeStepByStepHint: 'One value - write it down - see the answer',
  contentType: 'Content type',
  numberSettings: 'Number settings',
  minimum: 'Minimum',
  maximum: 'Maximum',
  integers: 'Integers',
  decimals: 'Decimals',
  negativeNumbers: 'Negative numbers',
  maxDecimalDigits: 'Max digits after the separator',
  maxDecimalDigitsAria: 'Maximum digits after the decimal separator',
  dateSettings: 'Date settings',
  startYear: 'Start year',
  endYear: 'End year',
  answerFormat: 'Answer format:',
  currencySettings: 'Currency settings',
  currencies: 'Currencies',
  currencyNames: {
    USD: 'US dollar',
    CAD: 'Canadian dollar',
    EUR: 'Euro',
    GBP: 'British pound',
  } as Record<CurrencyCode, string>,
  currenciesHint: 'If several currencies are selected, they alternate randomly.',
  minAmount: 'Minimum amount',
  maxAmount: 'Maximum amount',
  centsPart: 'Fractional part (cents)',
  negativeAmounts: 'Negative amounts',
  decimalDigits: 'Digits after the separator',
  decimalDigitsAria: 'Digits after the decimal separator',
  trainingParams: 'Training parameters',
  speechRate: 'Speech rate',
  dictationTime: 'Dictation time',
  duration: 'Duration',
  dictationPause: 'Pause between values',
  dictationPauseHint:
    'The robot dictates values one after another with this pause for the whole session.',
  taskPause: 'Pause before a task',
  autoRepeats: 'Auto-repeats per task',
  autoRepeatsAria: 'Number of automatic repetitions',
  repeatTimes: (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`),
  startTraining: 'Start training',
  fixSettings: 'Fix the highlighted settings to start.',

  // Validation
  errors: {
    numberRangeMissing: 'Enter a minimum and a maximum value.',
    numberRangeNegative: 'The minimum cannot be below zero — use the negative numbers switch.',
    numberRangeInverted: 'The minimum is greater than the maximum.',
    numberTypes: 'Select at least one number type: integers or decimals.',
    numberRangeNarrow: 'The range is too narrow to generate different values — widen it.',
    yearRangeMissing: 'Enter a start and an end year.',
    yearRangeInverted: 'The start year is later than the end year.',
    yearRangeBounds: 'Years from 1900 to 2100 are supported.',
    currencyList: 'Select at least one currency.',
    currencyRangeMissing: 'Enter a minimum and a maximum amount.',
    currencyRangeNegative: 'The minimum amount cannot be below zero — use the negative amounts switch.',
    currencyRangeInverted: 'The minimum amount is greater than the maximum.',
    currencyRangeNarrow: 'The amount range is too narrow to generate different values.',
  },

  // Step-by-step screen
  taskNumber: (n: number) => `Task #${n}`,
  resumeTraining: 'Resume training',
  pauseTraining: 'Pause training',
  timeUp: 'Time is up! No new tasks will be generated.',
  timeUpReveal: ' You can still see the answer to the current task.',
  trainingPaused: 'Training is paused. The timer is stopped.',
  taskSpeechError:
    'Could not play the task. Check that a voice for the selected language is available in your browser and try “Listen again”.',
  listenAgain: 'Listen again',
  speaking: 'Speaking…',
  writeWhatYouHeard: 'Write down what you heard',
  draftPlaceholder: 'Your draft - not checked',
  showAnswer: 'Show answer',
  correctAnswer: 'Correct answer',
  nextTask: 'Next task',
  showResults: 'Show results',

  // Dictation screen
  dictatedCount: (n: number) => `Dictated: ${n}`,
  resumeDictation: 'Resume dictation',
  pauseDictation: 'Pause dictation',
  dictationPaused: 'Dictation is paused. The timer is stopped - press ▶ to continue.',
  dictationSpeechError:
    'Could not play the value. Check that a voice for the selected language is available in your browser and press ▶ to continue.',
  dictating: 'Dictating - write it down!',
  dictationRunning: 'Dictation in progress…',
  notesLabel: 'Scratchpad (not checked)',
  notesPlaceholder: 'Write the values you hear here or on paper…',
  dictationHint: 'All dictated values will be shown at the end so you can check your notes.',

  // Summary screen
  trainingComplete: 'Training complete!',
  summaryDictation: 'Check your notes against the list of dictated values below.',
  summaryStepByStep:
    'Well done. Short, regular sessions are the best way to learn to understand numbers by ear with confidence.',
  statDuration: 'Duration',
  statLanguage: 'Language',
  statContentType: 'Content type',
  statDictated: 'Values dictated',
  statTasksCreated: 'Tasks created',
  statAnswersViewed: 'Answers viewed',
  statSpeechRate: 'Speech rate',
  elapsed: (m: number, s: number) =>
    m === 0 ? `${s} s` : s === 0 ? `${m} min` : `${m} min ${s} s`,
  dictatedValues: 'Dictated values',
  newTraining: 'Start new training',
};

export type Messages = typeof en;
export type ErrorKey = keyof Messages['errors'];

const fr: Messages = {
  pageTitle: 'Entraîneur d’écoute des nombres',

  themeToLight: 'Passer au thème clair',
  themeToDark: 'Passer au thème sombre',
  themeLight: 'Thème clair',
  themeDark: 'Thème sombre',
  interfaceLanguage: 'Langue de l’interface',

  contentTypes: {
    numbers: { title: 'Nombres', hint: 'Entiers et décimaux' },
    dates: { title: 'Dates', hint: 'Dates du calendrier' },
    currency: { title: 'Devises', hint: 'Sommes d’argent' },
  },
  paused: 'Pause',
  finish: 'Terminer',
  timeLeft: 'Temps restant',
  minutesShort: (n) => `${n} min`,
  secondsShort: (n) => `${n} s`,

  appTitle: 'Entraîneur de nombres',
  appSubtitle:
    'Entraînez votre oreille aux nombres, aux dates et aux sommes d’argent. L’application prononce une valeur au hasard — notez ce que vous entendez et comparez avec la bonne réponse.',
  speechUnsupported:
    'Votre navigateur ne prend pas en charge la synthèse vocale (Web Speech API). Essayez d’ouvrir le site dans Chrome, Edge ou Safari.',
  voiceMissing:
    'Aucune voix n’a été trouvée dans votre navigateur pour la langue choisie. Essayez un autre navigateur ou installez la voix système correspondante.',
  trainingLanguage: 'Langue d’entraînement',
  englishVariant: 'Variante de l’anglais',
  englishVariantAria: 'Variante de l’anglais',
  englishVariantHint: (example) =>
    `Influe sur la voix, le « and » dans les nombres et le format de date (${example}).`,
  trainingMode: 'Mode d’entraînement',
  modeDictation: 'Dictée',
  modeDictationHint: 'Dictée continue de valeurs pendant toute la séance',
  modeStepByStep: 'Une à la fois avec vérification',
  modeStepByStepHint: 'Une valeur - vous l’écrivez - vous voyez la réponse',
  contentType: 'Type de contenu',
  numberSettings: 'Réglages des nombres',
  minimum: 'Minimum',
  maximum: 'Maximum',
  integers: 'Nombres entiers',
  decimals: 'Nombres décimaux',
  negativeNumbers: 'Nombres négatifs',
  maxDecimalDigits: 'Chiffres max. après la virgule',
  maxDecimalDigitsAria: 'Nombre maximal de chiffres après la virgule',
  dateSettings: 'Réglages des dates',
  startYear: 'Année de début',
  endYear: 'Année de fin',
  answerFormat: 'Format de la réponse :',
  currencySettings: 'Réglages des devises',
  currencies: 'Devises',
  currencyNames: {
    USD: 'Dollar américain',
    CAD: 'Dollar canadien',
    EUR: 'Euro',
    GBP: 'Livre sterling',
  },
  currenciesHint: 'Si plusieurs devises sont sélectionnées, elles alternent au hasard.',
  minAmount: 'Somme minimale',
  maxAmount: 'Somme maximale',
  centsPart: 'Partie décimale (centimes)',
  negativeAmounts: 'Sommes négatives',
  decimalDigits: 'Chiffres après la virgule',
  decimalDigitsAria: 'Nombre de chiffres après la virgule',
  trainingParams: 'Paramètres de l’entraînement',
  speechRate: 'Vitesse de la voix',
  dictationTime: 'Durée de la dictée',
  duration: 'Durée',
  dictationPause: 'Pause entre les valeurs',
  dictationPauseHint:
    'Le robot dicte les valeurs les unes après les autres avec cette pause pendant toute la séance.',
  taskPause: 'Pause avant chaque exercice',
  autoRepeats: 'Répétitions automatiques',
  autoRepeatsAria: 'Nombre de répétitions automatiques',
  repeatTimes: (n) => `${n} fois`,
  startTraining: 'Commencer l’entraînement',
  fixSettings: 'Corrigez les réglages signalés pour commencer.',

  errors: {
    numberRangeMissing: 'Indiquez une valeur minimale et une valeur maximale.',
    numberRangeNegative: 'Le minimum ne peut pas être inférieur à zéro — utilisez l’option des nombres négatifs.',
    numberRangeInverted: 'Le minimum est supérieur au maximum.',
    numberTypes: 'Choisissez au moins un type de nombres : entiers ou décimaux.',
    numberRangeNarrow: 'L’intervalle est trop étroit pour générer des valeurs différentes — élargissez-le.',
    yearRangeMissing: 'Indiquez une année de début et une année de fin.',
    yearRangeInverted: 'L’année de début est postérieure à l’année de fin.',
    yearRangeBounds: 'Les années de 1900 à 2100 sont prises en charge.',
    currencyList: 'Choisissez au moins une devise.',
    currencyRangeMissing: 'Indiquez une somme minimale et une somme maximale.',
    currencyRangeNegative: 'La somme minimale ne peut pas être inférieure à zéro — utilisez l’option des sommes négatives.',
    currencyRangeInverted: 'La somme minimale est supérieure à la somme maximale.',
    currencyRangeNarrow: 'L’intervalle des sommes est trop étroit pour générer des valeurs différentes.',
  },

  taskNumber: (n) => `Exercice nº ${n}`,
  resumeTraining: 'Reprendre l’entraînement',
  pauseTraining: 'Mettre l’entraînement en pause',
  timeUp: 'Temps écoulé ! Aucun nouvel exercice ne sera généré.',
  timeUpReveal: ' Vous pouvez encore voir la réponse à l’exercice en cours.',
  trainingPaused: 'Entraînement en pause. Le minuteur est arrêté.',
  taskSpeechError:
    'Impossible de lire l’exercice. Vérifiez qu’une voix pour la langue choisie est disponible dans votre navigateur, puis essayez « Réécouter ».',
  listenAgain: 'Réécouter',
  speaking: 'Lecture…',
  writeWhatYouHeard: 'Notez ce que vous avez entendu',
  draftPlaceholder: 'Votre brouillon — non vérifié',
  showAnswer: 'Voir la réponse',
  correctAnswer: 'Bonne réponse',
  nextTask: 'Exercice suivant',
  showResults: 'Voir les résultats',

  dictatedCount: (n) => `Dictées : ${n}`,
  resumeDictation: 'Reprendre la dictée',
  pauseDictation: 'Mettre la dictée en pause',
  dictationPaused: 'Dictée en pause. Le minuteur est arrêté — appuyez sur ▶ pour continuer.',
  dictationSpeechError:
    'Impossible de lire la valeur. Vérifiez qu’une voix pour la langue choisie est disponible dans votre navigateur, puis appuyez sur ▶ pour continuer.',
  dictating: 'Dictée en cours — notez !',
  dictationRunning: 'La dictée continue…',
  notesLabel: 'Brouillon (non vérifié)',
  notesPlaceholder: 'Notez ici ou sur papier les valeurs entendues…',
  dictationHint: 'Toutes les valeurs dictées seront affichées à la fin pour que vous puissiez vérifier vos notes.',

  trainingComplete: 'Entraînement terminé !',
  summaryDictation: 'Comparez vos notes avec la liste des valeurs dictées ci-dessous.',
  summaryStepByStep:
    'Bon travail. De courtes séances régulières sont le meilleur moyen d’apprendre à comprendre les nombres à l’oreille avec assurance.',
  statDuration: 'Durée',
  statLanguage: 'Langue',
  statContentType: 'Type de contenu',
  statDictated: 'Valeurs dictées',
  statTasksCreated: 'Exercices générés',
  statAnswersViewed: 'Réponses consultées',
  statSpeechRate: 'Vitesse de la voix',
  elapsed: (m, s) =>
    m === 0 ? `${s} s` : s === 0 ? `${m} min` : `${m} min ${s} s`,
  dictatedValues: 'Valeurs dictées',
  newTraining: 'Nouvel entraînement',
};

const ru: Messages = {
  pageTitle: 'Тренажёр числительных на слух',

  themeToLight: 'Включить светлую тему',
  themeToDark: 'Включить тёмную тему',
  themeLight: 'Светлая тема',
  themeDark: 'Тёмная тема',
  interfaceLanguage: 'Язык интерфейса',

  contentTypes: {
    numbers: { title: 'Числа', hint: 'Целые и десятичные' },
    dates: { title: 'Даты', hint: 'Календарные даты' },
    currency: { title: 'Валюты', hint: 'Денежные суммы' },
  },
  paused: 'Пауза',
  finish: 'Завершить',
  timeLeft: 'Оставшееся время',
  minutesShort: (n) => `${n} мин`,
  secondsShort: (n) => `${n} с`,

  appTitle: 'Тренажёр числительных',
  appSubtitle:
    'Тренируйте восприятие чисел, дат и денежных сумм на слух. Приложение произносит случайное значение — запишите услышанное и сверьтесь с правильным ответом.',
  speechUnsupported:
    'Ваш браузер не поддерживает синтез речи (Web Speech API). Попробуйте открыть сайт в Chrome, Edge или Safari.',
  voiceMissing:
    'В вашем браузере не найден голос для выбранного языка. Попробуйте другой браузер или установите соответствующий системный голос.',
  trainingLanguage: 'Язык тренировки',
  englishVariant: 'Вариант английского',
  englishVariantAria: 'Вариант английского языка',
  englishVariantHint: (example) =>
    `Влияет на голос, союз «and» в числах и формат даты (${example}).`,
  trainingMode: 'Режим тренировки',
  modeDictation: 'Диктовка',
  modeDictationHint: 'Непрерывная диктовка значений всё время тренировки',
  modeStepByStep: 'По одному с проверкой',
  modeStepByStepHint: 'Одно значение — записали — посмотрели ответ',
  contentType: 'Тип контента',
  numberSettings: 'Настройки чисел',
  minimum: 'Минимум',
  maximum: 'Максимум',
  integers: 'Целые числа',
  decimals: 'Десятичные числа',
  negativeNumbers: 'Отрицательные числа',
  maxDecimalDigits: 'Максимум цифр после разделителя',
  maxDecimalDigitsAria: 'Максимум цифр после десятичного разделителя',
  dateSettings: 'Настройки дат',
  startYear: 'Начальный год',
  endYear: 'Конечный год',
  answerFormat: 'Формат ответа:',
  currencySettings: 'Настройки валют',
  currencies: 'Валюты',
  currencyNames: {
    USD: 'Доллар США',
    CAD: 'Канадский доллар',
    EUR: 'Евро',
    GBP: 'Британский фунт',
  },
  currenciesHint: 'Если выбрано несколько валют, они чередуются случайно.',
  minAmount: 'Минимальная сумма',
  maxAmount: 'Максимальная сумма',
  centsPart: 'Дробная часть (центы)',
  negativeAmounts: 'Отрицательные суммы',
  decimalDigits: 'Цифр после разделителя',
  decimalDigitsAria: 'Цифр после десятичного разделителя',
  trainingParams: 'Параметры тренировки',
  speechRate: 'Скорость речи',
  dictationTime: 'Время диктовки',
  duration: 'Продолжительность',
  dictationPause: 'Пауза между значениями',
  dictationPauseHint:
    'Робот диктует значения одно за другим с этой паузой в течение всего времени тренировки.',
  taskPause: 'Пауза перед заданием',
  autoRepeats: 'Автоповторов задания',
  autoRepeatsAria: 'Количество автоматических повторений',
  repeatTimes: (n) => (n === 1 ? '1 раз' : `${n} раза`),
  startTraining: 'Начать тренировку',
  fixSettings: 'Исправьте отмеченные настройки, чтобы начать.',

  errors: {
    numberRangeMissing: 'Укажите минимальное и максимальное значение.',
    numberRangeNegative: 'Минимальное значение не может быть меньше нуля — используйте переключатель отрицательных чисел.',
    numberRangeInverted: 'Минимальное значение больше максимального.',
    numberTypes: 'Выберите хотя бы один тип чисел: целые или десятичные.',
    numberRangeNarrow: 'Диапазон слишком узкий для генерации разных значений — расширьте его.',
    yearRangeMissing: 'Укажите начальный и конечный год.',
    yearRangeInverted: 'Начальный год больше конечного.',
    yearRangeBounds: 'Поддерживаются годы в диапазоне от 1900 до 2100.',
    currencyList: 'Выберите хотя бы одну валюту.',
    currencyRangeMissing: 'Укажите минимальную и максимальную сумму.',
    currencyRangeNegative: 'Минимальная сумма не может быть меньше нуля — используйте переключатель отрицательных сумм.',
    currencyRangeInverted: 'Минимальная сумма больше максимальной.',
    currencyRangeNarrow: 'Диапазон сумм слишком узкий для генерации разных значений.',
  },

  taskNumber: (n) => `Задание №${n}`,
  resumeTraining: 'Продолжить тренировку',
  pauseTraining: 'Приостановить тренировку',
  timeUp: 'Время вышло! Новые задания не генерируются.',
  timeUpReveal: ' Вы можете посмотреть ответ на текущее задание.',
  trainingPaused: 'Тренировка на паузе. Таймер остановлен.',
  taskSpeechError:
    'Не удалось воспроизвести задание. Проверьте, что в браузере доступен голос для выбранного языка, и попробуйте «Прослушать ещё раз».',
  listenAgain: 'Прослушать ещё раз',
  speaking: 'Произносится…',
  writeWhatYouHeard: 'Запишите, что услышали',
  draftPlaceholder: 'Ваш черновик — не проверяется',
  showAnswer: 'Показать ответ',
  correctAnswer: 'Правильный ответ',
  nextTask: 'Следующее задание',
  showResults: 'Показать итоги',

  dictatedCount: (n) => `Продиктовано: ${n}`,
  resumeDictation: 'Продолжить диктовку',
  pauseDictation: 'Приостановить диктовку',
  dictationPaused: 'Диктовка на паузе. Таймер остановлен - нажмите ▶ чтобы продолжить.',
  dictationSpeechError:
    'Не удалось воспроизвести значение. Проверьте, что в браузере доступен голос для выбранного языка, и нажмите ▶ чтобы продолжить.',
  dictating: 'Диктуется - записывайте!',
  dictationRunning: 'Диктовка идёт…',
  notesLabel: 'Черновик для записи (не проверяется)',
  notesPlaceholder: 'Записывайте услышанные значения здесь или на бумаге…',
  dictationHint: 'Все продиктованные значения будут показаны после окончания - вы сможете сверить свои записи.',

  trainingComplete: 'Тренировка завершена!',
  summaryDictation: 'Сверьте свои записи со списком продиктованных значений ниже.',
  summaryStepByStep:
    'Отличная работа. Регулярные короткие тренировки - лучший способ научиться уверенно воспринимать числа на слух.',
  statDuration: 'Продолжительность',
  statLanguage: 'Язык',
  statContentType: 'Тип контента',
  statDictated: 'Продиктовано значений',
  statTasksCreated: 'Создано заданий',
  statAnswersViewed: 'Просмотрено ответов',
  statSpeechRate: 'Скорость речи',
  elapsed: (m, s) =>
    m === 0 ? `${s} сек` : s === 0 ? `${m} мин` : `${m} мин ${s} сек`,
  dictatedValues: 'Продиктованные значения',
  newTraining: 'Начать новую тренировку',
};

export const MESSAGES: Record<Locale, Messages> = { en, fr, ru };

const KEY = 'numbers-trainer-locale-v1';

export function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'en' || stored === 'fr' || stored === 'ru') return stored;
  } catch {
    // ignore
  }
  return 'en';
}

export function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale;
  document.title = MESSAGES[locale].pageTitle;
  try {
    localStorage.setItem(KEY, locale);
  } catch {
    // storage unavailable - locale just won't persist
  }
}

export const I18nContext = createContext<Messages>(en);

export function useT(): Messages {
  return useContext(I18nContext);
}
