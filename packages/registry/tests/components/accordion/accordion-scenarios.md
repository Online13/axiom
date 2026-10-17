# Accordion

## Covered by `accordion.test.tsx`

### Structure

- Each trigger is a button reporting `expanded`; closed content isn't rendered at all.
- Pressing a trigger expands its section and its content enters the accessibility tree.

### `single`

- Opening a section closes the open one; each change is reported.
- The closing section leaves the accessibility tree at once and unmounts after its animation.
- Collapsible by default: pressing the open section closes it (reported as `""`).
- `collapsible={false}`: one section always stays open.

### `multiple`

- Sections open and close independently; changes are reported as the list of open values.
- `defaultValue` opens several sections.

### State

- Controlled: sections follow `value` only.
- A disabled item can't be opened, and stays closed even when its value is open.
- A disabled accordion disables every trigger.
- `forceMount` keeps closed content mounted: a field keeps what was typed in it.
- `Accordion.Item` outside an Accordion, or a Trigger outside an Item, throws a clear error.

## Checked on a device

- The height and fade animation, the chevron rotation, and Reduce Motion.
