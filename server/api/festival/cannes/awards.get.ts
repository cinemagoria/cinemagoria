import { defineEventHandler } from 'h3'
import { fetchFestivalAwards } from '~~/server/utils/festivalAwards'

export default defineEventHandler(() => fetchFestivalAwards('cannes-2026'))
