import { randomBytes } from 'crypto';
import { FindOperator, In, IsNull } from 'typeorm';
import { DateTime } from 'luxon';
import { Request } from 'express';
import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';

const storage = 'uploads';

// ==============
// Moeda
// ==============
export const { format: formatPrice } = new Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL',
});

export interface KeyValueInterface {
  key: string;
  value: string;
}

// ==============
// Data e hora
// ==============
const getYear = (): string => {
  return DateTime.local().toFormat('yyyy');
};

const getMonth = (): string => {
  return DateTime.local().toFormat('MM');
};

export const getDate = (): string => {
  return DateTime.local().toFormat('yyyy-LL-dd');
};

export const getDateWithHour = (): string => {
  return DateTime.local().toFormat('yyyy-LL-dd HH:mm:ss');
};

export const getDateWithHourStringFormat = (): string => {
  return DateTime.local().toString();
};

export const getMonthDayStart = (): string => {
  return DateTime.local().startOf('month').toFormat('yyyy-LL-dd');
};

export const getMonthDayEnd = (): string => {
  return DateTime.local().endOf('month').toFormat('yyyy-LL-dd');
};

export const getYearDayStart = (): string => {
  return DateTime.local().startOf('year').toFormat('yyyy-LL-dd');
};

export const getYearDayEnd = (): string => {
  return DateTime.local().endOf('year').toFormat('yyyy-LL-dd');
};

export const getWeekDayStart = (): string => {
  return DateTime.local().startOf('week').minus({ days: 1 }).toFormat('yyyy-LL-dd');
  // TEM QUE RETROCEDER UM DIA POIS A SEMANA PARA A BIBLIOTECA COMEÇA NA SEGUNDA
};

export const getWeekDayEnd = (): string => {
  return DateTime.local().endOf('week').minus({ days: 1 }).toFormat('yyyy-LL-dd');
};

export const getDatePromiseDate = (): Date => {
  return new Date();
};

export const getStartDate = (date: string): Date => {
  return new Date(date + ' 00:00:00');
};

export const getEndDate = (date: string): Date => {
  return new Date(getDatePlusDays(date, 1) + ' 00:00:00');
};

export const getDatePlusSeconds = (date: string, seconds: number): string => {
  return DateTime.fromISO(date).plus({ seconds }).toFormat('yyyy-MM-dd HH:mm:ss');
};

export const getDatePlusHours = (date: string, hours: number): string => {
  return DateTime.fromISO(date).plus({ hours }).toFormat('yyyy-MM-dd HH:mm:ss');
};

export const getDatePlusDays = (date: string, days: number): string => {
  return DateTime.fromISO(date).plus({ days }).toFormat('yyyy-MM-dd');
};

export const getDatePlusWeeks = (date: string, weeks: number): string => {
  return DateTime.fromISO(date).plus({ weeks }).toFormat('yyyy-MM-dd');
};

export const getDatePlusMonths = (date: string, months: number): string => {
  return DateTime.fromISO(date).plus({ months }).toFormat('yyyy-MM-dd');
};
export const getDateMinusDays = (date: string, days: number): string => {
  return DateTime.fromISO(date).minus({ days }).toFormat('yyyy-MM-dd');
};

export const getDateMinusWeeks = (date: string, weeks: number): string => {
  return DateTime.fromISO(date).minus({ weeks }).toFormat('yyyy-MM-dd');
};

export const getDateMinusMonths = (date: string, months: number): string => {
  return DateTime.fromISO(date).minus({ months }).toFormat('yyyy-MM-dd');
};

export const getDateMinusYears = (date: string, years: number): string => {
  return DateTime.fromISO(date).minus({ years }).toFormat('yyyy-MM-dd');
};

export const daysDifferenceOfTwoDates = (startDate: string, endDate: string): number => {
  return Math.floor((Date.parse(endDate) - Date.parse(startDate)) / 86_400_000);
};

export const secondsDifferenceOfTwoDates = (startDate: Date, endDate: Date): number => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
};

export const isExpired = (date: string): boolean => {
  const currentDate = new Date(getDate());
  const dueDate = new Date(date);
  if (currentDate >= dueDate) {
    return true;
  }
  return false;
};

export const formatDateTime = (dateTime: Date, time?: boolean): string => {
  if (time) {
    return DateTime.fromJSDate(dateTime).toFormat('yyyy-MM-dd HH:mm:ss');
  }
  return DateTime.fromJSDate(dateTime).toFormat('yyyy-MM-dd');
};

export const formatDateTimeDatabase = (dateTime: Date, time?: boolean): string => {
  if (time) {
    return DateTime.fromJSDate(dateTime).toFormat('yyyy-MM-dd HH:mm:ss');
  }
  return DateTime.fromJSDate(dateTime).toFormat('yyyy-MM-dd');
};

export const getDatetimeLocalFormat = (date: string): string => {
  return DateTime.fromISO(date + 'T00:00:00.000Z')
    .setZone('America/Sao_Paulo')
    .toISO();
};

export const formatSecondsToHours = (seconds: number): string => {
  const hours = Math.floor(seconds / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const remainingSeconds = seconds % 60;
  const formatedHours = hours > 9 ? hours : `0${hours}`;
  const formatedMinutes = minutes > 9 ? minutes : `0${minutes}`;
  const formatedSeconds = remainingSeconds > 9 ? remainingSeconds : `0${remainingSeconds}`;
  return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
};

export const isExpiredToken = (tokenDatetime: string, secondsValidation?: number): boolean => {
  const currentDatetime = getDateWithHour();
  const validationDatetime = secondsValidation
    ? getDatePlusSeconds(tokenDatetime, secondsValidation)
    : tokenDatetime;
  const validatidonDateFormat = new Date(validationDatetime).toISOString();
  if (currentDatetime > validatidonDateFormat) {
    return true;
  }
  return false;
};

// ==============
// Arquivos
// ==============
export const createFolder = (folder: string): string => {
  const year = getYear();
  const month = getMonth();

  if (!fs.existsSync(storage)) {
    fs.mkdirSync(storage);
  }
  if (!fs.existsSync(storage + '/' + year)) {
    fs.mkdirSync(storage + '/' + year);
  }
  if (!fs.existsSync(storage + '/' + year + '/' + month)) {
    fs.mkdirSync(storage + '/' + year + '/' + month);
  }
  if (!fs.existsSync(storage + '/' + year + '/' + month + '/' + folder)) {
    fs.mkdirSync(storage + '/' + year + '/' + month + '/' + folder);
  }

  const path = storage + '/' + year + '/' + month + '/' + folder;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  return path;
};

export const getAvatarFolderPath = (filename: string): string => {
  const path = '/avatar/' + filename;
  return path;
};

export const getFolderPath = (folder: string): string => {
  const year = getYear();
  const month = getMonth();

  const path = '/' + year + '/' + month + '/' + folder + '/';

  return path;
};

export const getFileExtension = (url: string): string | null => {
  // Expressão regular para encontrar a extensão do arquivo na URL
  const extensionRegex = /(?:\.([^.]+))?$/;
  const matches = extensionRegex.exec(url);
  if (matches?.[1]) {
    return matches[1];
  } else {
    return null; // Retorna null se não encontrar nenhuma extensão
  }
};

// ==============
// Utilitários
// ==============
/**
 * Formata um número que esteja em centavos (sem pontuação) para um formato com pontuação. Exemplo:
 * Valor real: R$ 10,00 | Valor em centavos: 1000 | Valor convertido: 10.00
 */
export const formatPriceDatabase = (price: number): number => {
  const priceString = String(price);
  const priceStringBeforeDot = priceString.slice(0, priceString.length - 2);
  const priceStringAfterDot = priceString.slice(priceString.length - 2, priceString.length);

  const priceStringFormatted = priceStringBeforeDot + '.' + priceStringAfterDot;
  const priceNumber = Number(priceStringFormatted);

  return priceNumber;
};

export const formatPricePsp = (price: number): number => {
  return +(+price * 100).toFixed(0);
};

export const hash = async (text: string): Promise<string> => {
  return await bcryptjs.hash(String(text), 8);
};

export const compareHash = async (firstText: string, secondText: string): Promise<boolean> => {
  return await bcryptjs.compare(String(firstText), String(secondText));
};

export const getRandomId = (): string => {
  return `${Date.now().toString()}${Math.floor(Math.random() * (100000 - 1000))}`;
};

export const getRandomToken = (): string => {
  return Math.random().toString(36).substring(3, 16);
};

export const generateRandomNumberString = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    result += randomNumber.toString();
  }
  return result;
};

export const getRandomHash = (): string => {
  const random = `${randomBytes(10).toString('hex')}-${randomBytes(10).toString('hex')}`;
  return String(random);
};

export const trimNumber = (param: string): string => {
  return param.replace(/[^0-9]/g, '');
};

export const getCodeByName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/[' ']/g, '-');
};

export const clearString = (text: string): string => {
  if (!text) {
    return null;
  }
  return text
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9\s]/g, '');
};

export const clearFileName = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9\s.]/g, '');
};

export const commonIdsOfArrays = (x: number[], y: number[]): number[] => {
  const result: number[] = [];
  for (const xi of x) {
    if (y.includes(xi)) {
      result.push(xi);
    }
  }
  return result;
};

export const stringIdsToArray = (param: string): number[] => {
  const result: number[] = [];
  for (const id of param.split(`,`)) {
    result.push(+id);
  }
  return result;
};

export const stringToArray = (param: string): string[] => {
  const result: string[] = [];
  for (const id of param.split(`,`)) {
    result.push(id);
  }
  return result;
};

export const stringIdsToOperatorFunction = (param: string): FindOperator<number> => {
  if (param === `null`) {
    return IsNull();
  }
  return In(stringIdsToArray(param));
};

export const stringToKeyValueObjectArray = (param: string): KeyValueInterface[] => {
  const keyValuePairs = param.split(';');
  const result = keyValuePairs.map((pair) => {
    const [key, value] = pair.replace(/'/g, '').split(',');
    return {
      key,
      value,
    };
  });
  return result;
};

export const enumToValuesArray = (param: any): string[] => {
  const result: string[] = Object.keys(param).map((key) => param[key]);
  return result;
};

// export const keyValueObjectArrayToNumberArrayByValue = (
//   array: KeyValueInterface[],
//   value: string,
// ): number[] => {
//   const result = array
//     .filter((object) => object.value === value)
//   ).map(
//     (object) => parseInt(object.key, 10)
//   );
//   return result;
// };

export const getControllerName = (path: string): string => {
  return path.split('/')[1];
};

export const findParamByRoute = (route: string, param: string): number => {
  let aux = false;
  for (const element of route.split(`/`)) {
    if (aux) {
      return +element;
    }
    if (element === param) {
      aux = true;
    }
  }
  return null;
};

export const systemIdInParamUrl = (param: string): number => {
  let aux = false;
  for (const element of param.split(`/`)) {
    if (aux) {
      return +element;
    }
    if (element === `system`) {
      aux = true;
    }
  }
  return null;
};

export const componentCodeInParamUrl = (param: string): string | null => {
  let aux = false;
  for (const element of param.split(`/`)) {
    if (aux) {
      return element;
    }
    if (element === `code`) {
      aux = true;
    }
  }
  return null;
};

export const tokenByArray = (param: string[]): string => {
  let aux = false;
  for (const element of param) {
    if (aux) {
      return element;
    }
    if (element === `Authorization`) {
      aux = true;
    }
  }
  return null;
};

export const randomByArray = (array: any[]): any => {
  return array[Math.floor(Math.random() * array.length)];
};

export const isANumber = (param: string): boolean => {
  return !!+param;
};

export const isTrue = (param: string | number | boolean): boolean => {
  if (param && (param.toString() === 'true' || param.toString() === '1')) {
    return true;
  }
  return false;
};

export const createOrder = (
  column: string,
  value: string,
  columnEnum: any,
  valueEnum: any
): any => {
  if (column in columnEnum) {
    if (value in valueEnum) {
      return { [column]: value };
    }
  }
  return null;
};

export const paramExistsInEnum = (enumBase: any, param: string): any => {
  for (const chave in enumBase) {
    if (enumBase[chave] === param) {
      return true;
    }
  }
  return false;
};

export const paramArrayExistsInEnum = (enumBase: any, params: string[]): boolean => {
  for (const param of params) {
    for (const chave in enumBase) {
      if (enumBase[chave] === param) {
        return true;
      }
    }
  }
  return false;
};

export const valueInEnum = (enumBase: any, key: string): any => {
  const value = enumBase[key];
  if (!value) {
    return null;
  }
  return value;
};

export const defaultSystemName = (username: string, count: number): string => {
  return `Meu workspace #${count}`;
};

export const getComponentCode = (req: Request): string | null => {
  let componentCode = null;

  if (req.params) {
    for (const i in req.params) {
      const paramId = componentCodeInParamUrl(req.params[i].toString());
      if (paramId) {
        componentCode = paramId;
      }
    }
  }
  return componentCode;
};

export const matchText = (text: string, ends?: string[]): boolean => {
  if (!ends) {
    return false;
  }

  let value = false;
  value = ends?.some((element) => {
    return text.endsWith(element);
  });
  return value;
};

// Templates
export const templateNewActivity = (activityName: string, courseName: string): string => {
  const html =
    '<div dir="ltr"><div>Olá!<div dir="ltr"><div dir="ltr"><div></div></div></div><div><br></div><p>' +
    `<b>Nova atividade ${activityName.toLocaleUpperCase()} cadastrada para o curso: ${courseName.toLocaleUpperCase()} </b><br /><br />` +
    '</p></div></div><br><div dir="ltr" data-smartmail="gmail_signature"><div dir="ltr"><div></div></div></div><div><br></div><div><div><font size="1"><i><br>Este é um e-mail automático. Favor não responder.</i></font></div><div class="yj6qo"></div><div class="adL"></div><div class="adL"><br></div></div></div>';
  return html;
};
