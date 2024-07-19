export enum RouteType {
  PUBLIC = 'PUBLIC', // nothing
  USER_ONLY = 'USERONLY', // auth: bearer accessToken
  BOT_ONLY = 'BOT_ONLY', // token: bot token
  BOT_USER = 'BOT_USER', // bot + user
  SERVER_OWNER = 'SERVER_OWNER',
  SERBER_WHITE_LIST = 'SERVER_WHITE_LIST',
  OWNER_BOT = 'OWNER_BOT',
  WHITE_LIST_BOT = 'WHITE_LIST_BOT',
}
