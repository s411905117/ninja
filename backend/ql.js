'use strict';

const got = require('got');
require('dotenv').config();
//const { readFile } = require('fs/promises');
//const path = require('path');

//const qlDir = process.env.QL_DIR || '/ql';
//const authFile = path.join(qlDir, 'config/auth.json');

const api = got.extend({
  prefixUrl: process.env.QL_URL || 'http://localhost:5700',
  retry: { limit: 0 },
});

async function getToken() {
  const body = await api({
    url: 'open/auth/token',
    searchParams: {
      client_id: process.env.QL_Client_ID,
      client_secret: process.env.QL_Client_Secret,
    },
    headers: {
      Accept: 'application/json',
    },
  }).json();
  //const authConfig = JSON.parse(await readFile(authFile));
  const authConfig = body.data;
  //console.log(authConfig);
  return authConfig.token;
}

module.exports.getEnvs = async () => {
  const token = await getToken();
  const body = await api({
    url: 'open/envs',
    searchParams: {
      searchValue: 'JD_COOKIE',
      t: Date.now(),
    },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).json();
  return body.data;
};

module.exports.getEnvsCount = async () => {
  const data = await this.getEnvs();
  return data.length;
};

module.exports.addEnv = async (cookie, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'post',
    url: 'open/envs',
    params: { t: Date.now() },
    json: [{
      name: 'JD_COOKIE',
      value: cookie,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateEnv = async (cookie, eid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'open/envs',
    params: { t: Date.now() },
    json: {
      name: 'JD_COOKIE',
      value: cookie,
      _id: eid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.delEnv = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'delete',
    url: 'open/envs',
    params: { t: Date.now() },
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};
