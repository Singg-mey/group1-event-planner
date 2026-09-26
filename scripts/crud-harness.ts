/**
 * Throwaway harness: exercises the CRUD data layer + validation in Node so the
 * behaviour can be verified without a browser. Delete after use.
 */
import { validateEventForm, toEventFormValues, applyValuesToSearchEvent, createSearchEventFromValues, EMPTY_EVENT_FORM, hasFormErrors, parseTags, parseCapacity, toEventCategory, toEventStatus, buildEventColumns } from "../src/lib/event-form"
import { formatEventDate, toDateInputValue, toTimeInputValue, toIsoDateTime, addHours, DEFAULT_TIMEZONE } from "../src/lib/event-format"
import { ALL_EVENTS } from "../src/data/events"
import { insertLocalEvent, findLocalEvent, patchLocalEvent, removeLocalEvent, listLocalEvents, resetLocalEvents } from "../src/data/local-events-store"
import { setEventBackend } from "../src/data/events-repository"
import { setAuthIdentityForTesting } from "../src/data/auth"

// Force the localStorage backend for the whole run. Without this the repository
// would talk to the real Supabase project whenever .env.local is configured,
// and running the suite would create and delete rows in that database.
setEventBackend("local")

// Pin a signed-in identity so ownership checks behave the way they do in the
// app. The local store is plain JSON, so ids are opaque strings here; the
// Supabase path is the one that has to emit real uuids.
const TEST_OWNER_ID = "usr_001"
const STRANGER_ID = "usr_002"
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

setAuthIdentityForTesting({
  id: TEST_OWNER_ID,
  email: "johndoe@example.com",
  displayName: "John Doe",
})

let failures = 0
const check = (name: string, condition: boolean, detail?: unknown) => {
  if (condition) {
    console.log(`  PASS  ${name}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${name}`, detail === undefined ? "" : JSON.stringify(detail))
  }
}

// Minimal localStorage shim so the store runs outside the browser.
const store = new Map<string, string>()
;(globalThis as { window?: unknown }).window = {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
}

const validValues = {
  ...EMPTY_EVENT_FORM,
  title: "Rooftop Yoga Session",
  description: "A relaxing rooftop yoga session with sunset views.",
  date: "2026-11-20",
  startTime: "17:00",
  endTime: "18:30",
  address: "Street 51, BKK1, Phnom Penh",
  capacity: "40",
  tags: "yoga, wellness",
}

console.log("\n[validation]")
check("valid form has no errors", !hasFormErrors(validateEventForm(validValues)), validateEventForm(validValues))
check("rejects short title", Boolean(validateEventForm({ ...validValues, title: "ab" }).title))
check("rejects short description", Boolean(validateEventForm({ ...validValues, description: "hi" }).description))
check("rejects missing date", Boolean(validateEventForm({ ...validValues, date: "" }).date))
check("rejects missing start time", Boolean(validateEventForm({ ...validValues, startTime: "" }).startTime))
check("rejects end before start", Boolean(validateEventForm({ ...validValues, startTime: "18:00", endTime: "17:00" }).endTime))
check("rejects empty address when physical", Boolean(validateEventForm({ ...validValues, address: "" }).address))
check("requires meeting link when online", Boolean(validateEventForm({ ...validValues, locationType: "online", meetingLink: "" }).meetingLink))
check("rejects non-url meeting link", Boolean(validateEventForm({ ...validValues, locationType: "online", meetingLink: "meet.google.com/x" }).meetingLink))
check("accepts online with url", !hasFormErrors(validateEventForm({ ...validValues, locationType: "online", meetingLink: "https://meet.google.com/x", address: "" })))
check("rejects zero capacity", Boolean(validateEventForm({ ...validValues, capacity: "0" }).capacity))
check("rejects non-integer capacity", Boolean(validateEventForm({ ...validValues, capacity: "4.5" }).capacity))
check("rejects non-numeric capacity", Boolean(validateEventForm({ ...validValues, capacity: "many" }).capacity))
check("rejects bad cover url", Boolean(validateEventForm({ ...validValues, coverImage: "not a url" }).coverImage))
check("accepts blank cover url", !hasFormErrors(validateEventForm({ ...validValues, coverImage: "" })))

console.log("\n[helpers]")
check("parseTags trims, lowercases, dedupes", JSON.stringify(parseTags(" Jazz , LIVE ,jazz")) === JSON.stringify(["jazz", "live"]), parseTags(" Jazz , LIVE ,jazz"))
check("parseCapacity strips suffix", parseCapacity("200 attendees") === "200", parseCapacity("200 attendees"))
check("toEventCategory maps label", toEventCategory("Music & Concerts") === "music", toEventCategory("Music & Concerts"))
check("toEventCategory maps value", toEventCategory("food and drink") === "food and drink")
check("toEventCategory falls back", toEventCategory("zzz") === "music", toEventCategory("zzz"))
check("toEventStatus maps CONCLUDED", toEventStatus("CONCLUDED") === "completed")
check("toEventStatus maps published", toEventStatus("published") === "published")
check("toEventStatus falls back to draft", toEventStatus("weird") === "draft")
check("iso carries +07:00 offset", toIsoDateTime("2026-11-20", "17:00") === "2026-11-20T17:00:00+07:00", toIsoDateTime("2026-11-20", "17:00"))
check("formatEventDate produces display string", formatEventDate("2026-10-10T19:00:00+07:00").includes("•"), formatEventDate("2026-10-10T19:00:00+07:00"))
check("date input value", /^\d{4}-\d{2}-\d{2}$/.test(toDateInputValue("2026-10-10T19:00:00+07:00")), toDateInputValue("2026-10-10T19:00:00+07:00"))
check("time input value", /^\d{2}:\d{2}$/.test(toTimeInputValue("2026-10-10T19:00:00+07:00")), toTimeInputValue("2026-10-10T19:00:00+07:00"))
check("unparseable date -> empty", toDateInputValue("not a date") === "")

// The form values must not depend on the browser's timezone: a no-op edit in
// London used to silently move an event by 7 hours.
check("addHours keeps the app offset", addHours("2026-11-20T17:00:00+07:00", 3) === "2026-11-20T20:00:00+07:00", addHours("2026-11-20T17:00:00+07:00", 3))
check("date input ignores host offset", toDateInputValue("2026-11-20T17:00:00+07:00") === "2026-11-20", toDateInputValue("2026-11-20T17:00:00+07:00"))
check("time input ignores host offset", toTimeInputValue("2026-11-20T17:00:00+07:00") === "17:00", toTimeInputValue("2026-11-20T17:00:00+07:00"))
check("midnight stays on the same day", toDateInputValue("2026-11-20T00:30:00+07:00") === "2026-11-20", toDateInputValue("2026-11-20T00:30:00+07:00"))
check("late-evening time does not roll over", toTimeInputValue("2026-11-20T23:30:00+07:00") === "23:30", toTimeInputValue("2026-11-20T23:30:00+07:00"))
check("utc input converts to app offset", toTimeInputValue("2026-11-20T10:00:00Z") === "17:00", toTimeInputValue("2026-11-20T10:00:00Z"))
check("columns carry the not-null timezone", buildEventColumns(validValues).timezone === DEFAULT_TIMEZONE, buildEventColumns(validValues).timezone)

console.log("\n[create]")
const created = createSearchEventFromValues(validValues, { id: "evt_test", organizerId: "usr_001" })
check("id preserved", created.id === "evt_test")
check("organizer recorded", created.organizerId === "usr_001")
check("capacity formatted", created.capacity === "40 attendees", created.capacity)
check("category labelled", created.category === "Music & Concerts", created.category)
check("tags parsed", JSON.stringify(created.tags) === JSON.stringify(["yoga", "wellness"]), created.tags)
check("start datetime stored", created.startDatetime === "2026-11-20T17:00:00+07:00", created.startDatetime)
check("end datetime stored", created.endDatetime === "2026-11-20T18:30:00+07:00", created.endDatetime)
check("location formatted", created.location.includes("Street 51"), created.location)
check("has timestamps", Boolean(created.createdAt && created.updatedAt))

console.log("\n[round-trip: event -> form -> event]")
const roundTripped = applyValuesToSearchEvent(created, toEventFormValues(created))
check("title survives", roundTripped.title === created.title, roundTripped.title)
check("description survives", roundTripped.description === created.description)
check("category survives", roundTripped.category === created.category, roundTripped.category)
check("tags survive", JSON.stringify(roundTripped.tags) === JSON.stringify(created.tags), roundTripped.tags)
check("capacity survives", roundTripped.capacity === created.capacity, roundTripped.capacity)
check("location survives", roundTripped.location === created.location, roundTripped.location)
check("start survives", roundTripped.startDatetime === created.startDatetime, roundTripped.startDatetime)
check("visibility survives", roundTripped.visibility === created.visibility)
check("id survives", roundTripped.id === created.id)
check("round-trip validates", !hasFormErrors(validateEventForm(toEventFormValues(roundTripped))), validateEventForm(toEventFormValues(roundTripped)))

console.log("\n[round-trip: seeded fixture]")
const fixture = ALL_EVENTS[0]
const fixtureForm = toEventFormValues(fixture)
check("fixture has no validation errors", !hasFormErrors(validateEventForm(fixtureForm)), validateEventForm(fixtureForm))
const fixtureUpdated = applyValuesToSearchEvent(fixture, { ...fixtureForm, title: "Jazz Night (Renamed)" })
check("edit keeps id", fixtureUpdated.id === fixture.id)
check("edit applies new title", fixtureUpdated.title === "Jazz Night (Renamed)", fixtureUpdated.title)
check("edit keeps organizer", fixtureUpdated.organizerId === fixture.organizerId, `${fixtureUpdated.organizerId} vs ${fixture.organizerId}`)
check("edit keeps image when untouched", fixtureUpdated.image === fixture.image)

console.log("\n[online round-trip]")
const onlineValues = { ...validValues, locationType: "online" as const, address: "", meetingLink: "https://meet.google.com/abc" }
const online = createSearchEventFromValues(onlineValues, { id: "evt_online", organizerId: "usr_001" })
check("online location reads Online", online.location === "Online", online.location)
check("online form detects type", toEventFormValues(online).locationType === "online", toEventFormValues(online).locationType)
check("online link preserved", toEventFormValues(online).meetingLink === "https://meet.google.com/abc", toEventFormValues(online).meetingLink)

console.log("\n[local store CRUD]")
resetLocalEvents()
const baseline = listLocalEvents()
check("seeds from fixtures", baseline.length === ALL_EVENTS.length, `${baseline.length} vs ${ALL_EVENTS.length}`)

insertLocalEvent(created)
check("create adds to list", listLocalEvents().some((e) => e.id === "evt_test"))
// The local list is sorted by start time to match the Supabase query, so a
// later event lands after the earlier fixtures rather than at the top.
check("create is ordered by start time", listLocalEvents().findIndex((e) => e.id === "evt_test") > 0, listLocalEvents().map((e) => e.id).join(","))
// Records with no startDatetime (the bundled past events) sort last, matching
// Postgres' NULLS LAST default for an ascending sort.
const dated = listLocalEvents().filter((e) => e.startDatetime)
check("list is sorted ascending", dated.every((e, i) => i === 0 || Date.parse(dated[i - 1].startDatetime!) <= Date.parse(e.startDatetime!)), dated.map((e) => e.startDatetime).join(" | "))
const firstUndated = listLocalEvents().findIndex((e) => !e.startDatetime)
check("undated records sort last", firstUndated === -1 || firstUndated >= dated.length, `first undated at ${firstUndated}, dated count ${dated.length}`)
check("read by id works", findLocalEvent("evt_test")?.title === created.title)
check("read missing id returns null", findLocalEvent("nope") === null)

patchLocalEvent("evt_test", { title: "Renamed", status: "published" })
check("update persists", findLocalEvent("evt_test")?.title === "Renamed", findLocalEvent("evt_test")?.title)
check("update keeps other fields", findLocalEvent("evt_test")?.capacity === "40 attendees")
check("update survives reload", listLocalEvents().find((e) => e.id === "evt_test")?.status === "published")

try {
  patchLocalEvent("does-not-exist", { title: "x" })
  check("update missing throws", false)
} catch {
  check("update missing throws", true)
}

removeLocalEvent("evt_test")
check("delete removes record", findLocalEvent("evt_test") === null)
check("delete leaves others", listLocalEvents().length === baseline.length, `${listLocalEvents().length} vs ${baseline.length}`)

try {
  removeLocalEvent("evt_test")
  check("delete missing throws", false)
} catch {
  check("delete missing throws", true)
}

const seeded = findLocalEvent("evt_001")
check("fixture readable by id", seeded?.title === "Phnom Penh Jazz Night", seeded?.title)

console.log("\n[ownership]")
check("owner matches", seeded?.organizerId === "usr_001", seeded?.organizerId)
check("other user does not own", seeded?.organizerId !== "usr_002")

console.log("\n[repository: ownership is enforced on write]")
const { createEvent: repoCreate, updateEvent: repoUpdate, deleteEvent: repoDelete, getEventById } = await import("../src/data/events-repository")

const repoCreated = await repoCreate(validValues)
// events.id is a uuid column, so a text id like "evt_ab12" is rejected by
// Postgres with 22P02. This is the check that catches that regression.
check("new ids are uuids", UUID_PATTERN.test(repoCreated.id), repoCreated.id)
// If the backend were not forced to local, this record would be in Supabase
// instead and the store would be untouched.
check("repository write landed in the local store", findLocalEvent(repoCreated.id) !== null)
check("repository create is readable", (await getEventById(repoCreated.id))?.title === validValues.title)
check("repository create defaults to the app offset", repoCreated.startDatetime === "2026-11-20T17:00:00+07:00", repoCreated.startDatetime)

const ownedUpdate = await repoUpdate(repoCreated.id, { ...validValues, title: "Renamed By Owner" })
check("owner can update", ownedUpdate.title === "Renamed By Owner", ownedUpdate.title)

try {
  await repoUpdate("evt_002", { ...validValues, title: "Hijacked" })
  check("non-owner cannot update", false)
} catch {
  check("non-owner cannot update", findLocalEvent("evt_002")?.title !== "Hijacked")
}

try {
  await repoDelete("evt_002")
  check("non-owner cannot delete", false)
} catch {
  check("non-owner cannot delete", findLocalEvent("evt_002") !== null)
}

try {
  await repoDelete("does-not-exist")
  check("delete missing throws in the repository", false)
} catch {
  check("delete missing throws in the repository", true)
}

try {
  await repoUpdate("does-not-exist", validValues)
  check("update missing throws in the repository", false)
} catch {
  check("update missing throws in the repository", true)
}

await repoDelete(repoCreated.id)
check("owner can delete", findLocalEvent(repoCreated.id) === null)

console.log("\n[signed out cannot create or manage]")
const { canManageEvent } = await import("../src/data/events-repository")
setAuthIdentityForTesting(null)
try {
  await repoCreate(validValues)
  check("create without an account throws", false)
} catch {
  check("create without an account throws", true)
}
check("canManageEvent is false when signed out", canManageEvent({ organizerId: TEST_OWNER_ID }) === false)
check("canManageEvent is false with no event", canManageEvent(null) === false)
setAuthIdentityForTesting({ id: TEST_OWNER_ID, email: "johndoe@example.com", displayName: "John Doe" })
check("canManageEvent is true for the owner", canManageEvent({ organizerId: TEST_OWNER_ID }) === true)
check("canManageEvent is false for a stranger", canManageEvent({ organizerId: STRANGER_ID }) === false)

console.log("\n[malformed storage falls back to the fixtures]")
const storeWith = (value: string) => void store.set("eventplanner_events", value)
storeWith(JSON.stringify([{ id: "evt_broken", title: "No tags field" }]))
check("stale shape is rejected", listLocalEvents().length === ALL_EVENTS.length, `${listLocalEvents().length} vs ${ALL_EVENTS.length}`)
storeWith("not json at all")
check("unparseable payload is rejected", listLocalEvents().length === ALL_EVENTS.length, `${listLocalEvents().length} vs ${ALL_EVENTS.length}`)
storeWith(JSON.stringify({ events: [] }))
check("wrong shape is rejected", listLocalEvents().length === ALL_EVENTS.length, `${listLocalEvents().length} vs ${ALL_EVENTS.length}`)
storeWith("[]")
check("empty array is honoured", listLocalEvents().length === 0, listLocalEvents().length)
resetLocalEvents()

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
