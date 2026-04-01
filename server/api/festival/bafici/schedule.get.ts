import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
    return {
        success: true,
        isScheduleAvailable: false,
        status: 'pending',
        message: 'Official screening schedule has not been published yet.',
        count: 0,
        results: []
    }
})
