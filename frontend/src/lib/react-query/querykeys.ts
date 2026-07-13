export const queryKeys = {
  vehicles: {
    all: ["vehicles"] as const,
    list: () => ["vehicles", "list"] as const,
    detail: (id: string | number) => ["vehicles", "detail", id] as const,
  },
} as const;
