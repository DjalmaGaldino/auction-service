import createError from 'http-errors'
import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuction } from "../lib/closeAuction";

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions()
    const closePromise = auctionsToClose.map(auction => closeAuction(auction))
    await Promise.all(closePromise)

    return { 
      closed: closePromise.length 
    }

  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }
 
}

export const handler = processAuctions;