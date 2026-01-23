/**
 * Comparison API Client
 * Frontend API calls for comparison features
 */

interface SaveComparisonParams {
  userId: string
  product1Id: string
  product2Id: string
  winnerId?: string | null
}

interface ComparisonData {
  id: string
  user_id: string
  product_1_id: string
  product_2_id: string
  winner_id: string | null
  created_at: string
}

/**
 * Save a comparison to the database
 */
export async function saveComparison(
  params: SaveComparisonParams
): Promise<{ success: boolean; data?: ComparisonData; error?: string }> {
  try {
    const response = await fetch("/api/compare/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || "Failed to save comparison" }
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error saving comparison:", error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Get comparison history for a user
 */
export async function getComparisonHistory(
  userId: string,
  limit: number = 50
): Promise<{ success: boolean; data?: ComparisonData[]; error?: string }> {
  try {
    const response = await fetch(`/api/compare/history?userId=${userId}&limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || "Failed to fetch comparison history" }
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error fetching comparison history:", error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Get a specific comparison
 */
export async function getComparison(
  comparisonId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(`/api/compare/${comparisonId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || "Failed to fetch comparison" }
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error fetching comparison:", error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Delete a comparison
 */
export async function deleteComparison(
  comparisonId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/compare/${comparisonId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || "Failed to delete comparison" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting comparison:", error)
    return { success: false, error: (error as Error).message }
  }
}
