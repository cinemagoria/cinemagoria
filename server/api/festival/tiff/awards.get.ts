import { defineEventHandler } from 'h3'
import { fetchFestivalAwards } from '~~/server/utils/festivalAwards'

export default defineEventHandler(() => fetchFestivalAwards('tiff-2026'))
