// src/db.ts
import { Connection } from 'mongoose';

// Глобальная переменная для хранения connection
let mongooseConnection: Connection | null = null;

export function setConnection(connection: Connection) {
  mongooseConnection = connection;
}

function getPostLikesCollection(): any {
  if (!mongooseConnection || !mongooseConnection.db) {
    throw new Error('Mongoose connection not initialized');
  }
  return mongooseConnection.db.collection('postLikes');
}

function getUsersCollection(): any {
  if (!mongooseConnection || !mongooseConnection.db) {
    throw new Error('Mongoose connection not initialized');
  }
  return mongooseConnection.db.collection('users');
}

export const postLikesCollection = {
  find: (filter: any) => getPostLikesCollection().find(filter),
  findOne: (filter: any) => getPostLikesCollection().findOne(filter),
  countDocuments: (filter: any) => getPostLikesCollection().countDocuments(filter)
};

export const usersCollection = {
  find: (filter: any) => getUsersCollection().find(filter),
  findOne: (filter: any) => getUsersCollection().findOne(filter),
  countDocuments: (filter: any) => getUsersCollection().countDocuments(filter)
};
