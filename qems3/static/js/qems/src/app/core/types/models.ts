export interface User {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
}

export interface Category {
    name: string,
    description?: string,
    parent_category?: number
}

export class Distribution {
    id?: number;
    name: string;
    tossups_per_packet: number;
    bonuses_per_packet: number;
}

export interface QemsState {
    user?: User;
    distributions: Distribution[]
    categories: Category[]
}
