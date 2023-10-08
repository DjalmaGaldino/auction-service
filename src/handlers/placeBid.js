
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import validator from '@middy/validator'
import createError from 'http-errors'
import { getAuctionById } from './getAuction'
import placeBidSchema from '../lib/schemas/placeBidSchema'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function placeBid(event, context) {
  const { id } = event.parameters
  const { amount } = event.body
  const { email } = event.requestContext.authorizer

  const auction = await getAuctionById(id)

  // Bid identity validation
  if (email === auction.seller) {
    throw new createError.Forbidden(`You cannot bid on your own auctions!`)
  }

  // Avoid double bidding
  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden(`You cannot bid on your own auctions!`)
  }

  // auction status validation
  if (auction.status !== 'OPEN') {
    throw new createError.Forbidden(`You are already the highest bidder!`)
  }

  // Bid amount validation
  if(amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(`your bid must be higher than ${auction.highestBid.amount}!`)
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email
    },
    ReturnValues: 'ALL_NEW'
  }

  let updateAuction

  try {
    const result = await dynamodb.update(params).promise()
    updateAuction = result.Attributes
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }
   
  return {
    statusCode: 200,
    body: JSON.stringify(updateAuction)
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBidSchema }))
