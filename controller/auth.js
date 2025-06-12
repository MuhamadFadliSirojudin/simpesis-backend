import jwt from "jsonwebtoken"
import prisma from "../lib/db.js";
export const register = async (req, res) => {
  const { username, password } = req.body;

  const isExist = await prisma.guru.findUnique({
    where: {
      username,
    },
  });

  if (isExist) {
    return res.status(409).json({
      error: "akun sudah terdaftar",
    });
  }

  const newUser = await prisma.guru.create({
    data: {
      username,
      password,
    },
  });

  return res.status(201).json({
    message: "Akun berhasil dibuat",
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.guru.findUnique({
    where: {
      username,
    },
  });

  if (!user) return res.status(404).json({
    message : `Akun dengan username: ${username} tidak ditemukan daftar terlebih dahulu`
  })

  if (user.password !== password) {
    return res.status(400).json({
      message: "Password anda tidak tepat"
    })
  } 

  const token = 'Bearer ' + jwt.sign({
    id : user.id
  },'LabschoolUPI', {
    expiresIn: 60 * 60 * 24
  })

  res.status(200).json({
    id: user.id,
    accessToken: token
  })
};
