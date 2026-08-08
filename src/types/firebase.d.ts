declare module 'firebase/app' {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
  export function getApp(): any;
}

declare module 'firebase/firestore' {
  export function getFirestore(app?: any): any;
  export function collection(db: any, path: string, ...pathSegments: string[]): any;
  export function addDoc(collectionRef: any, data: any): Promise<any>;
  export function onSnapshot(queryRef: any, onNext: (snapshot: any) => void, onError?: (error: any) => void): () => void;
  export function query(collectionRef: any, ...queryConstraints: any[]): any;
  export function orderBy(fieldPath: string, directionStr?: 'asc' | 'desc'): any;
  export function serverTimestamp(): any;
  export function getDocs(queryRef: any): Promise<any>;
  export type QuerySnapshot<T = any> = any;
  export type DocumentData = any;
  export type QueryDocumentSnapshot<T = any> = any;
}
