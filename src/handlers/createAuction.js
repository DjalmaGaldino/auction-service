/*
  - event argument: in this object include all the information about the event on this execution (body, queryParameters, path parameters, headers, etc);
  - context argument: contain some metadata about the execution of this lambda function.
  se for retornar um objeto no body tem que fazer um stringFy
*/
import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import commonMiddleware from './lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createAuction(event, context) {
  const { title } = event.body
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    }
  }

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise()
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction)
  };
}

export const handler = commonMiddleware(createAuction)


