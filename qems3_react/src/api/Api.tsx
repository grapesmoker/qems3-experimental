import Cookies from 'universal-cookie';
import { User, Category } from '../models'

const cookies = new Cookies()

export default class Api {

    static DEFAULT_GET: RequestInit = {credentials: 'include'}
    static DEFAULT_POST: RequestInit = {
        credentials: 'include',
        method: 'POST',
        headers: {
            'X-CSRFTOKEN': cookies.get('csrftoken'),
            'Content-Type': 'application/json'
        }
    }

    static async getUser(config = this.DEFAULT_GET): Promise<User | null> {
        
        try {
            const response = await fetch('qsub/user/', config);
            if (!response.ok) {
                throw new Error('Error response: ' + response.statusText);
            }
            const currentUser: User | null = await response.json();
            return currentUser
        }
        catch (error) {
            console.log(error);
            return null
        }
    }

    static async getCategories(config = this.DEFAULT_GET) {
        try {
            const response = await fetch('qsub/api/categories/', config);
            if (!response.ok) {
                throw new Error('Error response: ' + response.statusText);
            }
            const categories: Category[] = await response.json();
            return categories
        }
        catch (error) {
            console.log(error);
            return null
        }
    }

    static async addCategory(category, config = this.DEFAULT_POST) {
        try {
            let effectiveConfig = {...config, body: JSON.stringify(category)}
            const response = await fetch('/qsub/api/categories/', effectiveConfig)
            if (!response.ok) {
                throw new Error('Error response: ' + response.statusText);
            }
            const savedCategory: Category = await response.json()
            return savedCategory
        }
        catch (error) {
            console.log(error)
            return null
        }
    }

    static login(username: String, email: String, password: String, config = this.DEFAULT_POST) {
        let effectiveConfig = {...this.DEFAULT_POST, ...config}
        effectiveConfig.body = JSON.stringify({
            username: username,
            email: email, 
            password: password,
        })

        fetch('rest-auth/login/', effectiveConfig).then(
            response => {
                if (!response.ok) {
                    throw new Error('Error response: ' + response.statusText)
                }
                return
            }
        )
    }
}
