import { SESSION_STATUS } from '../constants/constants';

export const getSessionStatusName = (sessionStatusValue) => {
  return (
    Object.keys(SESSION_STATUS)
      .find((key) => SESSION_STATUS[key] === sessionStatusValue)
      ?.toLowerCase() || 'unknown'
  );
};
