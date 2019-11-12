import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';


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

