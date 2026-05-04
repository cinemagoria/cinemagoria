import { defineEventHandler } from 'h3'
import { fetchFestivalAwards } from '~~/server/utils/festivalAwards'

export default defineEventHandler(() => fetchFestivalAwards('slamdance-2026'))
