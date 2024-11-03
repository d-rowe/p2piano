export default class ConfigProvider {
  private constructor() {}

  static getServiceUrl() {
    return '/api';
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production';
  }
}