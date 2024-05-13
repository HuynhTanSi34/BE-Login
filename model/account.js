const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

///Connect Postgresql
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testLogin",
  password: "123456",
  port: 5432,
});

///Pool connect
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database");
  release();
});

const UserModel = {
  ///Lấy danh sách users
  getAllUsers: async () => {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM users");
      return result.rows;
    } finally {
      client.release();
    }
  },

  ///By id
  getUserById: async (userId) => {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // Phương thức đăng ký người dùng mới
  registerUser: async (username, password) => {
    const client = await pool.connect();
    try {
      // Kiểm tra xem người dùng đã tồn tại chưa
      const checkUserQuery = "SELECT * FROM users WHERE username = $1";
      const checkUserResult = await client.query(checkUserQuery, [username]);
      if (checkUserResult.rows.length > 0) {
        throw new Error("Username already exists");
      }

      // Thêm người dùng mới vào cơ sở dữ liệu
      const id = uuidv4();
      const registerQuery =
        "INSERT INTO users (id,username, password,active) VALUES ($1, $2,$3,$4) RETURNING *";
      const registerResult = await client.query(registerQuery, [
        id,
        username,
        password,
        true,
      ]);
      return registerResult.rows[0];
    } finally {
      client.release();
    }
  },

  // Phương thức đăng nhập
  loginUser: async (username, password) => {
    const client = await pool.connect();
    try {
      const loginQuery =
        "SELECT * FROM users WHERE username = $1 AND password = $2";
      const loginResult = await client.query(loginQuery, [username, password]);
      if (loginResult.rows.length > 0) {
        return loginResult.rows[0];
      } else {
        throw new Error("Invalid username or password");
      }
    } finally {
      client.release();
    }
  },
};
module.exports = UserModel;
