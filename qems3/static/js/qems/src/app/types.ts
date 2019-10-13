export class User {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
}

export class QuestionSet {
    id: number;
    name: string;
    date: Date;
    host: string;
    address: string;
    owner: number;
    public: boolean;
    num_packets: number;
}