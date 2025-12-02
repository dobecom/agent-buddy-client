import { ReactNode, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Members } from '../domains/Members';

interface Props {
  children: ReactNode;
  isLoading: boolean;
  member?: Members;
  loginRequired?: boolean;
}

const Auth = ({
  member,
  children,
  isLoading,
  loginRequired = false,
}: Props) => {
  const { pathname } = useLocation();
  const accessToken: string | null = null; // 로그인 정보 없음 가정
  const requiredStaticPage = useMemo(() => {
    if (isLoading) return null;

    if ((!member || !accessToken) && loginRequired) {
      return 'login';
    }

    if (member) {
      return member.grade;
    }

    return null;
  }, [isLoading, member, accessToken, pathname]);

  if (requiredStaticPage === 'login') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default Auth;
