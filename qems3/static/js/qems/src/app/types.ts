import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';


export interface User {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
}

export interface QuestionSet {
    id: number;
    name: string;
    date: Date;
    host: string;
    address: string;
    owner: number;
    public: boolean;
    num_packets: number;
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
}
