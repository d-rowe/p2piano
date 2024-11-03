// TODO: remove, this project no longer uses ddb

const LOCAL_DDB_ENDPOINT = 'http://127.0.0.1:8001';

export default class ConfigProvider {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getRegion(): string {
    return 'us-west-2';
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static getDDBEndpoint(): string {
    return LOCAL_DDB_ENDPOINT;
  }
}