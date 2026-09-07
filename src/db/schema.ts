import {
  pgTable,
  pgSchema,
  uuid,
  text,
  date,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Supabase-managed auth schema — referenced, never migrated by us.
const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const clubs = pgTable("clubs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

export const coaches = pgTable("coaches", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id")
    .notNull()
    .unique()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const coachClubs = pgTable(
  "coach_clubs",
  {
    coachId: uuid("coach_id")
      .notNull()
      .references(() => coaches.id, { onDelete: "cascade" }),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.coachId, table.clubId] })],
);

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  clubId: uuid("club_id")
    .notNull()
    .references(() => clubs.id),
  startDate: date("start_date"),
  arm: text("arm"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

export const progressLogs = pgTable("progress_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => sessions.id),
  coachId: uuid("coach_id")
    .notNull()
    .references(() => coaches.id),
  date: date("date").notNull(),
  theme: text("theme"),
  workedOn: text("worked_on"),
  two: text("two"),
  comments: text("comments"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const clubsRelations = relations(clubs, ({ many }) => ({
  students: many(students),
  coachClubs: many(coachClubs),
}));

export const coachesRelations = relations(coaches, ({ many }) => ({
  coachClubs: many(coachClubs),
  progressLogs: many(progressLogs),
}));

export const coachClubsRelations = relations(coachClubs, ({ one }) => ({
  coach: one(coaches, {
    fields: [coachClubs.coachId],
    references: [coaches.id],
  }),
  club: one(clubs, {
    fields: [coachClubs.clubId],
    references: [clubs.id],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  club: one(clubs, {
    fields: [students.clubId],
    references: [clubs.id],
  }),
  progressLogs: many(progressLogs),
}));

export const sessionsRelations = relations(sessions, ({ many }) => ({
  progressLogs: many(progressLogs),
}));

export const progressLogsRelations = relations(progressLogs, ({ one }) => ({
  student: one(students, {
    fields: [progressLogs.studentId],
    references: [students.id],
  }),
  session: one(sessions, {
    fields: [progressLogs.sessionId],
    references: [sessions.id],
  }),
  coach: one(coaches, {
    fields: [progressLogs.coachId],
    references: [coaches.id],
  }),
}));
