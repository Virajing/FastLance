import mongoose from 'mongoose';
export async function transaction(work, io) {
  let events, result;
  await mongoose.connection.transaction(async session => {
    events = [];
    result = await work({ session, events, io });
  });
  // Nothing reaches a socket until the database commit succeeds.
  for (const event of events) event();
  return result;
}
export function emitAfter(context, rooms, event, data) {
  const emit = () => context.io?.to(rooms).emit(event, data);
  if (context.session) context.events.push(emit);
  else emit();
}
