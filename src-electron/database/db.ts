import { S } from 'app/dist/spa/assets/searchAPI.dc8a3062';
import sqlite from 'sqlite3';
import { FileModel } from 'src/components/model/File';

const db = new sqlite.Database('search.db');

const sqlInit = `
  create table  if not exists t_file(id text,code text,actress text,file_type text,mtime datetime)`;
db.serialize(() => {
  db.run(sqlInit);
  db.exec('delete from t_file where 1=1');
});

export const queryDB = async () => {
  const data = db.all('select * from t_file');
  return data;
};

export const insertDb = async (params: FileModel[]) => {
  const sql = 'insert or replace into t_file  (id) values ';
  for (let i = 0; i < params.length; i++) {
    try {
      db.exec(sql + `('${params[i].Id}')`);
    } catch (err) {
      console.log(err);
    }
  }
  // let sql = `insert or replace into t_file
  // (id) values `;
  // for (let i = 0; i < params.length; i++) {
  //   sql += `('${params[i].Id}')`;
  //   if (i !== params.length - 1) {
  //     sql += ',';
  //   }
  // }
  // db.exec(sql);
};
