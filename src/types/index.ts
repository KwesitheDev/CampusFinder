export interface User {
    uid: string
    email: string | null
    studentId: string
}
export interface Item {
    id: string
    userId: string
    description: string
    type: 'lost' | 'found'
    location: string
    photoUrl: string
    createdAt: string
    category: string
}