// import * as Papa from 'papaparse';
import { doc } from '@quanta/agent';

let Papa: any = null;
if (!import.meta.env.SSR) {
  Papa = await import('papaparse');
}

function foreach(file: File, callback: (data: unknown) => void) {
  Papa.parse(file, {
    dynamicTyping: true,
    header: false,
    step(results: { data: unknown }) {
      callback(results.data);
    },
    error() {},
    complete() {},
  });
}

function header(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      dynamicTyping: false,
      header: true,
      preview: 1,
      complete(results) {
        resolve(results.meta.fields || []);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

function parse(file: File): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      dynamicTyping: true,
      header: false,
      complete({ data }) {
        resolve(data);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

export const csv = {
  __doc__:
    'A csv parser API for files. If necessary, observe the header of the csv.',

  foreach: doc(
    'csv.foreach',
    foreach,
    `(file: File, callback: (data: unknown) => void): void
Iterates over CSV rows with a callback function.
Numbers are automatically parsed.
csv.foreach(files[3], row => console.log(row));`,
  ),

  header: doc(
    'csv.header',
    header,
    `csv.header(file: File): Promse<string[]>
Returns the CSV header row as a string array.
const headers = await csv.header(files[3]);`,
  ),

  parse: doc(
    'csv.parse',
    parse,
    `(file: File): Promise<unknown[]>
Parses entire CSV file into an array of objects.
const data = await csv.parse(files[3]);`,
  ),
};
