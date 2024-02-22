import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import redisClientPromise from "../RedisConnect";
import {createConnection} from "typeorm";
import "reflect-meta-data";

//dotenv
dotenv.config();

async function main() {
  try {
    // Create database connection
    const connection = await createConnection();

    // Connection established
    console.log('Connected to the database');

    // Additional application logic goes here

    // Close the database connection when the application exits
    await connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Call the main function to start the application
main();