import { writeFile } from 'fs/promises';

let sessionLog: any[] = [];

export const log = (item: string | object) => {
  if (typeof item === 'object') {
    if (JSON.stringify(item)) {
      sessionLog = [...sessionLog, item];
    }
    console.log(item);
  } else {
    sessionLog.push(item);
    console.log(item);
  }

  if (sessionLog.length > 10) {
    saveLog([...sessionLog]);
    sessionLog = [];
  }
};

const saveLog = (logObject: any) => {
  const time = new Date().toString();
  const filename = `../logs/${time}.log.json`;

  const content = JSON.stringify(logObject, null, 2);

  // return writeFile(filename, content);
};
