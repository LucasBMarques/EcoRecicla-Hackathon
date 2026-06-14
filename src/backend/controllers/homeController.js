const db = require("../config/db");

exports.getStats = (req, res) => {
  const usersQuery = "SELECT COUNT(*) as total FROM users";
  const pointsQuery = "SELECT COUNT(*) as total FROM collection_points";

  db.query(usersQuery, (err, usersResult) => {
    if (err) return res.status(500).json(err);

    db.query(pointsQuery, (err, pointsResult) => {
      if (err) return res.status(500).json(err);

     res.json({
        users: usersResult[0].total,
        points: pointsResult[0].total,
        recycled: 2300000 // valor estatico
      });
    });
  });
};