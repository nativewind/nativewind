function aspectRatio(value: number) {
  if (value === 0) {
    return undefined;
  }

  return value;
}

export const postProcessingCssFn: Record<string, (value: any) => any> = {
  aspectRatio,
};
