export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof (error as any).message === 'string'
  );
}
