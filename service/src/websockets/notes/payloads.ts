export type NoteOnPayload = {
  midi: number;
  velocity: number;
  targetUserIds: string[],
};

export type NoteOffPayload = {
  midi: number,
  targetUserIds: string[],
};
