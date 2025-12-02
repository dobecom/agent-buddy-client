import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Auth from './Auth';
import { Members } from '../domains/Members';

// const NO_LNB = ['/password-change', '/unauthorized'];

const BaseLayout = () => {
  const { pathname } = useLocation();
  //   const { accessToken } = getTokens();
  //   const { isLoading, myInfo, refetch } = useGetMyInfo();
  const member: Members = {
    id: 'temp',
    verifyKey: '',
    verifyCode: '',
    page: 0,
    passwordInit: false,
    identifier: '',
    password: '',
    name: '',
    nickname: '',
    mobile: '',
    grade: Members.GRADE.BASIC,
    signFail: 0,
    status: 0,
    passwordExpiredAt: '',
    createdBy: '',
    updatedBy: '',
    createdAt: '',
    updatedAt: '',
  };

  useEffect(() => {
    // if (accessToken) {
    //   refetch();
    // }
  }, [
    pathname,

    // refetch
  ]);
  return (
    <Auth member={undefined} isLoading={false} loginRequired={true}>
      <div className='size-full min-w-3xl bg-gray-25'>
        <div className='relative mt-20'>temp</div>
      </div>
      <ScrollRestoration />
    </Auth>
  );
};

export default BaseLayout;
