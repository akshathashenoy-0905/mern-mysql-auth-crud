const db = require('../config/db');

exports.getItems = async (req, res) => {
  const [items] = await db.query(
    'SELECT * FROM items WHERE user_id=?',
    [req.user.id]
  );
  res.json(items);
};

exports.addItem = async (req, res) => {
  const { title, description, status } = req.body;

  await db.query(
    'INSERT INTO items (user_id,title,description,status) VALUES (?,?,?,?)',
    [req.user.id, title, description, status]
  );

  res.json({ msg: 'Item added' });
};
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  await db.query(
    "UPDATE items SET title=?, description=?, status=? WHERE id=? AND user_id=?",
    [title, description, status, id, req.user.id]
  );

  res.json({ msg: "Item updated" });
};
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  await db.query(
    "DELETE FROM items WHERE id=? AND user_id=?",
    [id, req.user.id]
  );

  res.json({ msg: "Item deleted" });
};