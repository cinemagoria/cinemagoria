import { defineEventHandler } from 'h3'
import { fetchFestivalAwards } from '~~/server/utils/festivalAwards'

// cinemagoria-es serves Spanish text from the bilingual festival_awards table.
export default defineEventHandler(() => fetchFestivalAwards('bfi-2026', 'es'))
