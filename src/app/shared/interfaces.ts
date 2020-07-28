
export interface User {
    localId?: string
    name?: string,
    email: string
    password: string
    returnSecureToken?: boolean
}

export interface FbAuthResponse {
    localId?: string
    displayName?: string
    email?: string
    idToken: string
    expiresIn: string
}

export interface FbCreateResponse {
    name: string
}

export enum Role {
    Admin = 1,
    Client = 2
}

export enum Status {
    Waiting = 1,
    Accepted = 2,
    OnTheWay = 3,
    Delivered = 4,
    CancelledByAdmin = 5,
    CancelledByCustomer = 6
}

export enum Payment {
    Card = 1,
    Cash = 2,
}

export interface LUser { // user which is saved in localstorage 
    localId: string
    userDetailsId?: string
    name?: string
    email?: string
    phone?: string | null
    addressDetails?: string | null
    favorites?: Product[]
    orders?: Order[]
    basket?: Basket
    role: number
}

export interface userDetails {
    id?: string, 
    localId?: string
    userName: string,
    phone?: string | null,
    addressDetails?: string | null,
    favorites?: Product[],
    orders?: Order[]
    basket?: Basket
}

export interface Order {
    id?: string
    userInfo?: {
     
        name: string,
        email: string
    }
    phone: string
    addressDetails: string
    products: Product[],
    price: string
    payment: string
    status: Status
    createdAt: Date
    updatedAt?: Date
}

export interface Basket {
    products: Product[],
    cardInfo: {
        commonPrice: number
        itemCount: number
        refreshTime: Date
    }
}

export interface Product {
    id?: string,
    name: string,
    brandName: string,
    description?: string,
    price: number,
    oneItemPrice?: number,
    imageUrl: string
    quantity?: number
    date?: Date
}

export interface forgotPass{
    oobCode: string,
    newPassword: string
}

export interface Contact {
    id?: string
    name: string
    phone: string
    message: string
    date: Date
}

export interface Post {
    id?: string
    title: string
    text: string
    author: string
    date: Date
}

export interface LanguageFields {
    az: string,
    ru: string,
    en: string
}

export interface News {
    id?: string
    author: LanguageFields
    title: LanguageFields
    text: LanguageFields
    imageUrl: string
    date: Date
}

export interface Slider {
    id?: string
    imageUrl: string
    date: Date
}

export interface About {
    id?: string,
    text: LanguageFields,
    imageUrl: string
    date: Date
}

export interface Team {
    id?: string,
    fullName: LanguageFields
    text: LanguageFields,
    imageUrl: string
    date: Date
}




