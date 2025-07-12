/**
 * Utility functions for handling recommendation timeframes
 */

export const TIMEFRAME_OPTIONS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' }
] as const;

/**
 * Converts a timeframe integer to a human-readable string
 * @param timeframe - The timeframe in months (3, 6, or 12)
 * @returns The human-readable timeframe string
 */
export const getTimeframeLabel = (timeframe: number): string => {
  const option = TIMEFRAME_OPTIONS.find(opt => opt.value === timeframe);
  return option ? option.label : `${timeframe} months`;
};

/**
 * Gets all available timeframe options for form selects
 * @returns Array of timeframe options with value and label
 */
export const getTimeframeOptions = () => TIMEFRAME_OPTIONS;