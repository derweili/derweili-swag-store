export default {
  extends: ["@commitlint/config-conventional"],
  // Allow default Git merge commit messages (not conventional).
  ignores: [(message) => /^Merge\b/u.test(message.trim())],
};
