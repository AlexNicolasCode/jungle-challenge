import React, { JSX, useCallback, useState } from 'react';

import { UserList } from '@/components';
import { userApiClient } from '../../clients/users';
import { UserEntity } from '../../shared/types';
import { UserContext } from './user.context';
import { UserProviderProps } from './user.types';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await userApiClient.get('', {
                params: {
                    page: page,
                    size: 10,
                },
            });
            const users: UserEntity[] = response.data?.list ?? [];
            const totalPages: number = response.data?.totalPagess ?? 1;
            setMaxPage(totalPages);
            setUsers(users);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleNextPage = () => {
        const nextPage = page+1;
        if (
        nextPage < 1 ||
        nextPage > maxPage
        ) {
        return;
        }
        setPage(nextPage);
    }

    const renderUserList = (): JSX.Element => {
        return <UserList users={users} loading={loading} />
    }

    return (
        <UserContext.Provider
            value={{
                loading,
                users,
                loadUsers,
                handleNextPage,
                renderUserList,
            }}
            >
            {children}
            </UserContext.Provider>
        );
    };
