const DB = [];

module.exports = {
  write: (ob) => DB.push(ob),
  readFor: (username) => {
    const entryIndex = DB.findIndex(({ to: stored }) => stored === username);
    if (entryIndex === -1) return undefined;
    const entry = DB[entryIndex];
    DB.splice(entryIndex, 1);
    return entry;
  },
};
