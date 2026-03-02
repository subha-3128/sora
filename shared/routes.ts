import { z } from 'zod';
import { 
  insertTaskSchema, tasks,
  insertHabitSchema, habits,
  insertHabitLogSchema, habitLogs,
  insertStudySessionSchema, studySessions,
  insertDailyReflectionSchema, dailyReflections,
  insertWeeklyReviewSchema, weeklyReviews,
  insertMonthlyReviewSchema, monthlyReviews
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks' as const,
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks' as const,
      input: insertTaskSchema,
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tasks/:id' as const,
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tasks/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  habits: {
    list: {
      method: 'GET' as const,
      path: '/api/habits' as const,
      responses: {
        200: z.array(z.custom<typeof habits.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/habits' as const,
      input: insertHabitSchema,
      responses: {
        201: z.custom<typeof habits.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/habits/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  habitLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/habit-logs' as const,
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof habitLogs.$inferSelect>()),
      },
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/habit-logs' as const,
      input: insertHabitLogSchema,
      responses: {
        200: z.custom<typeof habitLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  studySessions: {
    list: {
      method: 'GET' as const,
      path: '/api/study-sessions' as const,
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof studySessions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/study-sessions' as const,
      input: insertStudySessionSchema,
      responses: {
        201: z.custom<typeof studySessions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/study-sessions/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  dailyReflections: {
    get: {
      method: 'GET' as const,
      path: '/api/daily-reflections/:date' as const,
      responses: {
        200: z.custom<typeof dailyReflections.$inferSelect>().nullable(),
      },
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/daily-reflections' as const,
      input: insertDailyReflectionSchema,
      responses: {
        200: z.custom<typeof dailyReflections.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  weeklyReviews: {
    list: {
      method: 'GET' as const,
      path: '/api/weekly-reviews' as const,
      responses: {
        200: z.array(z.custom<typeof weeklyReviews.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/weekly-reviews/:date' as const,
      responses: {
        200: z.custom<typeof weeklyReviews.$inferSelect>().nullable(),
      }
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/weekly-reviews' as const,
      input: insertWeeklyReviewSchema,
      responses: {
        200: z.custom<typeof weeklyReviews.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  monthlyReviews: {
    list: {
      method: 'GET' as const,
      path: '/api/monthly-reviews' as const,
      responses: {
        200: z.array(z.custom<typeof monthlyReviews.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/monthly-reviews/:month' as const,
      responses: {
        200: z.custom<typeof monthlyReviews.$inferSelect>().nullable(),
      }
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/monthly-reviews' as const,
      input: insertMonthlyReviewSchema,
      responses: {
        200: z.custom<typeof monthlyReviews.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}