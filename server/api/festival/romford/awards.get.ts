import { defineEventHandler } from 'h3'
import { fetchFestivalAwards } from '~~/server/utils/festivalAwards'

export default defineEventHandler(() => fetchFestivalAwards('romford-2026'))
