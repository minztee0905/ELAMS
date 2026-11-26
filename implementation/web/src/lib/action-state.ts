export type ActionState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  link?: { href: string; label: string };
  code?: string;
  data?: Record<string, unknown>;
  /** Tăng sau mỗi lần gửi để client biết có kết quả mới. */
  at?: number;
};
