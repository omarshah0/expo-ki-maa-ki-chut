/**
 * Packages API Service
 * Handles package-related API calls
 */

import { PackagesResponse } from '@/types/packages'
import { apiClient } from './api-client'

/**
 * Get all packages with pagination
 */
export async function getPackages(
  limit: number = 100,
  offset: number = 0
): Promise<PackagesResponse> {
  const response = await apiClient.get<PackagesResponse>(
    `/api/packages?limit=${limit}&offset=${offset}`
  )

  return response.data
}
