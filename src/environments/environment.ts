// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  baseUrl: 'https://proh2r.com/api/proh2r',
  // baseUrl: 'http://localhost:8089/api/proh2r',
  storageServiceBaseUrl: 'https://s3.ap-south-1.amazonaws.com/proh2r/',
  // storageServiceBaseUrl: 'http://192.168.1.57:9089/storageservice/v1/files/',
  // keycloakUrl: 'http://localhost:8080/auth',
  keycloakUrl: 'https://proh2r.com/auth',
  realm: 'NileTechInnovationsRealm',
  // realm: 'NileTechnologies',
  tenantId: '2',
  ipstack_access_key: '53137cd932b729b01e7a0ceccbed48c2'
};
