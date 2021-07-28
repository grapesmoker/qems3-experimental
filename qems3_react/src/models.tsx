

export interface User {
    id: number
    username: string
    password: string
    date_joined: string
    email: string
    first_name: string
    last_name: string
    groups: Array<number>
    user_permissions: Array<number>
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
    last_login: string
}

export interface Category {
    id: number
    name: string
    parent_category: number | null
    description: string | null
    subcategories: Category[]
}

export interface Action {
    type: string,
    payload: any
}

export interface State {
    user: User | null
    login: {
        username: string | null
        password: string | null
        email: string | null
        error?: string
    },
    categories: { [id: number]:  Category}
}

export interface IAppProps {
    user: User | null
}

export interface IAppDispatch {
    updateUser: Function
}

export interface ILoginProps {
    username: string | null
    password: string | null
}