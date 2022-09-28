import { IUserInfo } from '@vikadata/core';

/**
 * 邀请链接生成
 */
export const generateInviteLink = (userInfo: IUserInfo | null, token: string, nodeId: string) => {
  const url = new URL(window.location.origin);
  url.pathname = '/invite/link';

  const searchParams = new URLSearchParams('');

  searchParams.append('token', token);
  userInfo?.inviteCode && searchParams.append('inviteCode', userInfo.inviteCode);
  searchParams.append('nodeId', nodeId);
  url.search = searchParams.toString();
  return url.href;
};

export const ROOT_TEAM_ID = '0';