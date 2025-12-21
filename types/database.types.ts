export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            // Add your tables here if needed for typed Supabase client
        }
        Views: {
        }
        Functions: {
        }
        Enums: {
        }
    }
}
