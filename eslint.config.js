import lvucodes from "@lvucodes/ui/eslint";

// Re-export the shared flat config, adding the repo's own global ignores: the
// vendored Obsidian plugin sources and the user-owned reference notes are never
// linted here.
export default [...lvucodes, { ignores: [".obsidian", "reference"] }];
